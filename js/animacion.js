/* Taller - IA | Motor de animaciones explicativas por escenas
   - Textos (pantalla, narración, descripción) en content/animaciones/<id>.json.
   - Dibujo de cada escena en js/animaciones/<id>.js: cada escena recibe el SVG y devuelve
     una función que dibuja el estado para un avance p de 0 a 1. Así se puede pausar,
     saltar de escena y grabar el MP4 cuadro a cuadro.
   - Controles: reproducir y pausar, escena anterior y siguiente, barra por escenas,
     velocidad y narración con la voz del navegador. No empieza sola ni se repite en bucle.
   - Con "reducir movimiento": escenas fijas con flechas para avanzar. */
import { esc, qs, qsa } from "./util.js";
import { icono } from "./ui.js";
import { registrar } from "./lesson/bloques.js";
import { leerJSON } from "./state.js";
import { crearLector, disponible as puedeLeer } from "./escuchar.js";

const NS = "http://www.w3.org/2000/svg";
const reducido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const VELS = [0.75, 1, 1.25];

/* ---------- Herramientas de dibujo para las escenas ---------- */
export const ease = {
  /** espacial: llega con un rebote leve (aproxima el spring de M3) */
  spatial: t => { const c1 = 1.2, c3 = c1 + 1, x = t - 1; return 1 + c3 * x * x * x + c1 * x * x; },
  effects: t => 1 - (1 - t) ** 3
};
/** Avance local de un tramo [a, b] dentro de la escena (0 antes, 1 después) */
export const tramo = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
export function nodo(tag, attrs = {}, padre) {
  const n = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  padre && padre.appendChild(n); return n;
}
/** Ubica palabras (o fragmentos) de izquierda a derecha, con salto de línea al llegar a maxW.
    Devuelve los nodos de texto con su posición, para poder revelarlos o resaltarlos uno por uno. */
export function fluir(padre, piezas, { x, y, maxW, size, alto = size * 1.35, clase = "", espacio = true, gap = 0 }) {
  const g = nodo("g", {}, padre), out = [];
  let cx = x, cy = y + size;
  const sp = espacio ? size * 0.28 : 0;
  piezas.forEach(pz => {
    const t = typeof pz === "string" ? { t: pz } : pz;
    const n = nodo("text", { x: cx, y: cy, class: `${clase} ${t.clase || ""}`.trim(), "font-size": size }, g);
    n.textContent = t.t;
    let w = n.getComputedTextLength();
    if (cx + w > x + maxW && cx > x) { cx = x; cy += alto; n.setAttribute("x", cx); n.setAttribute("y", cy); }
    out.push({ n, x: cx, y: cy, w, t: t.t });
    cx += w + sp + gap;
  });
  const lineas = out.length ? (out[out.length - 1].y - (y + size)) / alto + 1 : 1;
  return { g, piezas: out, alto: lineas * alto, ancho: Math.max(0, ...out.map(o => o.x + o.w - x)) };
}

/* ---------- Reproductor ---------- */
function plantilla(a, id) {
  const ctrl = (acc, ic, lbl, extra = "") => `<button class="icon-btn" type="button" data-an="${acc}" aria-label="${lbl}" data-tip="${lbl}"${extra}>${icono(ic)}</button>`;
  return `<figure class="anim" data-anim="${esc(id)}">` +
    `<figcaption class="anim-head"><span class="chip chip-neutral">${icono("animation")}Animación | ${a.escenas.length} escenas</span><h4 id="${esc(id)}-t">${esc(a.titulo)}</h4></figcaption>` +
    `<div class="anim-stage"><svg role="img" aria-labelledby="${esc(id)}-t ${esc(id)}-d"></svg>` +
      `<button class="anim-play-big" type="button" data-an="play" aria-label="Reproducir la animación">${icono("play_arrow", "fill")}</button></div>` +
    `<div class="anim-ctrl" role="group" aria-label="Controles de la animación">` +
      `<button class="btn btn-filled anim-pp" type="button" data-an="pp">${icono("play_arrow")}<span>Reproducir</span></button>` +
      ctrl("prev", "skip_previous", "Escena anterior") +
      `<ol class="anim-seg" aria-label="Escenas">${a.escenas.map((e, i) => `<li><button type="button" data-an="ir" data-i="${i}" aria-label="Escena ${i + 1}: ${esc(e.titulo)}"><span class="seg-fill"></span></button></li>`).join("")}</ol>` +
      ctrl("next", "skip_next", "Escena siguiente") +
      `<div class="connected anim-vel" role="group" aria-label="Velocidad">${VELS.map(v => `<button type="button" data-an="vel" data-v="${v}" aria-pressed="${v === 1}">${String(v).replace(".", ",")}x</button>`).join("")}</div>` +
      (puedeLeer() ? `<button class="btn btn-outlined anim-nar" type="button" data-an="nar" aria-pressed="false">${icono("record_voice_over")}<span>Narración</span></button>` : "") +
    `</div>` +
    `<p class="anim-desc" id="${esc(id)}-d" aria-live="polite"></p>` +
    `<details class="alt"><summary>${icono("subject", "sm")}Transcripción completa</summary><ol class="anim-trans">${a.escenas.map(e => `<li><b>${esc(e.titulo)}.</b> ${esc(e.narracion)}</li>`).join("")}</ol>` +
      (a.nota ? `<p class="anim-nota">${esc(a.nota)}</p>` : "") + `</details>` +
    `</figure>`;
}

export function montarAnimacion(fig, a, escenas) {
  const svg = qs("svg", fig), desc = qs(".anim-desc", fig), pp = qs(".anim-pp", fig), big = qs(".anim-play-big", fig);
  let i = 0, p = 0, jugando = false, vel = 1, narrar = false, raf = 0, ultimo = 0, dibujar = null, esperandoVoz = false, empezo = false;
  const lector = crearLector(est => { if (est === "detenido" && esperandoVoz) { esperandoVoz = false; avanzar(); } });

  function medidas() { const w = fig.clientWidth; return w < 600 ? { W: 720, H: 900 } : { W: 1600, H: 900 }; }
  function armar() {
    const { W, H } = medidas();
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.innerHTML = "";
    nodo("rect", { width: W, height: H, class: "an-fondo" }, svg);
    dibujar = escenas[i](svg, { W, H, d: a.datos, e: a.escenas[i] });
    dibujar(reducido() ? 1 : p);
  }
  function anunciar() {
    desc.textContent = `Escena ${i + 1} de ${a.escenas.length}: ${a.escenas[i].descripcion}`;
    qsa(".anim-seg button", fig).forEach((b, k) => { b.classList.toggle("is-done", k < i); b.toggleAttribute("aria-current", k === i); if (k === i) b.setAttribute("aria-current", "step"); });
  }
  function pintarBarra() { qsa(".anim-seg .seg-fill", fig).forEach((f, k) => { f.style.transform = `scaleX(${k < i ? 1 : k === i ? p : 0})`; }); }
  function pintarPP() {
    pp.innerHTML = `${icono(jugando ? "pause" : (i === a.escenas.length - 1 && p >= 1 ? "replay" : "play_arrow"))}<span>${jugando ? "Pausar" : (i === a.escenas.length - 1 && p >= 1 ? "Ver de nuevo" : "Reproducir")}</span>`;
    big.hidden = empezo || reducido();
    fig.classList.toggle("is-playing", jugando);
  }
  function irA(k, desde = 0) {
    i = Math.max(0, Math.min(a.escenas.length - 1, k)); p = desde;
    armar(); anunciar(); pintarBarra(); pintarPP();
    if (jugando && narrar) { lector.leer(a.escenas[i].narracion); }
  }
  function avanzar() {
    if (i < a.escenas.length - 1) irA(i + 1);
    else { jugando = false; p = 1; pintarPP(); }
  }
  function tick(ts) {
    if (!jugando) return;
    const dt = ultimo ? (ts - ultimo) / 1000 : 0; ultimo = ts;
    if (!esperandoVoz) {
      p = Math.min(1, p + dt * vel / a.escenas[i].duracion);
      dibujar(p); pintarBarra();
      if (p >= 1) {
        // Con narración, la escena espera a que termine de hablar antes de pasar a la siguiente
        if (narrar && lector.estado === "leyendo") esperandoVoz = true;
        else avanzar();
      }
    }
    raf = requestAnimationFrame(tick);
  }
  function play() {
    if (reducido()) return;
    if (i === a.escenas.length - 1 && p >= 1) { i = 0; p = 0; armar(); anunciar(); }
    jugando = true; empezo = true; ultimo = 0; pintarPP();
    if (narrar) lector.estado === "pausado" ? lector.reanudar() : lector.leer(a.escenas[i].narracion);
    raf = requestAnimationFrame(tick);
  }
  function pausa() { jugando = false; cancelAnimationFrame(raf); if (lector.estado === "leyendo") lector.pausar(); pintarPP(); }

  fig.addEventListener("click", e => {
    const b = e.target.closest("[data-an]"); if (!b) return;
    const acc = b.dataset.an;
    if (acc === "play") { play(); pp.focus(); }
    if (acc === "pp") jugando ? pausa() : play();
    // Al saltar de escena en pausa se muestra la escena completa; reproduciendo, desde el principio
    if (acc === "prev") { lector.detener(); esperandoVoz = false; irA(i - 1, jugando ? 0 : 1); }
    if (acc === "next") { lector.detener(); esperandoVoz = false; irA(i + 1, jugando ? 0 : 1); }
    if (acc === "ir") { lector.detener(); esperandoVoz = false; irA(+b.dataset.i, jugando ? 0 : 1); }
    if (acc === "vel") { vel = +b.dataset.v; qsa("[data-an=vel]", fig).forEach(x => x.setAttribute("aria-pressed", String(x === b))); }
    if (acc === "nar") {
      narrar = !narrar; b.setAttribute("aria-pressed", String(narrar));
      if (!narrar) { lector.detener(); if (esperandoVoz) { esperandoVoz = false; avanzar(); } }
      else if (jugando) lector.leer(a.escenas[i].narracion);
    }
  });
  // Se adapta al ancho (mobile usa un lienzo vertical)
  let ancho = 0;
  new ResizeObserver(() => { const w = fig.clientWidth; if (Math.abs(w - ancho) > 2 && ((w < 600) !== (ancho < 600) || !ancho)) { ancho = w; armar(); } ancho = w; }).observe(fig);
  // Para la grabación del MP4: permite dibujar cualquier momento sin reproducir
  fig.__anim = { escenas: a.escenas, irA: (k, q) => { i = k; p = q; armar(); anunciar(); pintarBarra(); } };
  addEventListener("hashchange", () => { pausa(); lector.detener(); }, { once: true });

  if (reducido()) { fig.classList.add("is-static"); qs("[data-an=pp]", fig).hidden = true; qs(".anim-vel", fig).hidden = true; }
  i = 0; p = reducido() ? 1 : 0.999;  // Antes de reproducir se ve la primera escena completa como portada
  armar(); anunciar(); pintarBarra(); p = reducido() ? 1 : 0; pintarPP();
}

/* ---------- Bloque de lección ---------- */
const cache = new Map();
async function cargar(ref) {
  if (!cache.has(ref)) cache.set(ref, Promise.all([leerJSON(`content/animaciones/${ref}.json`), import(`./animaciones/${ref}.js`)]));
  return cache.get(ref);
}
let n = 0;
registrar("animacion", {
  render: b => `<div class="anim-slot" data-ref="${esc(b.ref)}" aria-busy="true"><div class="anim-stage sk"></div><p class="espera-t">Preparando la animación.</p></div>`,
  async montar(el, b) {
    const slot = qs(".anim-slot", el);
    try {
      const [a, mod] = await cargar(b.ref);
      const id = "an" + (++n);
      slot.outerHTML = plantilla(a, id);
      montarAnimacion(qs(".anim", el), a, mod.escenas);
    } catch (e) {
      slot.innerHTML = `<div class="status status-error" role="alert">${icono("error")}<span><b>No se pudo cargar la animación</b>Podés seguir con la lección. Tu progreso no se pierde.</span></div>`;
    }
  }
});
