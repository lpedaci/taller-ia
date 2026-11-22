/* Taller - IA | Mi aprendizaje: competencias, objetivos, evidencias y registro de actividad */
import { esc, qs } from "../util.js";
import { evidencias, evidenciasTotal, objetivosPersonales, autodiagnostico, diario, modulo } from "../state.js";
import { graficoHTML, montarGrafico } from "../charts.js";
import { icono, cabecera, vacio, descargar, aviso } from "../ui.js";
import { competenciasHTML, registroHTML, dibujarRegistro } from "./piezas.js";
import { href } from "../routes.js";

let foco = null;
/** Autodiagnóstico: punto de partida en barras; con el final, antes y después en mancuernas */
function autodiagCfg() {
  const ad = autodiagnostico(), ini = ad.inicial; if (!ini?.etiquetas) return null;
  const idx = ini.etiquetas.map((e, i) => e ? i : -1).filter(i => i > -1);
  const cats = idx.map(i => ini.etiquetas[i]);
  if (ad.final) return { forma: "mancuernas", titulo: "Tu confianza al empezar y al terminar", unidad: "de 1 (nada) a 5 (mucho)", min: 1, max: 5, ejeCategorias: "Tema", categorias: cats, series: [{ nombre: "Al empezar", valores: idx.map(i => ini.respuestas[i]) }, { nombre: "Al terminar", valores: idx.map(i => ad.final.respuestas[i]) }] };
  return { forma: "barras", titulo: "Tu confianza al empezar", unidad: "de 1 (nada) a 5 (mucho)", max: 5, ejeCategorias: "Tema", categorias: cats, series: [{ nombre: "Al empezar", valores: idx.map(i => ini.respuestas[i]) }] };
}
export function preparar(args) { foco = args[0] === "portafolio" ? "#hEv" : args[0] === "diario" ? "#hDi" : null; }
const fechaCorta = iso => new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
/** Diario en orden cronológico, de la primera reflexión a la última */
const entradas = () => diario().slice().sort((a, b) => a.fecha.localeCompare(b.fecha));
function diarioMD() {
  const bloque = e => [`## Módulo ${e.modulo}: ${modulo(e.modulo)?.titulo || ""}`, `*${fechaCorta(e.fecha)}* | ${e.pregunta}`, e.texto].join("\n\n");
  return `# Mi diario de aprendizaje\n\nTaller - IA, exportado el ${fechaCorta(new Date().toISOString())}.\n\n${entradas().map(bloque).join("\n\n")}\n`;
}

export function render() {
  const obj = objetivosPersonales(), ev = evidencias();
  return `<div class="view-head"><div class="vh-txt"><h2>Mi aprendizaje</h2><p>Lo que completás y producís. No se mide el tiempo que pasás en la plataforma.</p></div>` +
    `<div class="actions"><button class="btn btn-outlined" type="button" data-action="exportar-progreso">${icono("download")}Exportar mi progreso</button>` +
    `<button class="btn btn-tonal" type="button" data-imprimir-portafolio>${icono("print")}Imprimir portafolio</button></div></div>` +
    `<div class="learn-grid">` +
      `<section class="card" aria-labelledby="hC2">${cabecera("psychology", "Dominio de competencias", "", "hC2")}<div class="card-body">${competenciasHTML(true)}</div></section>` +
      `<section class="card" aria-labelledby="hObj">${cabecera("flag", "Mis objetivos", "", "hObj")}<div class="card-body">` +
        (!obj.length ? vacio("Todavía no definiste tus objetivos", "En el Módulo 0 elegís de 1 a 3 objetivos personales y los revisás al cerrar cada bloque.", `<a class="btn btn-tonal" href="${href("modulo", 0)}">Ir al Módulo 0</a>`) : `<ul class="todo-list">` +
        obj.map(o => `<li>${icono(o.logrado ? "check_circle" : "radio_button_unchecked", o.logrado ? "fill" : "")}<span class="tt">${esc(o.titulo)}${o.logrado ? ' <span class="lvl lvl-3">Logrado</span>' : '<span class="sr-only">, en curso</span>'}</span></li>`).join("") +
      `</ul>`) + `</div></section>` +
      `<section class="card" aria-labelledby="hEv" id="portafolio">${cabecera("folder_special", "Evidencias recientes", `<span class="chip chip-neutral">${evidenciasTotal()} en total</span>`, "hEv")}<div class="card-body">` +
        (!ev.length ? vacio("Todavía no tenés evidencias", "Cada producto que creás en el taller (prompts guardados, tu kit de trabajo, un brief, un storyboard) aparece acá para tu portafolio.", `<a class="btn btn-tonal" href="${href("recorrido")}">Ver Mi recorrido</a>`) : `<ul class="list">` +
        ev.map(e => `<li><a class="list-item" href="${href("modulo", e.modulo)}"><span class="li-lead-ic">${icono("description")}</span><span class="li-text"><span class="li-head">${esc(e.titulo)}</span><span class="li-sup">${esc(e.detalle)}</span></span><span class="li-trail">${icono("chevron_right")}</span></a></li>`).join("") +
      `</ul>`) + `</div></section>` +
      `<section class="card" aria-labelledby="hAd">${cabecera("insights", "Autodiagnóstico", "", "hAd")}<div class="card-body" id="adBox">` +
        (autodiagCfg() ? graficoHTML(autodiagCfg(), "ad-mi", 3) + `<p class="muted" style="font:var(--md-sys-typescale-body-small);margin-top:var(--app-space-2)">${autodiagnostico().final ? "Comparación entre el Módulo 0 y el Módulo 20." : "Al terminar el taller, en el Módulo 20, vas a ver la comparación."}</p>`
          : vacio("Todavía no hiciste el autodiagnóstico", "Son diez preguntas cortas en el Módulo 0. Sirven para ver al final cómo cambió tu confianza.", `<a class="btn btn-tonal" href="${href("modulo", 0, "paso", 3)}">Hacer el autodiagnóstico</a>`)) +
      `</div></section>` +
      `<section class="card wide" aria-labelledby="hDi" style="grid-column:1/-1" id="diario">${cabecera("auto_stories", "Diario de aprendizaje", entradas().length ? `<button class="btn btn-text" type="button" data-descargar-diario>${icono("download")}Descargar (.md)</button>` : "", "hDi")}<div class="card-body">` +
        (!entradas().length ? vacio("Tu diario está vacío", "Al cerrar cada módulo hay una pregunta para tu diario. Tus respuestas aparecen acá, en orden.", `<a class="btn btn-tonal" href="${href("modulo", 0)}">Ir al Módulo 0</a>`) :
        `<ol class="di-lista">${entradas().map(e => `<li class="di-e"><p class="di-meta"><time datetime="${esc(e.fecha)}">${fechaCorta(e.fecha)}</time> | <a href="${href("modulo", e.modulo)}">Módulo ${e.modulo}${modulo(e.modulo) ? `: ${esc(modulo(e.modulo).titulo)}` : ""}</a></p><p class="di-preg">${esc(e.pregunta)}</p><p class="di-txt">${esc(e.texto)}</p></li>`).join("")}</ol>`) +
      `</div></section>` +
      `<section class="card wide" aria-labelledby="hH2" style="grid-column:1/-1">${cabecera("grid_view", "Registro de actividad", "", "hH2")}<div class="card-body">${registroHTML("heatFull", true)}</div></section>` +
    `</div>`;
}

let conectado = false;
export function despues() {
  if (!conectado) {
    conectado = true;
    document.addEventListener("click", e => {
      if (e.target.closest("[data-descargar-diario]")) { descargar(`mi-diario-${new Date().toISOString().slice(0, 10)}.md`, diarioMD(), "text/markdown"); aviso("Descargamos tu diario"); }
      if (e.target.closest("[data-imprimir-portafolio]")) print();
    });
  }
  dibujarRegistro("heatFull");
  const cfg = autodiagCfg(), f = document.querySelector("#adBox .chart"); if (cfg && f) montarGrafico(f, cfg);
  if (foco) { const h = qs(foco); h?.setAttribute("tabindex", "-1"); h?.focus(); h?.closest("section")?.scrollIntoView({ block: "start" }); }
}
