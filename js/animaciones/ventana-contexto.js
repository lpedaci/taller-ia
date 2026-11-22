/* Taller - IA | Animación 3: qué es la ventana de contexto y qué pasa cuando se llena
   Guion: animaciones/guiones/03-ventana-de-contexto.md. Textos: content/animaciones/ventana-contexto.json.
   Los mensajes se apilan dentro de un marco; cuando no entran, los más viejos suben y quedan afuera. */
import { nodo, tramo, ease } from "../animacion.js";
import { caja, flecha, viajero, leyenda, tam, angosto } from "./kit.js";

function lienzo(svg, { W, H }) {
  const v = angosto(W);
  const fr = v ? { x: W * 0.06, y: H * 0.15, w: W * 0.88, h: H * 0.38 } : { x: W * 0.06, y: H * 0.17, w: W * 0.56, h: H * 0.54 };
  const t = nodo("text", { x: fr.x, y: fr.y - 16, class: "an-muted", "font-size": tam(W, 34, 30) }, svg); t.textContent = "Ventana de contexto";
  const marcoR = nodo("rect", { x: fr.x, y: fr.y, width: fr.w, height: fr.h, rx: tam(W, 28, 24), class: "an-ventana" }, svg);
  const mod = caja(svg, v ? { x: W * 0.5 - 150, y: H * 0.6, w: 300, h: 130, ic: "psychology", t: "El modelo", tipo: "ia" } : { x: W * 0.7, y: H * 0.34, w: 300, h: 150, ic: "psychology", t: "El modelo", tipo: "ia" }, W);
  const frCaja = { x: fr.x, y: fr.y, w: fr.w, h: fr.h, cx: fr.x + fr.w / 2, cy: fr.y + fr.h / 2 };
  const fl = flecha(svg, frCaja, mod, { etiqueta: "lee todo" }, W);
  return { fr, t, marcoR, mod, fl };
}
/** Pila de mensajes. n (con decimales) = cuántos llegaron; el último queda abajo. */
function pila(svg, { W }, fr, mensajes) {
  // Los mensajes se recortan en el borde del marco: lo que sale, deja de verse
  const size = tam(W, 34, 30), mh = tam(W, 66, 64), paso = mh + 14;
  const id = "vc" + Math.random().toString(36).slice(2, 8), cp = nodo("clipPath", { id }, svg);
  nodo("rect", { x: fr.x, y: fr.y, width: fr.w, height: fr.h, rx: tam(W, 28, 24) }, cp);
  const g = nodo("g", { "clip-path": `url(#${id})` }, svg);
  const anchoMax = fr.w - 32, maxCh = Math.floor((anchoMax * 0.82 - 36) / (size * 0.52));
  const items = mensajes.map(m => {
    const ancho = anchoMax * 0.82, x = m.q === "user" ? fr.x + 16 + anchoMax - ancho : fr.x + 16;
    const r = nodo("rect", { x, y: 0, width: ancho, height: mh, rx: mh / 2.4, class: m.q === "user" ? "an-user" : m.q === "res" ? "an-chip" : "an-bot" }, g);
    const t = nodo("text", { x: x + 20, y: 0, class: m.q === "user" ? "an-user-t" : "an-bot-t", "font-size": size }, g);
    t.textContent = m.t.length > maxCh ? m.t.slice(0, maxCh - 1) + "…" : m.t;
    return { r, t };
  });
  const abajo = fr.y + fr.h - 14 - mh;
  /** Ubica los mensajes; devuelve cuántos quedaron afuera */
  return { mh, colocar(n, resaltar = false) {
    let fuera = 0;
    items.forEach((it, i) => {
      const y = abajo - (n - 1 - i) * paso, llego = tramo(n, i, i + 1);
      it.r.setAttribute("y", y); it.t.setAttribute("y", y + mh * 0.64);
      // Cuenta como afuera recién cuando el mensaje salió entero del marco
      const afuera = y + mh < fr.y + 4; if (afuera && llego >= 1) fuera++;
      const op = llego;
      it.r.style.opacity = op; it.t.style.opacity = op;
      it.r.classList.toggle("is-on", resaltar && !afuera && llego >= 1);
    });
    return fuera;
  } };
}

function escena1(svg, ctx) {
  const L = lienzo(svg, ctx), P = pila(svg, ctx, L.fr, ctx.d.mensajes.slice(0, 3)), ley = leyenda(svg, ctx.W, ctx.H, ctx.e.pantalla, 0.6);
  L.mod.g.style.opacity = 0;
  return p => { P.colocar(tramo(p, 0.05, 0.6) * 3); L.fl.dibujar(0); ley(p); };
}
function escena2(svg, ctx) {
  const L = lienzo(svg, ctx), P = pila(svg, ctx, L.fr, ctx.d.mensajes.slice(0, 3)), via = viajero(svg, ctx.W), ley = leyenda(svg, ctx.W, ctx.H, ctx.e.pantalla, 0.55);
  return p => {
    P.colocar(3, p > 0.2);
    L.mod.g.style.opacity = ease.effects(tramo(p, 0.15, 0.3));
    L.fl.dibujar(ease.effects(tramo(p, 0.3, 0.5)));
    via.en(L.fl, tramo(p, 0.55, 0.85), p > 0.55 && p < 0.85);
    ley(p);
  };
}
function escena3(svg, ctx) {
  const { W, H, d } = ctx, L = lienzo(svg, ctx), P = pila(svg, ctx, L.fr, d.mensajes), N = d.mensajes.length;
  const fuera = nodo("text", { x: L.fr.x, y: L.fr.y - tam(W, 64, 58), class: "an-warn-t", "font-size": tam(W, 30, 26) }, svg);
  fuera.textContent = angosto(W) ? "Quedó afuera: «…en una aseguradora»" : "Quedó afuera: «Soy Ana, coordino capacitación en una aseguradora»";
  const ley = leyenda(svg, W, H, ctx.e.pantalla, 0.7);
  return p => {
    const n = 3 + tramo(p, 0.05, 0.7) * (N - 3), f = P.colocar(n);
    L.fl.dibujar(1);
    fuera.style.opacity = f > 0 ? 1 : 0;
    L.mod.g.classList.toggle("is-alerta", p > 0.75);
    ley(p);
  };
}
function escena4(svg, ctx) {
  const { W, H, d } = ctx, L = lienzo(svg, ctx);
  const P = pila(svg, ctx, L.fr, [{ q: "res", t: d.resumen }, { q: "user", t: d.mensajes[d.mensajes.length - 1].t }]);
  const nueva = nodo("text", { x: L.fr.x, y: L.fr.y - tam(W, 64, 58), class: "an-ok-t", "font-size": tam(W, 30, 26) }, svg);
  nueva.textContent = "Conversación nueva";
  const ley = leyenda(svg, W, H, ctx.e.pantalla, 0.6);
  return p => { P.colocar(tramo(p, 0.15, 0.55) * 2); L.fl.dibujar(1); nueva.style.opacity = ease.effects(tramo(p, 0.05, 0.15)); ley(p); };
}

export const escenas = [escena1, escena2, escena3, escena4];
