/* Taller - IA | Mi recorrido: los 7 bloques y 21 módulos como mapa, con la ruta elegida */
import { esc, qs } from "../util.js";
import { datos, avance, rutaActual, enRuta, setRuta } from "../state.js";
import { icono, lineal, aviso, abrirDialogo } from "../ui.js";
import { tarjetaModulo } from "./piezas.js";
import { href } from "../routes.js";
import { pintarPersona } from "../shell.js";

let abrirRutas = false;
export function preparar(args) { abrirRutas = args[0] === "rutas"; }

const modulosDe = r => datos.modulos.filter(m => enRuta(m, r));

export function render() {
  const ruta = rutaActual(), mods = modulosDe(ruta);
  const hechos = mods.filter(m => avance(m).estado === "completado").length;
  return `<div class="view-head"><div class="vh-txt"><h2>Mi recorrido</h2><p>Va de lo general a lo particular. Los módulos no se bloquean: podés cursarlos en el orden que quieras.</p></div></div>` +
    `<section class="card route-card" aria-labelledby="hRuta">` +
      `<div class="rc-head"><span class="ic">${icono("alt_route")}</span>` +
        `<div class="rc-tit"><span class="rc-over">Tu ruta</span><h3 id="hRuta">${esc(ruta.titulo)}</h3></div>` +
        `<button class="btn btn-tonal" type="button" id="cambiarRuta" aria-haspopup="dialog">${icono("swap_horiz")}Cambiar de ruta</button></div>` +
      `<div class="rc-body"><p class="rc-desc">Incluye ${esc(ruta.descripcion.charAt(0).toLowerCase() + ruta.descripcion.slice(1))} Los módulos de tu ruta llevan la marca "En tu ruta".</p>` +
        `<div class="rc-prog"><span><b>${hechos} de ${mods.length}</b> módulos completados</span>${lineal(hechos / mods.length * 100, "Avance de tu ruta")}</div></div>` +
    `</section>` +
    `<div class="route-legend" aria-hidden="true"><span>${icono("check_circle", "fill")}Completado</span><span>${icono("progress_activity")}En curso</span><span>${icono("radio_button_unchecked")}Sin empezar</span><span>${icono("alt_route")}En tu ruta</span></div>` +
    `<div class="route">` + datos.bloques.map(b => {
      const ms = datos.modulos.filter(m => m.bloque === b.n), listos = ms.filter(m => avance(m).estado === "completado").length;
      return `<section class="route-block" aria-labelledby="rb${b.n}"><header><h3 id="rb${b.n}"><span class="n" aria-hidden="true">${b.n}</span><span><span class="sr-only">Bloque ${b.n}: </span>${esc(b.titulo)}</span></h3>` +
        `<span class="rb-sum">${listos} de ${ms.length} módulos completados</span></header>` +
        `<div class="mods">${ms.map(m => tarjetaModulo(m, { marcarRuta: true })).join("")}</div></section>`;
    }).join("") + `</div>`;
}

/* ---------- Diálogo "Elegí tu ruta" ---------- */
function abrirSelector() {
  const dlg = qs("#dlgRuta"), actual = rutaActual();
  qs("#rutaOpts").innerHTML = `<legend class="sr-only">Rutas</legend>` + datos.rutas.map(r =>
    `<label class="route-opt"><input type="radio" name="ruta" value="${r.id}"${r.id === actual.id ? " checked" : ""}>` +
    `<span class="ro-txt"><b>${esc(r.titulo)}</b><small>${esc(r.descripcion)} ${modulosDe(r).length} módulos.</small></span></label>`).join("");
  abrirDialogo(dlg, qs('#rutaOpts input:checked'));
}

export function despues() {
  if (abrirRutas) { abrirRutas = false; history.replaceState(null, "", href("recorrido")); abrirSelector(); }
}

export function iniciar(rerender) {
  const dlg = qs("#dlgRuta"), form = qs("#formRuta");
  document.addEventListener("click", e => { if (e.target.closest("#cambiarRuta")) abrirSelector(); });
  dlg.addEventListener("click", e => { if (e.target.closest('[data-ruta-act="cancelar"]')) dlg.close(); });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const v = form.querySelector('input[name="ruta"]:checked')?.value;
    const cambio = v && v !== rutaActual().id;
    if (cambio) setRuta(v);
    dlg.dataset.sinRetorno = "1";
    dlg.close();
    rerender(); pintarPersona();
    qs("#cambiarRuta")?.focus();
    if (cambio) aviso("Ruta cambiada: " + rutaActual().titulo + ". Tu progreso se mantiene.");
  });
}
