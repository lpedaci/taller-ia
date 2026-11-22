/* Taller - IA | Piezas comunes para las animaciones por escenas (D-067)
   La mayoría de las animaciones explican un proceso: cajas con un ícono, flechas que se dibujan,
   un punto que recorre el camino y un texto en pantalla. Cada escena declara qué aparece y cuándo,
   para el lienzo horizontal (1600 x 900) y el vertical (720 x 900, mobile). */
import { nodo, fluir, tramo, ease } from "../animacion.js";

export const angosto = W => W < 1000;
export const tam = (W, ancho, chico) => angosto(W) ? chico : ancho;
export const palabras = s => s.split(" ").filter(Boolean);

/** Texto en pantalla, abajo, que aparece desde el momento "desde" */
export function leyenda(svg, W, H, texto, desde = 0.55) {
  if (!texto) return () => {};
  const size = tam(W, 52, 38), f = fluir(svg, palabras(texto), { x: W * 0.06, y: 0, maxW: W * 0.88, size, clase: "an-cap" });
  f.g.setAttribute("transform", `translate(0 ${H - 48 - f.alto})`);
  return p => { f.g.style.opacity = ease.effects(tramo(p, desde, desde + 0.12)); };
}

/** Título breve arriba a la izquierda */
export function rotulo(svg, W, texto) {
  const n = nodo("text", { x: W * 0.06, y: tam(W, 80, 84), class: "an-muted", "font-size": tam(W, 36, 34) }, svg);
  n.textContent = texto; return n;
}

/** Aparece con un leve desplazamiento hacia arriba (spring espacial) */
export function aparecer(els, p, a, b = a + 0.12, dy = 18) {
  const t = ease.spatial(tramo(p, a, b));
  [].concat(els).forEach(el => { if (!el) return; el.style.opacity = Math.min(1, Math.max(0, t)); el.style.transform = `translateY(${(1 - Math.min(1, t)) * dy}px)`; });
  return t;
}
export const fundido = (els, p, a, b = a + 0.1) => { const t = ease.effects(tramo(p, a, b)); [].concat(els).forEach(el => { if (el) el.style.opacity = t; }); return t; };

/** Caja con ícono, título y una línea opcional. Devuelve su geometría para unir flechas. */
export function caja(svg, { x, y, w, h, ic, t, sub, tipo = "" }, W) {
  const g = nodo("g", { class: `an-caja ${tipo ? "an-caja-" + tipo : ""}`.trim() }, svg);
  const r = nodo("rect", { x, y, width: w, height: h, rx: tam(W, 28, 22), class: "an-caja-r" }, g);
  const icS = tam(W, 54, 50), tS = tam(W, 38, 36), sS = tam(W, 28, 28);
  const icy = y + (sub ? h * 0.26 : h * 0.36);
  const icn = nodo("text", { x: x + w / 2, y: icy + icS * 0.4, "text-anchor": "middle", class: "an-caja-ic", "font-size": icS }, g); icn.textContent = ic;
  const tt = nodo("text", { x: x + w / 2, y: icy + icS * 0.4 + tS * 1.15, "text-anchor": "middle", class: "an-caja-t", "font-size": tS }, g); tt.textContent = t;
  let st = null;
  if (sub) { st = nodo("text", { x: x + w / 2, y: icy + icS * 0.4 + tS * 1.15 + sS * 1.2, "text-anchor": "middle", class: "an-caja-s", "font-size": sS }, g); st.textContent = sub; }
  return { g, r, x, y, w, h, cx: x + w / 2, cy: y + h / 2, sub: st, t: tt };
}

/** Punto del borde de una caja en dirección a (tx, ty) */
function borde(c, tx, ty, margen = 10) {
  const dx = tx - c.cx, dy = ty - c.cy;
  if (!dx && !dy) return [c.cx, c.cy];
  const sx = (c.w / 2 + margen) / Math.abs(dx || 1e-6), sy = (c.h / 2 + margen) / Math.abs(dy || 1e-6), s = Math.min(sx, sy);
  return [c.cx + dx * s, c.cy + dy * s];
}

/** Flecha entre dos cajas que se dibuja con el avance. curva: desplazamiento perpendicular (0 = recta). */
export function flecha(svg, a, b, { curva = 0, clase = "", etiqueta = "" } = {}, W) {
  const [x1, y1] = borde(a, b.cx, b.cy), [x2, y2] = borde(b, a.cx, a.cy);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const qx = mx - (y2 - y1) / len * curva, qy = my + (x2 - x1) / len * curva;
  const g = nodo("g", { class: `an-fl ${clase}`.trim() }, svg);
  const path = nodo("path", { d: `M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}`, class: "an-fl-l" }, g);
  const L = path.getTotalLength();
  path.style.strokeDasharray = L; path.style.strokeDashoffset = L;
  // Punta: un triángulo orientado según la tangente final
  const ang = Math.atan2(y2 - qy, x2 - qx), s = tam(W, 18, 16);
  const punta = nodo("path", { d: `M0 0 L${-s} ${-s * 0.6} L${-s} ${s * 0.6} Z`, class: "an-fl-p", transform: `translate(${x2} ${y2}) rotate(${ang * 180 / Math.PI})` }, g);
  let lbl = null;
  if (etiqueta) {
    // La etiqueta va al costado del punto medio de la curva, del lado de afuera: a la derecha en las flechas
    // verticales y arriba en las horizontales, para no pisar la línea
    const fs = tam(W, 30, 28), bx = 0.25 * x1 + 0.5 * qx + 0.25 * x2, by = 0.25 * y1 + 0.5 * qy + 0.25 * y2;
    let nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    if (Math.abs(nx) > Math.abs(ny)) { if (nx < 0) { nx = -nx; ny = -ny; } } else if (ny > 0) { nx = -nx; ny = -ny; }
    if (curva) { const cx = qx - mx, cy = qy - my; if (cx * nx + cy * ny < 0) { nx = -nx; ny = -ny; } }
    const d = tam(W, 18, 14);
    lbl = nodo("text", { x: bx + nx * d, y: by + ny * d + (Math.abs(nx) > 0.5 ? fs * 0.35 : 0), "text-anchor": nx > 0.5 ? "start" : nx < -0.5 ? "end" : "middle", class: "an-fl-t", "font-size": fs }, g);
    lbl.textContent = etiqueta;
  }
  /** t de 0 a 1: cuánto de la flecha está dibujado */
  const dibujar = t => { path.style.strokeDashoffset = L * (1 - t); punta.style.opacity = t > 0.96 ? 1 : 0; if (lbl) lbl.style.opacity = ease.effects(tramo(t, 0.5, 1)); };
  dibujar(0);
  return { g, path, L, dibujar, punto: t => path.getPointAtLength(L * t) };
}

/** Un punto que recorre una flecha (para mostrar algo que viaja: un dato, un mensaje) */
export function viajero(svg, W, clase = "an-viaje") {
  const c = nodo("circle", { r: tam(W, 14, 12), class: clase }, svg);
  c.style.opacity = 0;
  return { c, en: (fl, t, visible = true) => { const pt = fl.punto(Math.max(0, Math.min(1, t))); c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); c.style.opacity = visible && t > 0 && t < 1 ? 1 : 0; } };
}

/** Marco que envuelve un conjunto de cajas (por ejemplo, la Diligencia en el marco 4D) */
export function marco(svg, cajas, { pad = 40, t = "", clase = "" } = {}, W) {
  const x = Math.min(...cajas.map(c => c.x)) - pad, y = Math.min(...cajas.map(c => c.y)) - pad - (t ? tam(W, 40, 36) : 0);
  const x2 = Math.max(...cajas.map(c => c.x + c.w)) + pad, y2 = Math.max(...cajas.map(c => c.y + c.h)) + pad;
  const g = nodo("g", { class: `an-marco ${clase}`.trim() }, svg);
  nodo("rect", { x, y, width: x2 - x, height: y2 - y, rx: tam(W, 36, 28), class: "an-marco-r" }, g);
  if (t) { const n = nodo("text", { x: x + tam(W, 28, 22), y: y + tam(W, 40, 34), class: "an-marco-t", "font-size": tam(W, 28, 24) }, g); n.textContent = t; }
  return g;
}

/** Ubica cajas según la orientación: pos = { h: [fx, fy], v: [fx, fy] } en fracciones del lienzo (centro de la caja) */
export function ubicar(W, H, pos, { w, h } = {}) {
  const [fx, fy] = angosto(W) ? pos.v : pos.h;
  const bw = w ?? tam(W, 290, 300), bh = h ?? tam(W, 170, 150);
  return { x: fx * W - bw / 2, y: fy * H - bh / 2, w: bw, h: bh };
}

/** Resalta una caja (borde de color primario) entre a y b */
export function resaltar(c, p, a, b = 1) { c.g.classList.toggle("is-on", p >= a && p <= b); }

/** Arma las escenas de un proceso. def = {
     nodos: [{ id, ic, t, sub, h: [fx, fy], v: [fx, fy], tipo, w, h2 }],
     aristas: [{ id, de, a, curva, etiqueta, clase, curvaV }],
     marcos: [{ id, ids: [...], t }],
     escenas: [{ rotulo, nuevos: [ids en orden], viajes: [ids de aristas], resalta: [ids], extra: (svg, ctx, objs) => p => {} }] }
   Lo que apareció en escenas anteriores ya está; lo nuevo entra en orden entre 0,06 y 0,6 del avance. */
export function proceso(def) {
  return def.escenas.map((esc, k) => (svg, ctx) => {
    const { W, H, e } = ctx, objs = {};
    const previos = new Set(def.escenas.slice(0, k).flatMap(x => x.nuevos || []));
    if (esc.rotulo) rotulo(svg, W, esc.rotulo);
    (def.marcos || []).forEach(m => { if (previos.has(m.id) || (esc.nuevos || []).includes(m.id)) objs[m.id] = { tipo: "marco", def: m }; });
    def.nodos.forEach(n => {
      if (!previos.has(n.id) && !(esc.nuevos || []).includes(n.id)) return;
      objs[n.id] = caja(svg, { ...ubicar(W, H, { h: n.h, v: n.v }, { w: n.w && tam(W, n.w, n.wv || n.w), h: n.h2 && tam(W, n.h2, n.h2v || n.h2) }), ic: n.ic, t: n.t, sub: n.sub, tipo: n.tipo }, W);
    });
    // Los marcos se dibujan detrás de las cajas
    Object.entries(objs).filter(([, o]) => o.tipo === "marco").forEach(([id, o]) => {
      const g = marco(svg, o.def.ids.map(i => objs[i]).filter(Boolean), { t: o.def.t, clase: o.def.clase, pad: tam(W, 40, 18) }, W);
      svg.insertBefore(g, svg.children[1]); objs[id] = { g, marco: true };
    });
    (def.aristas || []).forEach(a => {
      if (!objs[a.de] || !objs[a.a] || (!previos.has(a.id) && !(esc.nuevos || []).includes(a.id))) return;
      objs[a.id] = flecha(svg, objs[a.de], objs[a.a], { curva: angosto(W) ? (a.curvaV ?? a.curva ?? 0) : (a.curva ?? 0), clase: a.clase, etiqueta: angosto(W) ? (a.etiquetaV ?? a.etiqueta) : a.etiqueta }, W);
    });
    const via = viajero(svg, W);
    const extra = esc.extra ? esc.extra(svg, ctx, objs) : null;
    const ley = leyenda(svg, W, H, e.pantalla, esc.leyendaDesde ?? 0.55);
    const nuevos = (esc.nuevos || []).filter(id => objs[id]);
    return p => {
      Object.entries(objs).forEach(([id, o]) => {
        if (nuevos.includes(id)) return;
        if (o.dibujar) o.dibujar(1); else aparecer(o.g, 1, 0, 0.01);
      });
      nuevos.forEach((id, j) => {
        const a = 0.06 + j * (0.54 / Math.max(1, nuevos.length)), o = objs[id];
        if (o.dibujar) o.dibujar(ease.effects(tramo(p, a, a + 0.14))); else aparecer(o.g, p, a);
      });
      // Un dato que viaja por las flechas indicadas, una tras otra, al final de la escena
      const vs = (esc.viajes || []).map(id => objs[id]).filter(Boolean);
      if (vs.length) {
        const t = tramo(p, 0.6, 0.92) * vs.length, j = Math.min(vs.length - 1, Math.floor(t));
        via.en(vs[j], t - j, p > 0.6 && p < 0.92);
      }
      (esc.resalta || []).forEach(id => objs[id]?.g?.classList.toggle("is-on", p > 0.3));
      extra && extra(p);
      ley(p);
    };
  });
}

/** Pulso alrededor del ícono de una caja (algo que suena, que está activo) */
export function pulso(svg, c, W, desde = 0.1) {
  const icy = c.y + (c.sub ? c.h * 0.26 : c.h * 0.36);
  const anillos = [0, 1].map(() => nodo("circle", { cx: c.cx, cy: icy, r: 10, class: "an-pulso" }, svg));
  return p => anillos.forEach((a, k) => {
    const on = tramo(p, desde, desde + 0.08), fase = ((p - desde) * 3 + k * 0.5) % 1;
    a.setAttribute("r", tam(W, 26, 22) + fase * tam(W, 40, 32)); a.style.opacity = on * (1 - fase) * (p < desde ? 0 : 1) * 0.8;
  });
}
/** Texto breve debajo de una caja. Solo en el lienzo horizontal: en el vertical lo dicen la narración y el texto en pantalla. */
export function debajo(svg, c, W, texto, desde) {
  if (angosto(W)) return () => {};
  const n = nodo("text", { x: c.cx, y: c.y + c.h + 52, "text-anchor": "middle", class: "an-texto", "font-size": 30 }, svg);
  n.textContent = texto;
  return p => { n.style.opacity = ease.effects(tramo(p, desde, desde + 0.1)); };
}
