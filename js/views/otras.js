/* Taller - IA | Ajustes y accesibilidad, página base de cada módulo y secciones que se completan en etapas posteriores */
import { esc, qs } from "../util.js";
import { datos, modulo, bloque, avance, registrarVisita } from "../state.js";
import { store } from "../storage.js";
import { tema } from "../theme.js";
import { icono, cabecera, lineal, vacio } from "../ui.js";
import { RUTAS, href } from "../routes.js";

/* ---------- Ajustes y accesibilidad ---------- */
const grupo = (nombre, etiqueta, opciones, actual) =>
  `<div class="connected" role="group" aria-label="${etiqueta}">${opciones.map(o => `<button type="button" data-pref="${nombre}" data-val="${o[0]}" aria-pressed="${actual === o[0]}">${actual === o[0] ? icono("check") : ""}${o[1]}</button>`).join("")}</div>`;

export function ajustes() {
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return `<div class="view-head"><div class="vh-txt"><h2>Ajustes y accesibilidad</h2><p>Los ajustes se guardan en este navegador.</p></div></div><div class="settings">` +
    `<div class="card setting"><div><h3 id="hTema">Tema</h3><p>Automático sigue la configuración de tu dispositivo.</p></div>${grupo("tema", "Tema", [["system", "Automático"], ["light", "Claro"], ["dark", "Oscuro"]], tema.preferencia)}</div>` +
    `<div class="card setting"><div><h3>Contraste</h3><p>Más contraste en textos, bordes y colores.</p></div>${grupo("contraste", "Contraste", [["standard", "Estándar"], ["medium", "Medio"], ["high", "Alto"]], tema.contraste)}</div>` +
    `<div class="card setting"><div><h3>Movimiento</h3><p>Se respeta la opción "reducir movimiento" de tu sistema. ${reducido ? "Ahora está activada: las animaciones se reemplazan por cambios instantáneos." : "Ahora está desactivada."}</p></div><span class="chip chip-neutral">${icono(reducido ? "motion_photos_off" : "animation")}Según el sistema</span></div>` +
    `<section class="card" aria-labelledby="hDatos">${cabecera("folder_managed", "Tus datos", "", "hDatos", 3)}<div class="card-body">` +
      `<p class="muted" style="font:var(--md-sys-typescale-body-medium);margin-bottom:var(--app-space-4)">Todo queda en este navegador: no hay cuentas ni se envía nada a ningún servidor. Para seguir en otro dispositivo, exportá tu progreso y después importalo allá.</p>` +
      (store.persistente ? "" : `<div class="status status-warning" role="status" style="margin-bottom:var(--app-space-4)">${icono("warning")}<span><b>Tu navegador no permite guardar datos</b>Lo que hagas se mantiene solo mientras esta pestaña esté abierta. Exportá tu progreso antes de cerrarla.</span></div>`) +
      `<div class="setting" style="padding:0"><div class="actions">` +
        `<button class="btn btn-tonal" type="button" data-action="exportar-progreso">${icono("download")}Exportar mi progreso</button>` +
        `<button class="btn btn-outlined" type="button" data-action="importar-progreso">${icono("upload")}Importar progreso</button>` +
        `<button class="btn btn-text" type="button" data-action="borrar" style="color:var(--md-sys-color-error)">${icono("delete")}Borrar mis datos</button>` +
      `</div></div></div></section>` +
  `</div>`;
}
export function iniciarAjustes(rerender) {
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-pref]"); if (!b) return;
    if (b.dataset.pref === "tema") tema.setPreferencia(b.dataset.val); else tema.setContraste(b.dataset.val);
    rerender();
    qs(`[data-pref="${b.dataset.pref}"][data-val="${b.dataset.val}"]`)?.focus();
  });
}

/* ---------- Página de un módulo (estructura base; el motor de lecciones llega en la etapa 2) ---------- */
export function moduloVista(args) {
  const m = modulo(args[0]);
  if (!m) return { titulo: "Módulo no encontrado", sub: "", html: `<div class="card">${vacio("No encontramos ese módulo", "Puede que el enlace esté incompleto. Volvé al recorrido para elegir un módulo.", `<a class="btn btn-filled" href="${href("recorrido")}">Ir a Mi recorrido</a>`)}</div>` };
  const a = avance(m), b = bloque(m.bloque);
  registrarVisita(m.id, Math.min(a.hechos + 1, a.pasos));
  return {
    titulo: "Módulo " + m.id, sub: esc(m.titulo),
    html: `<div class="module-page">` +
      `<section class="card module-hero" aria-labelledby="hMod"><span class="chip chip-neutral">Bloque ${m.bloque} | ${esc(b.titulo)}</span>` +
        `<h2 id="hMod">Módulo ${m.id} | ${esc(m.titulo)}</h2><p>${esc(m.descripcion)}</p>` +
        `<div class="mh-prog"><span>${a.hechos} de ${a.pasos} pasos completados | alrededor de ${m.minutos} minutos</span>${lineal(a.pct, "Avance del módulo " + m.id)}</div></section>` +
      `<div class="status status-info" role="note">${icono("info")}<span><b>Lección en construcción</b>Las lecciones, con sus pasos, actividades y evaluación, se construyen a partir de la etapa 2. Esta página ya registra el módulo como tu último lugar visitado, para el botón "Continuar".</span></div>` +
      `<div style="display:flex;flex-wrap:wrap;gap:var(--app-space-2);justify-content:space-between">` +
        (m.id > 0 ? `<a class="btn btn-outlined" href="${href("modulo", m.id - 1)}">${icono("arrow_back")}Módulo ${m.id - 1}</a>` : "<span></span>") +
        (m.id < datos.modulos.length - 1 ? `<a class="btn btn-filled" href="${href("modulo", m.id + 1)}">Módulo ${m.id + 1}${icono("arrow_forward")}</a>` : "") +
      `</div></div>`
  };
}

/* ---------- Secciones que se completan en etapas posteriores ---------- */
const PROXIMAMENTE = {
  biblioteca: ["La Biblioteca del taller se arma en la etapa 9", "Vas a encontrar todas las fuentes en formato APA 7, con filtros por bloque, nivel, idioma y tipo."],
  prompts: ["Todavía no guardaste prompts", "Cuando guardes un prompt en el laboratorio del Módulo 5, aparece acá con su nombre y sus etiquetas. Vas a poder exportarlos en Markdown o JSON."],
  glosario: ["El glosario se arma en la etapa 9", "Va a tener entre 30 y 40 términos, con su original en inglés, una definición propia y un buscador."],
  facilitadores: ["La guía para facilitadores se arma en la etapa 9", "Para cada módulo: duración sugerida, objetivos, secuencia de clase, preguntas para debatir y dinámicas para clases online."]
};
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
