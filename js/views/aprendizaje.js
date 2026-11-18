/* Taller - IA | Mi aprendizaje: competencias, objetivos, evidencias y registro de actividad */
import { esc, qs } from "../util.js";
import { datos } from "../state.js";
import { icono, cabecera } from "../ui.js";
import { competenciasHTML, registroHTML, dibujarRegistro } from "./piezas.js";
import { href } from "../routes.js";

let foco = null;
export function preparar(args) { foco = args[0] === "portafolio" ? "#hEv" : null; }

export function render() {
  const d = datos.demo;
  return `<div class="view-head"><div class="vh-txt"><h2>Mi aprendizaje</h2><p>Lo que completás y producís. No se mide el tiempo que pasás en la plataforma.</p></div>` +
    `<button class="btn btn-outlined" type="button" data-action="exportar-progreso">${icono("download")}Exportar mi progreso</button></div>` +
    `<div class="learn-grid">` +
      `<section class="card" aria-labelledby="hC2">${cabecera("psychology", "Dominio de competencias", "", "hC2")}<div class="card-body">${competenciasHTML(true)}</div></section>` +
      `<section class="card" aria-labelledby="hObj">${cabecera("flag", "Mis objetivos", "", "hObj")}<div class="card-body"><ul class="todo-list">` +
        d.objetivos.map(o => `<li>${icono(o.logrado ? "check_circle" : "radio_button_unchecked", o.logrado ? "fill" : "")}<span class="tt">${esc(o.titulo)}${o.logrado ? ' <span class="lvl lvl-3">Logrado</span>' : '<span class="sr-only">, en curso</span>'}</span></li>`).join("") +
      `</ul></div></section>` +
      `<section class="card" aria-labelledby="hEv" id="portafolio">${cabecera("folder_special", "Evidencias recientes", `<span class="chip chip-neutral">${d.evidenciasTotal} en total</span>`, "hEv")}<div class="card-body"><ul class="list">` +
        d.evidencias.map(e => `<li><a class="list-item" href="${href("modulo", e.modulo)}"><span class="li-lead-ic">${icono("description")}</span><span class="li-text"><span class="li-head">${esc(e.titulo)}</span><span class="li-sup">${esc(e.detalle)}</span></span><span class="li-trail">${icono("chevron_right")}</span></a></li>`).join("") +
      `</ul></div></section>` +
      `<section class="card wide" aria-labelledby="hH2" style="grid-column:1/-1">${cabecera("grid_view", "Registro de actividad", "", "hH2")}<div class="card-body">${registroHTML("heatFull", true)}</div></section>` +
    `</div>`;
}

export function despues() {
  dibujarRegistro("heatFull");
  if (foco) { const h = qs(foco); h?.setAttribute("tabindex", "-1"); h?.focus(); h?.closest("section")?.scrollIntoView({ block: "start" }); }
}
