/* Taller - IA | Animación 6: cómo un modelo de imagen genera a partir de ruido (difusión), en términos simples
   Guion: animaciones/guiones/06-difusion.md. Textos: content/animaciones/difusion.json.
   Una grilla de píxeles: abajo, el dibujo final; arriba, ruido que se va limpiando paso a paso. */
import { nodo, tramo, ease } from "../animacion.js";
import { leyenda, tam, angosto } from "./kit.js";
import { semilla } from "../util.js";

/** Qué hay en cada punto del dibujo (u, v de 0 a 1). var: variante (cambia el sol y la puerta). */
function dibujo(u, v, aspecto, variante = 0) {
  // El sol es un círculo en píxeles reales: se corrige por la proporción de la grilla
  const su = variante ? 0.2 : 0.82, sv = 0.22, dx = (u - su) * aspecto, dy = v - sv;
  if (dx * dx + dy * dy < 0.022) return "sol";
  if (v > 0.8) return "pasto";
  const pu = variante ? 0.4 : 0.5;
  if (u >= pu && u <= pu + 0.08 && v >= 0.6 && v <= 0.8) return "puerta";
  if (!variante && u >= 0.6 && u <= 0.67 && v >= 0.54 && v <= 0.64) return "ventana";
  if (u >= 0.32 && u <= 0.7 && v >= 0.46 && v <= 0.8) return "casa";
  if (v >= 0.24 && v < 0.46 && Math.abs(u - 0.51) <= (v - 0.24) / 0.22 * 0.23) return "techo";
  return "cielo";
}
function grilla(svg, { x, y, w, cols, filas, variante = 0, sem = 1 }) {
  const c = w / cols, g = nodo("g", {}, svg), celdas = [];
  for (let j = 0; j < filas; j++) for (let i = 0; i < cols; i++) {
    const u = (i + 0.5) / cols, v = (j + 0.5) / filas;
    const fin = nodo("rect", { x: x + i * c, y: y + j * c, width: c + 0.5, height: c + 0.5, class: `an-px an-px-${dibujo(u, v, cols / filas, variante)}` }, g);
    const ruido = nodo("rect", { x: x + i * c, y: y + j * c, width: c + 0.5, height: c + 0.5, class: "an-px-ruido" }, g);
    const k = j * cols + i;
    ruido.style.fillOpacity = 0.15 + 0.85 * semilla(k * 7 + sem * 131);
    celdas.push({ fin, ruido, umbral: semilla(k * 13 + sem * 17) });
  }
  return { g, x, y, w, h: filas * c, cx: x + w / 2, cy: y + filas * c / 2,
    /** limpieza de 0 (todo ruido) a 1 (dibujo terminado) */
    limpiar(t) { celdas.forEach(cel => { const l = Math.max(0, Math.min(1, (t - cel.umbral * 0.55) / 0.45)); cel.ruido.style.opacity = 1 - l; cel.fin.style.opacity = l; }); } };
}
function medidas(W, H) {
  return angosto(W) ? { x: W * 0.06, y: H * 0.17, w: W * 0.88, cols: 24, filas: 17 } : { x: W * 0.06, y: H * 0.17, w: W * 0.46, cols: 32, filas: 19 };
}
function pedido(svg, W, H, d) {
  const size = tam(W, 30, 30), x = W * 0.06, y = H * 0.07;
  const n = nodo("text", { x: x + 20, y: y + size * 1.05, class: "an-texto", "font-size": size }, svg); n.textContent = `Pedido: ${d.pedido}`;
  const w = n.getComputedTextLength() + 40;
  const r = nodo("rect", { x, y, width: w, height: size * 1.6, rx: size * 0.8, class: "an-chip" }); svg.insertBefore(r, n);
  return { g: n, r, x, y, w, h: size * 1.6, cx: x + w / 2, cy: y + size * 0.8 };
}
function contador(svg, W, H, m) {
  const v = angosto(W), n = nodo("text", v ? { x: W / 2, y: m.y + m.w / m.cols * m.filas + 56, "text-anchor": "middle" } : { x: W * 0.58, y: H * 0.42 }, svg);
  n.setAttribute("class", "an-texto"); n.setAttribute("font-size", tam(W, 56, 40)); return n;
}

function escena1(svg, { W, H, d, e }) {
  const m = medidas(W, H), G = grilla(svg, m), P = pedido(svg, W, H, d), ley = leyenda(svg, W, H, e.pantalla, 0.5);
  return p => { G.limpiar(0); G.g.style.opacity = ease.effects(tramo(p, 0.05, 0.3)); P.r.style.opacity = P.g.style.opacity = ease.effects(tramo(p, 0.3, 0.42)); ley(p); };
}
function escena2(svg, { W, H, d, e }) {
  const m = medidas(W, H), G = grilla(svg, m), P = pedido(svg, W, H, d), cnt = contador(svg, W, H, m), ley = leyenda(svg, W, H, e.pantalla, 0.75);
  return p => { const t = tramo(p, 0.05, 0.85); G.limpiar(t); cnt.textContent = `Paso ${Math.max(1, Math.ceil(t * d.pasos))} de ${d.pasos}`; ley(p); };
}
function escena3(svg, { W, H, d, e }) {
  const m = medidas(W, H), G = grilla(svg, m), P = pedido(svg, W, H, d);
  const ley = leyenda(svg, W, H, e.pantalla, 0.5);
  // El pedido se resalta: es lo que orienta cada paso
  return p => { G.limpiar(1); P.r.classList.toggle("is-on", p > 0.1); ley(p); };
}
function escena4(svg, { W, H, d, e }) {
  const v = angosto(W), w = v ? W * 0.42 : W * 0.36, cols = v ? 24 : 32, filas = v ? 17 : 19, y = H * 0.2;
  const A = grilla(svg, { x: W * 0.06, y, w, cols, filas, variante: 0, sem: 3 }), B = grilla(svg, { x: W * (v ? 0.52 : 0.5), y, w, cols, filas, variante: 1, sem: 9 });
  const etq = (x, t) => { const n = nodo("text", { x, y: y - 14, class: "an-muted", "font-size": tam(W, 28, 26) }, svg); n.textContent = t; return n; };
  const e1 = etq(W * 0.06, "Una vez"), e2 = etq(W * (v ? 0.52 : 0.5), "Otra vez");
  const P = pedido(svg, W, H, d), ley = leyenda(svg, W, H, e.pantalla, 0.6);
  return p => {
    A.limpiar(tramo(p, 0.05, 0.4)); B.limpiar(tramo(p, 0.25, 0.6));
    e1.style.opacity = ease.effects(tramo(p, 0.05, 0.15)); e2.style.opacity = ease.effects(tramo(p, 0.25, 0.35)); ley(p);
  };
}

export const escenas = [escena1, escena2, escena3, escena4];
