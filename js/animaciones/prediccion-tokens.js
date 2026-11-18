/* Taller - IA | Animación piloto: cómo un asistente escribe, de a un fragmento por vez
   Guion: animaciones/guiones/01-prediccion-de-tokens.md. Textos: content/animaciones/prediccion-tokens.json.
   Cada escena devuelve dibujar(p): el estado de la escena para un avance p entre 0 y 1. */
import { nodo, fluir, tramo, ease } from "../animacion.js";

const angosto = W => W < 1000;
const tam = (W, ancho, chico) => angosto(W) ? chico : ancho;
const palabras = s => s.split(" ").filter(Boolean);

/** Texto en pantalla, abajo, que aparece desde el momento "desde" */
function leyenda(svg, W, H, texto, desde = 0.55) {
  if (!texto) return () => {};
  const size = tam(W, 64, 44), f = fluir(svg, palabras(texto), { x: W * 0.06, y: 0, maxW: W * 0.88, size, clase: "an-cap" });
  f.g.setAttribute("transform", `translate(0 ${H - 56 - f.alto})`);
  return p => { const t = ease.effects(tramo(p, desde, desde + 0.12)); f.g.style.opacity = t; };
}

/** Burbuja de chat: texto que fluye y un fondo redondeado que crece con lo visible */
function burbuja(svg, piezas, { x, y, maxW, size, lado = "izq", clase }) {
  const pad = size * 0.55, fondo = nodo("rect", { rx: size * 0.7, class: `an-bub ${clase}` }, svg);
  const f = fluir(svg, piezas, { x: x + pad, y: y + pad * 0.6, maxW: maxW - pad * 2, size, clase: `an-bub-t ${clase}-t` });
  const anchoTotal = f.ancho + pad * 2;
  const dx = lado === "der" ? (x + maxW) - (x + anchoTotal) : 0;
  f.g.setAttribute("transform", `translate(${dx} 0)`);
  fondo.setAttribute("x", x + dx); fondo.setAttribute("y", y); fondo.setAttribute("width", anchoTotal);
  /** Muestra las primeras n piezas y ajusta el alto del fondo a lo visible */
  const mostrar = n => {
    f.piezas.forEach((pz, k) => { pz.n.style.opacity = k < n ? 1 : 0; });
    const ult = f.piezas[Math.max(0, Math.min(n, f.piezas.length) - 1)];
    const alto = ult ? ult.y - (y + pad * 0.6) + size * 0.45 + pad : pad * 2;
    fondo.setAttribute("height", Math.max(size + pad * 1.2, alto));
    return alto;
  };
  return { f, fondo, mostrar, dx, pad, alto: f.alto + pad * 1.6 };
}

/* ---------- Escena 1: el pedido de Ana ---------- */
function escena1(svg, { W, H, d, e }) {
  const size = tam(W, 60, 42);
  const hora = nodo("text", { x: W / 2, y: tam(W, 96, 110), "text-anchor": "middle", class: "an-muted", "font-size": tam(W, 42, 32) }, svg);
  hora.textContent = `Ana | ${d.hora}`;
  const b = burbuja(svg, palabras(d.pedido), { x: W * (angosto(W) ? 0.08 : 0.3), y: tam(W, 150, 170), maxW: W * (angosto(W) ? 0.84 : 0.62), size, lado: "der", clase: "an-user" });
  const env = nodo("text", { x: W * (angosto(W) ? 0.92 : 0.92), y: 0, "text-anchor": "end", class: "an-muted", "font-size": tam(W, 34, 28) }, svg);
  env.textContent = "Enviado";
  const ley = leyenda(svg, W, H, e.pantalla);
  return p => {
    b.fondo.style.opacity = ease.effects(tramo(p, 0, 0.06));
    const n = Math.ceil(tramo(p, 0.05, 0.7) * b.f.piezas.length);
    const alto = b.mostrar(n);
    env.setAttribute("y", tam(W, 150, 170) + alto + 44);
    env.style.opacity = ease.effects(tramo(p, 0.78, 0.86));
    ley(p);
  };
}

/* ---------- Escena 2: el mensaje se parte en tokens ---------- */
function escena2(svg, { W, H, d, e }) {
  const size = tam(W, 50, 36), gap = tam(W, 40, 30);
  const tit = nodo("text", { x: W * 0.06, y: tam(W, 96, 110), class: "an-muted", "font-size": tam(W, 40, 30) }, svg);
  tit.textContent = "El mensaje de Ana, en fragmentos";
  const piezas = d.tokens.map((t, k) => ({ t: t.trim(), clase: d.partido.includes(k) ? "an-tok-t an-split-t" : "an-tok-t" }));
  const f = fluir(svg, piezas, { x: W * 0.06 + 12, y: tam(W, 150, 170), maxW: W * 0.88 - 24, size, alto: size * 2.5, espacio: false, gap });
  const cajas = f.piezas.map((pz, k) => {
    const r = nodo("rect", { x: pz.x - 10, y: pz.y - size * 1.05, width: pz.w + 20, height: size * 1.55, rx: 12, class: d.partido.includes(k) ? "an-tok an-split" : "an-tok" });
    f.g.insertBefore(r, f.g.firstChild); return r;
  });
  // Debajo de "médico": una palabra, dos fragmentos
  const [k1, k2] = d.partido, a1 = f.piezas[k1], a2 = f.piezas[k2];
  const nota = nodo("text", { x: (a1.x + a2.x + a2.w) / 2, y: a1.y + size * 1.25, "text-anchor": "middle", class: "an-split-t", "font-size": size * 0.6 }, svg);
  nota.textContent = "una palabra, dos fragmentos";
  const ley = leyenda(svg, W, H, e.pantalla, 0.5);
  return p => {
    f.piezas.forEach((pz, k) => {
      const t = ease.spatial(tramo(p, 0.04 + k * 0.016, 0.16 + k * 0.016)), dy = (1 - t) * 24;
      [pz.n, cajas[k]].forEach(el => { el.style.opacity = Math.min(1, t * 1.2); el.style.transform = `translateY(${dy}px)`; });
    });
    nota.style.opacity = ease.effects(tramo(p, 0.6, 0.7));
    ley(p);
  };
}

/* ---------- Respuesta + barras (escenas 3 y 4) ---------- */
function respuestaYBarras(svg, { W, H, d }, todas) {
  const size = tam(W, 56, 38);
  const piezas = palabras(d.inicioRespuesta).concat(todas ? [{ t: d.candidatos[0].t, clase: "an-elegido-t" }, ...d.continuacion] : []);
  const b = burbuja(svg, piezas, { x: W * 0.06, y: tam(W, 70, 80), maxW: W * (angosto(W) ? 0.88 : 0.66), size, clase: "an-bot" });
  const nInicio = palabras(d.inicioRespuesta).length;
  // Las barras quedan en el mismo lugar en las escenas 3 y 4: debajo de la respuesta inicial
  const altoInicio = b.mostrar(nInicio);
  // Lugar del fragmento que falta
  const ult = b.f.piezas[nInicio - 1];
  const hueco = nodo("rect", { x: ult.x + ult.w + size * 0.3, y: ult.y - size * 0.95, width: size * 1.6, height: size * 1.3, rx: 8, class: "an-hueco" }, svg);
  // La burbuja deja lugar para el fragmento que falta
  if (!todas) b.fondo.setAttribute("width", Math.max(+b.fondo.getAttribute("width"), ult.x + ult.w + size * 2.3 - W * 0.06));
  // Barras de probabilidad
  const top = tam(W, 70, 80) + altoInicio + tam(W, 90, 80);
  const xb = W * 0.06, lblW = tam(W, 190, 140), maxBar = W * (angosto(W) ? 0.56 : 0.5), fila = tam(W, 76, 70), bs = tam(W, 46, 34);
  const nota = nodo("text", { x: xb, y: top - 16, class: "an-muted", "font-size": tam(W, 32, 26) }, svg);
  nota.textContent = "Valores ilustrativos";
  const max = Math.max(...d.candidatos.map(c => c.p));
  const barras = d.candidatos.map((c, k) => {
    const y = top + k * fila, g = nodo("g", {}, svg);
    const lbl = nodo("text", { x: xb, y: y + bs * 0.72, class: "an-cand", "font-size": bs }, g); lbl.textContent = c.t;
    const bar = nodo("rect", { x: xb + lblW, y: y + 4, height: bs, rx: 6, width: 0, class: "an-bar" }, g);
    const pct = nodo("text", { y: y + bs * 0.72, class: "an-pct", "font-size": bs * 0.85 }, g); pct.textContent = `${c.p} %`;
    return { g, lbl, bar, pct, w: c.p / max * maxBar, y };
  });
  return { b, hueco, barras, nota, nInicio, xb, lblW, size };
}

function escena3(svg, ctx) {
  const { W, H, e } = ctx, r = respuestaYBarras(svg, ctx, false);
  const ley = leyenda(svg, W, H, e.pantalla, 0.22);
  return p => {
    r.b.fondo.style.opacity = ease.effects(tramo(p, 0, 0.05));
    r.b.mostrar(Math.ceil(tramo(p, 0.03, 0.25) * r.nInicio));
    r.hueco.style.opacity = ease.effects(tramo(p, 0.26, 0.32));
    r.nota.style.opacity = ease.effects(tramo(p, 0.32, 0.4));
    r.barras.forEach((bb, k) => {
      const t = ease.spatial(tramo(p, 0.34 + k * 0.07, 0.54 + k * 0.07));
      bb.bar.setAttribute("width", Math.max(0, bb.w * t));
      bb.pct.setAttribute("x", r.xb + r.lblW + bb.w * t + 14);
      bb.lbl.style.opacity = ease.effects(tramo(p, 0.32 + k * 0.07, 0.42 + k * 0.07));
      bb.pct.style.opacity = ease.effects(tramo(p, 0.5 + k * 0.07, 0.58 + k * 0.07));
    });
    ley(p);
  };
}

function escena4(svg, ctx) {
  const { W, H, d, e } = ctx, r = respuestaYBarras(svg, ctx, true);
  const total = r.b.f.piezas.length, elegido = r.b.f.piezas[r.nInicio];
  const volador = nodo("text", { class: "an-elegido-t", "font-size": r.size }, svg); volador.textContent = d.candidatos[0].t;
  const ley = leyenda(svg, W, H, e.pantalla, 0.82);
  r.barras.forEach(bb => { bb.bar.setAttribute("width", bb.w); bb.pct.setAttribute("x", r.xb + r.lblW + bb.w + 14); });
  return p => {
    // 1. Se resalta la opción elegida
    const sel = tramo(p, 0.02, 0.12);
    r.barras[0].bar.setAttribute("class", sel > 0 ? "an-bar an-bar-sel" : "an-bar");
    // 2. Viaja al lugar vacío de la respuesta
    const v = ease.spatial(tramo(p, 0.14, 0.34));
    const x0 = r.xb, y0 = r.barras[0].y + r.size * 0.8;
    volador.setAttribute("x", x0 + (elegido.x + r.b.dx - x0) * v);
    volador.setAttribute("y", y0 + (elegido.y - y0) * v);
    volador.style.opacity = p < 0.34 ? 1 : 0;
    r.hueco.style.opacity = p < 0.3 ? 1 : 0;
    // 3. Las barras se van y la respuesta sigue, fragmento a fragmento
    const fuera = 1 - ease.effects(tramo(p, 0.34, 0.44));
    r.barras.forEach(bb => { bb.g.style.opacity = fuera; }); r.nota.style.opacity = fuera;
    const extra = Math.ceil(tramo(p, 0.46, 0.8) * (total - r.nInicio - 1));
    r.b.mostrar(r.nInicio + (p >= 0.34 ? 1 : 0) + (p >= 0.34 ? extra : 0));
    ley(p);
  };
}

/* ---------- Escena 5: otras versiones y un dato inventado ---------- */
function escena5(svg, { W, H, d, e }) {
  const size = tam(W, 44, 30), x = W * 0.06, maxW = W * (angosto(W) ? 0.88 : 0.8);
  const final = `${d.inicioRespuesta} ${d.candidatos[0].t} ${d.continuacion.join(" ")}`;
  let y = tam(W, 50, 60);
  const etq = (t, yy) => { const n = nodo("text", { x, y: yy, class: "an-muted", "font-size": tam(W, 32, 26) }, svg); n.textContent = t; return n; };
  const e1 = etq("Primera respuesta", y + 26);
  const b1 = burbuja(svg, palabras(final), { x, y: y + 40, maxW, size, clase: "an-bot" }); b1.mostrar(999);
  y += 40 + b1.alto + tam(W, 34, 30);
  const e2 = etq("Si lo pide de nuevo", y + 26);
  const b2 = burbuja(svg, palabras(d.versiones[0].texto), { x, y: y + 40, maxW, size, clase: "an-bot" }); b2.mostrar(999);
  y += 40 + b2.alto + tam(W, 34, 30);
  const e3 = etq("Y otra vez", y + 26);
  const v3 = d.versiones[1];
  const piezas3 = palabras(v3.texto).concat(palabras(v3.inventado).map(t => ({ t, clase: "an-inv-t" })));
  const b3 = burbuja(svg, piezas3, { x, y: y + 40, maxW, size, clase: "an-bot" }); b3.mostrar(999);
  const inv = b3.f.piezas.filter(pz => pz.n.getAttribute("class").includes("an-inv-t"));
  const marcas = inv.map(pz => { const m = nodo("rect", { x: pz.x - 6 + b3.dx, y: pz.y - size * 0.95, width: pz.w + 12, height: size * 1.35, rx: 6, class: "an-inv" }); b3.f.g.insertBefore(m, b3.f.g.firstChild); return m; });
  const ny = y + 40 + b3.alto + tam(W, 46, 44);
  const ic = nodo("text", { x, y: ny, class: "an-warn-ic", "font-size": tam(W, 38, 36) }, svg); ic.textContent = "warning";
  const nota = nodo("text", { x: x + tam(W, 50, 46), y: ny - 4, class: "an-warn-t", "font-size": tam(W, 32, 30) }, svg); nota.textContent = v3.nota;
  const ley = leyenda(svg, W, H, e.pantalla, 0.8);
  return p => {
    const muestra = (els, a) => els.forEach(el => { const t = ease.spatial(tramo(p, a, a + 0.14)); el.style.opacity = Math.min(1, t); el.style.transform = `translateY(${(1 - t) * 20}px)`; });
    muestra([e1, b1.fondo, b1.f.g], 0);
    muestra([e2, b2.fondo, b2.f.g], 0.12);
    muestra([e3, b3.fondo, b3.f.g], 0.3);
    const m = ease.effects(tramo(p, 0.55, 0.65));
    marcas.forEach(r => { r.style.opacity = m; });
    [ic, nota].forEach(el => { el.style.opacity = ease.effects(tramo(p, 0.62, 0.72)); });
    ley(p);
  };
}

export const escenas = [escena1, escena2, escena3, escena4, escena5];
