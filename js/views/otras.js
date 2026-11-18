/* Taller - IA | Ajustes y accesibilidad, página base de cada módulo y secciones que se completan en etapas posteriores */
import { esc, qs } from "../util.js";
import { perfil, setNombre, prompts, eliminarPrompt } from "../state.js";
import { store } from "../storage.js";
import { tema } from "../theme.js";
import { icono, cabecera, vacio, aviso } from "../ui.js";
import { pintarPersona } from "../shell.js";
import { RUTAS, href } from "../routes.js";

/* ---------- Ajustes y accesibilidad ---------- */
const grupo = (nombre, etiqueta, opciones, actual) =>
  `<div class="connected" role="group" aria-label="${etiqueta}">${opciones.map(o => `<button type="button" data-pref="${nombre}" data-val="${o[0]}" aria-pressed="${actual === o[0]}">${actual === o[0] ? icono("check") : ""}${o[1]}</button>`).join("")}</div>`;

export function ajustes() {
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return `<div class="view-head"><div class="vh-txt"><h2>Ajustes y accesibilidad</h2><p>Los ajustes se guardan en este navegador.</p></div></div><div class="settings">` +
    `<form class="card setting" id="formNombre" novalidate><div><h3><label for="tuNombre">Tu nombre</label></h3><p id="tuNombreAyuda">Opcional. Se usa en el saludo, en el avatar y en el certificado. No sale de este navegador.</p></div>` +
      `<div class="actions" style="flex:1 1 280px"><input class="field" id="tuNombre" autocomplete="given-name" aria-describedby="tuNombreAyuda" value="${esc(perfil().nombreCompleto)}" style="flex:1;min-width:0"><button class="btn btn-tonal" type="submit" style="align-self:center">Guardar</button></div></form>` +
    `<div class="card setting"><div><h3 id="hTema">Tema</h3><p>Automático sigue la configuración de tu dispositivo.</p></div>${grupo("tema", "Tema", [["system", "Automático"], ["light", "Claro"], ["dark", "Oscuro"]], tema.preferencia)}</div>` +
    `<div class="card setting"><div><h3>Contraste</h3><p>Más contraste en textos, bordes y colores.</p></div>${grupo("contraste", "Contraste", [["standard", "Estándar"], ["medium", "Medio"], ["high", "Alto"]], tema.contraste)}</div>` +
    `<div class="card setting"><div><h3>Movimiento</h3><p>Se respeta la opción "reducir movimiento" de tu sistema. ${reducido ? "Ahora está activada: las animaciones se reemplazan por cambios instantáneos." : "Ahora está desactivada."}</p></div><span class="chip chip-neutral">${icono(reducido ? "motion_photos_off" : "animation")}Según el sistema</span></div>` +
    `<section class="card" aria-labelledby="hDatos">${cabecera("folder_managed", "Tus datos", "", "hDatos", 3)}<div class="card-body">` +
      `<p class="muted" style="font:var(--md-sys-typescale-body-medium);margin-bottom:var(--app-space-4)">Todo queda en este navegador: no hay cuentas ni se envía nada a ningún servidor. Para seguir en otro dispositivo, exportá tu progreso y después importalo allá.</p>` +
      (store.persistente ? "" : `<div class="status status-warning" role="status" style="margin-bottom:var(--app-space-4)">${icono("warning")}<span><b>Tu navegador no permite guardar datos</b>Lo que hagas se mantiene solo mientras esta pestaña esté abierta. Exportá tu progreso antes de cerrarla.</span></div>`) +
      `<div class="setting" style="padding:0"><div class="actions">` +
        `<button class="btn btn-text" type="button" data-action="borrar" style="color:var(--md-sys-color-error)">${icono("delete")}Borrar mis datos</button>` +
        `<button class="btn btn-outlined" type="button" data-action="importar-progreso">${icono("upload")}Importar progreso</button>` +
        `<button class="btn btn-tonal" type="button" data-action="exportar-progreso">${icono("download")}Exportar mi progreso</button>` +
      `</div></div></div></section>` +
  `</div>`;
}
export function iniciarAjustes(rerender) {
  document.addEventListener("submit", e => {
    if (e.target.id !== "formNombre") return;
    e.preventDefault();
    setNombre(qs("#tuNombre").value);
    pintarPersona();
    aviso(perfil().nombre ? "Guardamos tu nombre" : "Quitamos tu nombre");
  });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-pref]"); if (!b) return;
    if (b.dataset.pref === "tema") tema.setPreferencia(b.dataset.val); else tema.setContraste(b.dataset.val);
    rerender();
    qs(`[data-pref="${b.dataset.pref}"][data-val="${b.dataset.val}"]`)?.focus();
  });
}

/* ---------- Secciones que se completan en etapas posteriores ---------- */
const PROXIMAMENTE = {
  biblioteca: ["La Biblioteca del taller se arma en la etapa 9", "Vas a encontrar todas las fuentes en formato APA 7, con filtros por bloque, nivel, idioma y tipo."],
  prompts: ["Todavía no guardaste prompts", "Cuando guardes un prompt en el laboratorio del Módulo 5, aparece acá con su nombre y sus etiquetas. Vas a poder exportarlos en Markdown o JSON."],
  glosario: ["El glosario se arma en la etapa 9", "Va a tener entre 30 y 40 términos, con su original en inglés, una definición propia y un buscador."],
  facilitadores: ["La guía para facilitadores se arma en la etapa 9", "Para cada módulo: duración sugerida, objetivos, secuencia de clase, preguntas para debatir y dinámicas para clases online."]
};
export function misPrompts() {
  const ps = prompts();
  const cab = `<div class="view-head"><div class="vh-txt"><h2>Mis prompts</h2><p>Los prompts que guardaste en las actividades, para copiarlos cuando los necesites.</p></div></div>`;
  if (!ps.length) return cab + `<div class="card">${vacio("Todavía no guardaste prompts", "Cuando guardes un prompt en el laboratorio del Módulo 5 o en otras actividades, aparece acá con su nombre y sus etiquetas.", `<a class="btn btn-filled" href="${href("modulo", 5)}">Ir al laboratorio de prompts</a>`)}</div>`;
  return cab + `<div class="prompt-list">${ps.slice().reverse().map(p => `<article class="card prompt-card" aria-labelledby="pp-${esc(p.id)}"><h3 id="pp-${esc(p.id)}">${esc(p.nombre)}</h3>` +
    (p.etiquetas?.length ? `<div class="tags">${p.etiquetas.map(t => `<span class="chip chip-neutral">${esc(t)}</span>`).join("")}</div>` : "") +
    `<pre>${esc(p.texto)}</pre><div class="card-actions" style="padding:0"><button class="btn btn-text" type="button" data-borrar-prompt="${esc(p.id)}" style="color:var(--md-sys-color-error)">${icono("delete")}Eliminar</button>` +
    `<button class="btn btn-tonal" type="button" data-copiar-prompt="${esc(p.id)}">${icono("content_copy")}Copiar</button></div></article>`).join("")}</div>`;
}
export function iniciarPrompts(rerender) {
  document.addEventListener("click", async e => {
    const c = e.target.closest("[data-copiar-prompt]");
    if (c) { const p = prompts().find(x => x.id === c.dataset.copiarPrompt); const { copiar } = await import("../activities/comun.js"); aviso(await copiar(p.texto) ? "Copiado al portapapeles" : "No se pudo copiar"); return; }
    const d = e.target.closest("[data-borrar-prompt]");
    if (d) {
      const { confirmar } = await import("../ui.js");
      const p = prompts().find(x => x.id === d.dataset.borrarPrompt);
      if (await confirmar({ icono: "delete", titulo: "¿Eliminar este prompt?", texto: `<b>${esc(p.nombre)}</b><br>Se quita de tu biblioteca. No se puede deshacer.`, ok: "Eliminar", peligro: true })) {
        eliminarPrompt(p.id); rerender(); qs("#contenido").focus(); aviso("Prompt eliminado");
      }
    }
  });
}

export function simple(id) {
  const r = RUTAS[id], p = PROXIMAMENTE[id];
  const accion = id === "prompts" ? `<a class="btn btn-filled" href="${href("modulo", 5)}">Ir al laboratorio de prompts</a>` : `<a class="btn btn-outlined" href="${href("recorrido")}">Ver Mi recorrido</a>`;
  return `<div class="view-head"><div class="vh-txt"><h2>${r.t}</h2><p>${r.s}</p></div></div><div class="card">${vacio(p[0], p[1], accion)}</div>`;
}

export function ayuda() {
  return `<div class="view-head"><div class="vh-txt"><h2>Ayuda</h2><p>Cómo usar el entorno</p></div></div>` +
    `<div class="card prose-card" style="padding:var(--app-space-5)"><div class="prose">` +
      `<h3>Cómo se organiza</h3><p>El taller tiene 21 módulos en 7 bloques. El orden va de lo general a lo particular, pero los módulos no se bloquean: podés elegir tu camino. En <a href="${href("recorrido")}">Mi recorrido</a> elegís una ruta sugerida.</p>` +
      `<h3>Dónde se guarda tu progreso</h3><p>En este navegador. No hay cuentas ni se envían datos a ningún servidor. Para cambiar de dispositivo, usá "Exportar mi progreso" e "Importar progreso" desde el menú de tu avatar o desde <a href="${href("ajustes")}">Ajustes</a>.</p>` +
      `<h3>Retomar donde dejaste</h3><p>El botón "Continuar", arriba a la derecha, te lleva al último módulo que visitaste.</p>` +
      `<h3>Accesibilidad</h3><ul><li>Podés usar todo el entorno con teclado. "Saltar al contenido" aparece con la primera pulsación de Tab.</li><li>En Ajustes elegís el tema (claro, oscuro o automático) y el contraste (estándar, medio o alto).</li><li>Si tu sistema tiene activado "reducir movimiento", las animaciones se reemplazan por cambios instantáneos.</li></ul>` +
    `</div></div>`;
}
