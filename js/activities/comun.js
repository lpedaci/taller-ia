/* Taller - IA | Base común de las actividades
   - Marco visual: tipo de actividad, título, consigna y zona de feedback.
   - Guardado: en las lecciones reales, el resultado alimenta el progreso y las competencias.
     En la lección de prueba, queda solo en memoria y no cuenta.
   - Feedback: siempre explica por qué, también cuando la respuesta es correcta. */
import { esc } from "../util.js";
import { icono } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrarActividad, actividadGuardada, guardarBorrador, agregarEvidencia } from "../state.js";

const memoria = new Map();
export const idDe = (ctx, b) => `${ctx.meta.id}-${b.id}`;
export const esPrueba = ctx => !!ctx.meta.prueba;

export function leer(ctx, b) {
  return esPrueba(ctx) ? memoria.get(idDe(ctx, b)) || null : actividadGuardada(idDe(ctx, b));
}
/** resultado: correcto | parcial | incorrecto | hecho */
export function guardarResultado(ctx, b, datos) {
  const id = idDe(ctx, b);
  if (esPrueba(ctx)) { const p = memoria.get(id); memoria.set(id, { ...p, ...datos, intentos: (p?.intentos || 0) + 1 }); return; }
  registrarActividad(id, { modulo: ctx.meta.id, competencia: b.competencia || null, objetivo: b.objetivo || null, ...datos });
  if (b.evidencia && (datos.resultado === "hecho" || datos.resultado === "correcto")) agregarEvidencia(id, b.evidencia, `Módulo ${ctx.meta.id} | ${ctx.meta.titulo}`, ctx.meta.id);
}
export function guardarParcial(ctx, b, respuesta) {
  const id = idDe(ctx, b);
  // Indicador discreto "Guardado": no interrumpe ni mueve el foco
  const ind = document.querySelector(`[data-act="${CSS.escape(id)}"] .act-guardado`);
  if (ind) { ind.textContent = ""; requestAnimationFrame(() => { ind.innerHTML = `<span class="ms" aria-hidden="true">cloud_done</span>Guardado`; }); }
  if (esPrueba(ctx)) { memoria.set(id, { ...memoria.get(id), respuesta }); return; }
  guardarBorrador(id, respuesta, { modulo: ctx.meta.id });
}

const TIPOS = {
  quiz: ["quiz", "Opción múltiple"], vf: ["rule", "Verdadero o falso"], clasificador: ["category", "Clasificar"],
  errores: ["spellcheck", "Encontrá los errores"], escenario: ["alt_route", "Escenario con decisiones"],
  constructor: ["edit_note", "Constructor guiado"], reflexion: ["edit", "Reflexión para tu diario"],
  comparador: ["compare", "Antes y después"], tabla: ["table_chart", "Tabla comparativa"],
  flujo: ["account_tree", "Diseñá un flujo"], storyboard: ["movie", "Storyboard"], mapa: ["hub", "Mapa de impactos"]
};

/** Marco de la actividad. El id del título se usa como nombre accesible de la región. */
export function marco(tipo, b, ctx, cuerpo) {
  const [ic, etiqueta] = TIPOS[tipo] || ["task", "Actividad"];
  const hid = "t-" + idDe(ctx, b);
  return `<section class="act act-${tipo}" aria-labelledby="${hid}" data-act="${esc(idDe(ctx, b))}">` +
    `<header class="act-head"><span class="act-ic">${icono(ic)}</span><div><p class="act-tipo">Actividad | ${etiqueta}</p><h4 id="${hid}">${esc(b.titulo || etiqueta)}</h4></div><span class="act-guardado" role="status"></span></header>` +
    (b.consigna ? `<div class="act-consigna">${md(b.consigna)}</div>` : "") +
    `<div class="act-cuerpo">${cuerpo}</div>` +
    `<div class="act-fb" role="status" aria-live="polite"></div></section>`;
}

const CLASE = { correcto: "status-success", parcial: "status-warning", incorrecto: "status-error", info: "status-info", hecho: "status-success" };
const ICONO = { correcto: "check_circle", parcial: "warning", incorrecto: "error", info: "info", hecho: "check_circle" };
/** Feedback general de la actividad, anunciado a los lectores de pantalla */
export function mostrarFeedback(el, estado, titulo, html = "") {
  const fb = el.querySelector(".act-fb");
  fb.innerHTML = "";
  requestAnimationFrame(() => {
    fb.innerHTML = `<div class="status ${CLASE[estado]} act-fb-in">${icono(ICONO[estado], "fill")}<div><b>${esc(titulo)}</b>${html}</div></div>`;
  });
}
export const limpiarFeedback = el => { el.querySelector(".act-fb").innerHTML = ""; };

/** Marca de resultado por ítem: ícono y texto, nunca solo color */
export function marcaItem(ok, texto) {
  return `<div class="item-fb ${ok ? "is-ok" : "is-bad"}">${icono(ok ? "check_circle" : "cancel", "fill")}<div><b>${ok ? "Correcto." : "Revisalo."}</b> ${md(texto).replace(/^<p>|<\/p>$/g, "")}</div></div>`;
}

/** Botones de acción al pie de la actividad */
export const acciones = (...botones) => `<div class="act-actions">${botones.join("")}</div>`;
export const boton = (accion, texto, clase = "btn-filled", ic = "") => `<button class="btn ${clase}" type="button" data-a="${accion}">${ic ? icono(ic) : ""}${texto}</button>`;

/** Debounce simple para guardar borradores mientras se escribe */
export function demorar(fn, ms = 600) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

/** Copiar al portapapeles con alternativa para navegadores sin permiso */
export async function copiar(texto) {
  try { await navigator.clipboard.writeText(texto); return true; }
  catch {
    const ta = document.createElement("textarea"); ta.value = texto; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch { /* sin permiso */ }
    ta.remove(); return ok;
  }
}
