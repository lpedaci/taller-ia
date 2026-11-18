/* Taller - IA | Gráficos en SVG propio
   Formas: "barras" (comparar, siempre horizontales: se leen bien en mobile), "lineas" (evolución)
   y "mancuernas" (antes y después, por ejemplo el autodiagnóstico).
   Cada gráfico: título, unidad, fuente si los datos son externos, leyenda si hay más de una serie,
   etiquetas directas selectivas, tooltip al pasar el cursor y una tabla como alternativa.
   Colores: --app-chart-1 a 4 en orden fijo (css/charts.css). El texto usa los tokens de texto. */
import { esc } from "./util.js";
import { icono } from "./ui.js";
import { md } from "./lesson/markdown.js";
import { registrar } from "./lesson/bloques.js";
import { SIMULAR } from "./estados.js";

const NS = "http://www.w3.org/2000/svg";
const fmt = (v, cfg) => (cfg.decimales ? v.toFixed(cfg.decimales) : Math.round(v)).toString().replace(".", ",") + (cfg.sufijo || "");
/** Marcas del eje. Con una escala fija y corta (por ejemplo, de 1 a 5) se marca cada entero. */
function ticks(max, n = 4, min = 0, fija = false) {
  if (fija && max - min <= 10) return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  if (max <= 0) return [0, 1];
  const paso0 = max / n, mag = 10 ** Math.floor(Math.log10(paso0)), r = paso0 / mag;
  const paso = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * mag;
  const out = []; for (let v = 0; v <= max + paso * 0.001; v += paso) out.push(+v.toFixed(6));
  if (out[out.length - 1] < max) out.push(out[out.length - 1] + paso);
  return out;
}
const el = (tag, attrs = {}, padre) => { const n = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); padre && padre.appendChild(n); return n; };
const texto = (padre, x, y, t, cls, extra = {}) => { const n = el("text", { x, y, class: cls, ...extra }, padre); n.textContent = t; return n; };
/** Barra horizontal: esquina redondeada de 4 px solo en el extremo del dato, apoyada en la línea base */
const barraH = (x, y, w, h, r = 4) => w <= 0 ? "" : (w < r ? `M${x},${y}h${w}v${h}h${-w}z` : `M${x},${y}h${w - r}q${r},0 ${r},${r}v${h - 2 * r}q0,${r} ${-r},${r}h${-(w - r)}z`);

/* ---------- Tooltip ---------- */
function tooltip(fig) {
  let t = fig.querySelector(".chart-tip");
  if (!t) { t = document.createElement("div"); t.className = "chart-tip"; t.setAttribute("aria-hidden", "true"); fig.appendChild(t); }
  return {
    mostrar(html, x, y) {
      t.innerHTML = html; t.classList.add("show");
      const w = t.offsetWidth, W = fig.clientWidth;
      t.style.left = Math.max(0, Math.min(W - w, x + 12)) + "px"; t.style.top = Math.max(0, y - t.offsetHeight - 8) + "px";
    },
    ocultar() { t.classList.remove("show"); }
  };
}
const filaTip = (s, i, v, cfg) => `<span><i style="background:var(--app-chart-${i + 1})"></i>${esc(s.nombre)}: ${fmt(v, cfg)}</span>`;

/* ---------- Barras horizontales ---------- */
function barras(svg, cfg, W, tip, fig) {
  const S = cfg.series, C = cfg.categorias, angosto = W < 480;
  const max = cfg.max ?? Math.max(...S.flatMap(s => s.valores)), tk = ticks(max, 4, 0, cfg.max != null), top = tk[tk.length - 1];
  const etq = angosto ? 0 : Math.min(W * 0.38, 8 + Math.max(...C.map(c => c.length)) * 7.2);
  const bh = 16, gap = 2, grupo = S.length * bh + (S.length - 1) * gap, sep = angosto ? 36 : 16;
  const x0 = etq + (angosto ? 0 : 12), ancho = W - x0 - 48, alto = C.length * (grupo + sep) + 24;
  svg.setAttribute("viewBox", `0 0 ${W} ${alto}`);
  const xs = v => x0 + v / top * ancho;
  // En pantallas angostas el nombre va arriba de cada barra: la grilla se dibuja solo en la franja de las barras
  tk.forEach(v => { if (!angosto) el("line", { x1: xs(v), x2: xs(v), y1: 0, y2: alto - 24, class: v ? "grid" : "base" }, svg); texto(svg, xs(v), alto - 6, fmt(v, cfg), "ax-lbl", { "text-anchor": "middle" }); });
  C.forEach((c, i) => {
    const y = i * (grupo + sep) + (angosto ? 22 : sep / 2);
    if (angosto) tk.forEach(v => el("line", { x1: xs(v), x2: xs(v), y1: y - 2, y2: y + grupo + 2, class: v ? "grid" : "base" }, svg));
    if (angosto) texto(svg, x0, y - 6, c, "cat-lbl"); else texto(svg, etq, y + grupo / 2 + 4, c, "cat-lbl", { "text-anchor": "end" });
    S.forEach((s, j) => {
      const v = s.valores[i], yy = y + j * (bh + gap);
      el("path", { d: barraH(x0, yy, xs(v) - x0, bh), class: `bar s${j + 1} grow`, style: `animation-delay:${(i * S.length + j) * 30}ms` }, svg);
      texto(svg, xs(v) + 6, yy + bh - 3, fmt(v, cfg), "val-lbl fade");
    });
    const hit = el("rect", { x: 0, y: y - 4, width: W, height: grupo + 8, class: "hit" }, svg);
    hit.addEventListener("pointermove", e => { const r = fig.getBoundingClientRect(); tip.mostrar(`<b>${esc(c)}</b>` + S.map((s, j) => filaTip(s, j, s.valores[i], cfg)).join(""), e.clientX - r.left, e.clientY - r.top); });
    hit.addEventListener("pointerleave", tip.ocultar);
  });
}

/* ---------- Líneas ---------- */
function lineas(svg, cfg, W, tip, fig) {
  const S = cfg.series, C = cfg.categorias, angosto = W < 480;
  const max = cfg.max ?? Math.max(...S.flatMap(s => s.valores)), tk = ticks(max), top = tk[tk.length - 1];
  const x0 = 56, x1 = W - (angosto ? 36 : 104), alto = angosto ? 220 : 260, y0 = 12, y1 = alto - 28;
  svg.setAttribute("viewBox", `0 0 ${W} ${alto}`);
  const xs = i => x0 + (C.length === 1 ? 0 : i / (C.length - 1) * (x1 - x0)), ys = v => y1 - v / top * (y1 - y0);
  tk.forEach(v => { el("line", { x1: x0, x2: x1, y1: ys(v), y2: ys(v), class: v ? "grid" : "base" }, svg); texto(svg, x0 - 12, ys(v) + 4, fmt(v, cfg), "ax-lbl", { "text-anchor": "end" }); });
  // Etiquetas del eje: solo las que entran sin pisarse (una cada tantas según el ancho)
  const lugar = (x1 - x0) / Math.max(1, C.length - 1), largo = Math.max(...C.map(c => c.length)) * 6.6 + 12;
  const cada = Math.max(1, Math.ceil(largo / lugar));
  C.forEach((c, i) => { if (i % cada === 0) texto(svg, xs(i), alto - 8, c, "ax-lbl", { "text-anchor": "middle" }); });
  S.forEach((s, j) => {
    el("path", { d: s.valores.map((v, i) => `${i ? "L" : "M"}${xs(i)},${ys(v)}`).join(""), class: `line s${j + 1} fade` }, svg);
    const u = s.valores.length - 1;
    el("circle", { cx: xs(u), cy: ys(s.valores[u]), r: 5, class: `dot s${j + 1}` }, svg);
    // Etiqueta directa solo al final de cada serie (no un número en cada punto)
    if (!angosto) texto(svg, xs(u) + 10, ys(s.valores[u]) + 4, `${s.nombre} ${fmt(s.valores[u], cfg)}`, "val-lbl fade");
  });
  const cruz = el("line", { y1: y0, y2: y1, class: "cross", visibility: "hidden" }, svg);
  C.forEach((c, i) => {
    const w = (x1 - x0) / Math.max(1, C.length - 1);
    const hit = el("rect", { x: xs(i) - w / 2, y: 0, width: w, height: alto, class: "hit" }, svg);
    hit.addEventListener("pointermove", e => { cruz.setAttribute("x1", xs(i)); cruz.setAttribute("x2", xs(i)); cruz.setAttribute("visibility", "visible");
      const r = fig.getBoundingClientRect(); tip.mostrar(`<b>${esc(c)}</b>` + S.map((s, j) => filaTip(s, j, s.valores[i], cfg)).join(""), e.clientX - r.left, e.clientY - r.top); });
    hit.addEventListener("pointerleave", () => { cruz.setAttribute("visibility", "hidden"); tip.ocultar(); });
  });
}

/* ---------- Mancuernas: antes (anillo neutro) y después (punto de color) ---------- */
function mancuernas(svg, cfg, W, tip, fig) {
  const [A, D] = cfg.series, C = cfg.categorias, angosto = W < 480;
  const min = cfg.min ?? 0, max = cfg.max ?? Math.max(...A.valores, ...D.valores), tk = ticks(max, 4, min, cfg.max != null), top = tk[tk.length - 1];
  const etq = angosto ? 0 : Math.min(W * 0.38, 8 + Math.max(...C.map(c => c.length)) * 7.2);
  const fila = angosto ? 52 : 36, x0 = etq + (angosto ? 8 : 16), ancho = W - x0 - 40, alto = C.length * fila + 28;
  svg.setAttribute("viewBox", `0 0 ${W} ${alto}`);
  const xs = v => x0 + (v - min) / (top - min) * ancho;
  tk.forEach(v => { if (!angosto) el("line", { x1: xs(v), x2: xs(v), y1: 0, y2: alto - 24, class: v > min ? "grid" : "base" }, svg); texto(svg, xs(v), alto - 6, fmt(v, cfg), "ax-lbl", { "text-anchor": "middle" }); });
  C.forEach((c, i) => {
    const y = i * fila + (angosto ? 34 : fila / 2), a = A.valores[i], d = D.valores[i];
    if (angosto) tk.forEach(v => el("line", { x1: xs(v), x2: xs(v), y1: y - 9, y2: y + 9, class: v > min ? "grid" : "base" }, svg));
    if (angosto) texto(svg, x0, y - 14, c, "cat-lbl"); else texto(svg, etq, y + 4, c, "cat-lbl", { "text-anchor": "end" });
    el("line", { x1: xs(a), x2: xs(d), y1: y, y2: y, class: "link fade" }, svg);
    el("circle", { cx: xs(a), cy: y, r: 6, class: "dot-antes fade", fill: "var(--app-color-card)", stroke: "var(--md-sys-color-on-surface-variant)", "stroke-width": 2 }, svg);
    el("circle", { cx: xs(d), cy: y, r: 7, class: "dot s1 fade" }, svg);
    texto(svg, xs(d) + (d >= a ? 12 : -12), y + 4, fmt(d, cfg), "val-lbl fade", { "text-anchor": d >= a ? "start" : "end" });
    const hit = el("rect", { x: 0, y: y - fila / 2, width: W, height: fila, class: "hit" }, svg);
    hit.addEventListener("pointermove", e => { const r = fig.getBoundingClientRect(); tip.mostrar(`<b>${esc(c)}</b><span>${esc(A.nombre)}: ${fmt(a, cfg)}</span><span>${esc(D.nombre)}: ${fmt(d, cfg)}</span>`, e.clientX - r.left, e.clientY - r.top); });
    hit.addEventListener("pointerleave", tip.ocultar);
  });
}

const FORMAS = { barras, lineas, mancuernas };
const NOMBRE_FORMA = { barras: "Gráfico de barras", lineas: "Gráfico de líneas", mancuernas: "Gráfico de antes y después" };

/** Resumen para lectores de pantalla (el detalle completo está en la tabla) */
function resumen(cfg) {
  if (cfg.resumen) return cfg.resumen;
  return `${NOMBRE_FORMA[cfg.forma]}: ${cfg.titulo}${cfg.unidad ? ", en " + cfg.unidad : ""}. Los valores están en la tabla que sigue.`;
}

/** HTML del gráfico completo: encabezado, leyenda, zona del dibujo, tabla y fuente */
export function graficoHTML(cfg, id, nivel = 4) {
  const S = cfg.series, ley = S.length > 1;
  return `<figure class="chart" data-grafico="${esc(id)}"><div class="chart-head"><h${nivel} id="${esc(id)}-t">${esc(cfg.titulo)}</h${nivel}>${cfg.unidad ? `<p>Unidad: ${esc(cfg.unidad)}</p>` : ""}</div>` +
    (ley ? `<ul class="chart-legend" aria-hidden="true">${S.map((s, i) => `<li><i class="${cfg.forma === "mancuernas" ? (i ? "dot s1" : "dot") : "s" + (i + 1)}"${cfg.forma === "mancuernas" && !i ? ' style="border:2px solid var(--md-sys-color-on-surface-variant)"' : ""}></i>${esc(s.nombre)}</li>`).join("")}</ul>` : "") +
    `<div class="chart-plot" aria-busy="true"><div class="chart-sk" aria-hidden="true">${'<div class="sk"></div>'.repeat(Math.min(6, cfg.categorias.length))}</div></div>` +
    `<details class="alt"><summary>${icono("table", "sm")}Ver como tabla</summary><div class="tbl-wrap"><table class="tbl"><caption class="sr-only">${esc(cfg.titulo)}${cfg.unidad ? " (" + esc(cfg.unidad) + ")" : ""}</caption>` +
      `<thead><tr><th scope="col">${esc(cfg.ejeCategorias || "Categoría")}</th>${S.map(s => `<th scope="col">${esc(s.nombre)}</th>`).join("")}</tr></thead>` +
      `<tbody>${cfg.categorias.map((c, i) => `<tr><th scope="row">${esc(c)}</th>${S.map(s => `<td>${fmt(s.valores[i], cfg)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>` +
    (cfg.fuente ? `<p class="chart-src">Fuente: ${md(cfg.fuente).replace(/^<p>|<\/p>$/g, "")}</p>` : "") + `</figure>`;
}

/** Dibuja (y redibuja al cambiar el ancho) el gráfico dentro de su figura */
export function montarGrafico(fig, cfg) {
  const plot = fig.querySelector(".chart-plot"), tip = tooltip(fig);
  let ultimo = 0;
  const dibujar = () => {
    const W = Math.round(plot.clientWidth); if (!W || W === ultimo) return; ultimo = W;
    plot.innerHTML = "";
    const svg = el("svg", { role: "img", "aria-label": resumen(cfg), preserveAspectRatio: "xMinYMin meet" }, plot);
    FORMAS[cfg.forma](svg, cfg, W, tip, fig);
    plot.setAttribute("aria-busy", "false");
  };
  const empezar = () => { dibujar(); new ResizeObserver(() => { ultimo && dibujar(); }).observe(plot); };
  // Con ?simular=lento se ve el skeleton con la forma del gráfico antes de los datos
  SIMULAR === "lento" ? setTimeout(empezar, 1500) : requestAnimationFrame(empezar);
}

/* ---------- Bloque de lección ---------- */
let n = 0;
registrar("grafico", {
  render: b => graficoHTML(b, "g" + (++n) + "-" + (b.id || "x")),
  montar: (elBloque, b) => montarGrafico(elBloque.querySelector(".chart"), b)
});
