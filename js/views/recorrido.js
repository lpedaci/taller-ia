/* Taller - IA | Mi recorrido: los 7 bloques y 21 módulos como mapa, con la ruta elegida */
import { esc, qs } from "../util.js";
import { datos, avance, rutaActual, enRuta, setRuta } from "../state.js";
import { icono } from "../ui.js";
import { tarjetaModulo } from "./piezas.js";

let enfocarRutas = false;
export function preparar(args) { enfocarRutas = args[0] === "rutas"; }

export function render() {
  const ruta = rutaActual();
  const enLaRuta = datos.modulos.filter(m => enRuta(m, ruta));
  const hechos = enLaRuta.filter(m => avance(m).estado === "completado").length;
  return `<div class="view-head"><div class="vh-txt"><h2>Mi recorrido</h2><p>Va de lo general a lo particular. Los módulos no se bloquean: podés cursarlos en el orden que quieras.</p></div></div>` +
    `<section class="card route-intro" aria-labelledby="hRutas" id="rutas" tabindex="-1">` +
      `<h3 id="hRutas">Tu ruta: ${esc(ruta.titulo)}</h3>` +
      `<p>${esc(ruta.descripcion)} Llevás ${hechos} de ${enLaRuta.length} módulos de esta ruta. Si usás el taller en una clase o en un curso corto, elegí la ruta que corresponda.</p>` +
      `<div class="filter-chips" role="radiogroup" aria-labelledby="hRutas">${datos.rutas.map(r => `<button type="button" class="filter-chip" role="radio" data-ruta="${r.id}" aria-checked="${r.id === ruta.id}" tabindex="${r.id === ruta.id ? 0 : -1}">${icono("check", "chk")}${esc(r.titulo)}</button>`).join("")}</div>` +
      `<div class="route-legend" aria-hidden="true"><span>${icono("check_circle", "fill")}Completado</span><span>${icono("progress_activity")}En curso</span><span>${icono("radio_button_unchecked")}Sin empezar</span><span>${icono("alt_route")}En tu ruta</span></div>` +
    `</section>` +
    `<div class="route">` + datos.bloques.map(b => {
      const mods = datos.modulos.filter(m => m.bloque === b.n), listos = mods.filter(m => avance(m).estado === "completado").length;
      return `<section class="route-block" aria-labelledby="rb${b.n}"><header><h3 id="rb${b.n}"><span class="n" aria-hidden="true">${b.n}</span><span><span class="sr-only">Bloque ${b.n}: </span>${esc(b.titulo)}</span></h3>` +
        `<span class="rb-sum">${listos} de ${mods.length} módulos completados</span></header>` +
        `<div class="mods">${mods.map(m => tarjetaModulo(m, { marcarRuta: true })).join("")}</div></section>`;
    }).join("") + `</div>`;
}

export function despues() { if (enfocarRutas) { const r = qs("#rutas"); r?.focus(); r?.scrollIntoView({ block: "start" }); } }

export function iniciar(rerender) {
  const elegir = b => {
    setRuta(b.dataset.ruta);
    rerender();
    qs(`[data-ruta="${b.dataset.ruta}"]`)?.focus();
  };
  document.addEventListener("click", e => { const b = e.target.closest("[data-ruta]"); if (b) elegir(b); });
  // Grupo de opciones: flechas para moverse, como indica el patrón de radio de ARIA
  document.addEventListener("keydown", e => {
    const b = e.target.closest("[data-ruta]"); if (!b || !["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const it = [...document.querySelectorAll("[data-ruta]")], i = it.indexOf(b);
    const sig = it[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + it.length) % it.length];
    elegir(sig);
  });
}
