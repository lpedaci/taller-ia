/* Taller - IA | Motor de lecciones
   Ruta: #/modulo/{id}/paso/{n}  (también #/modulo/{id}, que lleva al último paso visitado)
   Contenido: content/modulo-{id}.json, con objetivos y pasos. Cada paso sigue un evento de Gagné
   (gancho, objetivo, activación, contenido, práctica, feedback, evaluación, transferencia). */
import { esc, qs, pad2 } from "../util.js";
import { datos, modulo, bloque, avance, pasosVistos, registrarVisita, completarPaso, completarModulo, leerJSON } from "../state.js";
import { icono, lineal, vacio, aviso } from "../ui.js";
import { href } from "../routes.js";
import { dibujar } from "./bloques.js";
// Las actividades se registran como tipos de bloque al importarse
import "../activities/evaluadas.js";
import "../activities/produccion.js";
import "../activities/video.js";
import "../activities/inicio-taller.js";
import "../activities/criterio.js";
import "../charts.js";
import "../animacion.js";
import { demoraSimulada, errorSimulado, tarjetaError, esperaConMensaje } from "../estados.js";
import { crearLector, disponible as puedeLeer } from "../escuchar.js";

const MOMENTOS = { gancho: "Para empezar", objetivo: "Qué vas a lograr", activacion: "Lo que ya sabés", contenido: "Contenido", practica: "Práctica guiada", feedback: "Revisión", evaluacion: "Chequeo", transferencia: "En tu trabajo o en tu aula", cierre: "Cierre" };
const cache = new Map();
let actual = null;           // { id, leccion, meta, paso }
let direccion = "adelante";
let lector = null;

const archivo = id => `content/modulo-${/^\d+$/.test(String(id)) ? pad2(id) : id}.json`;
async function cargarLeccion(id) {
  if (cache.has(id)) return cache.get(id);
  await demoraSimulada(2500);
  errorSimulado("la lección", "error-leccion");
  const l = await leerJSON(archivo(id));
  cache.set(id, l); return l;
}
/** Datos del módulo: los de modulos.json, o los del propio archivo (lección de prueba) */
function metaDe(id, l) {
  const m = modulo(id);
  if (m) return { ...m, pasos: l ? l.pasos.length : m.pasos, prueba: false };
  return { id, titulo: l?.titulo || "Lección", descripcion: l?.descripcion || "", bloque: l?.bloque || 0, pasos: l?.pasos.length || 1, prueba: true };
}

/* ---------- Esqueleto mientras carga (misma forma que la lección: sin saltos de layout) ---------- */
export function esqueleto() {
  return `<div id="lecEspera" class="lec-espera"></div><div class="lesson" aria-hidden="true"><div class="lesson-main"><div class="card lesson-head"><div class="sk" style="height:24px;width:160px"></div><div class="sk" style="height:32px;width:70%;margin-top:12px"></div><div class="sk" style="height:8px;margin-top:16px"></div></div>` +
    `<div class="card lesson-step"><div class="sk" style="height:16px;width:120px"></div><div class="sk" style="height:28px;width:60%;margin:12px 0 20px"></div>` +
    `<div class="sk" style="height:14px"></div><div class="sk" style="height:14px;margin-top:10px"></div><div class="sk" style="height:14px;width:80%;margin-top:10px"></div><div class="sk" style="height:160px;margin-top:24px;border-radius:var(--md-sys-shape-corner-large)"></div></div></div>` +
    `<div class="card lesson-side"><div class="sk" style="height:20px;width:60%"></div>${'<div class="sk" style="height:40px;margin-top:12px"></div>'.repeat(5)}</div></div>`;
}

/** Lee la ruta, carga el contenido y dibuja el paso. Devuelve el título para la barra superior. */
export async function mostrar(main, args) {
  const id = args[0];
  if (!modulo(id) && !/^[a-z0-9-]+$/.test(String(id || ""))) return noEncontrado(main);
  // Los módulos sin lección todavía no piden archivo (evita un error 404 en la consola)
  if (modulo(id) && !modulo(id).leccion) return enConstruccion(main, modulo(id));
  let leccion = null;
  let cancelar = () => {};
  if (!cache.has(id)) {
    main.innerHTML = esqueleto(); main.setAttribute("aria-busy", "true");
    cancelar = esperaConMensaje(qs("#lecEspera"), { texto: "Preparando la lección: pasos y actividades.", despues: "Ya casi está, preparando las actividades.", salida: `<div class="act-actions"><a class="btn btn-outlined" href="${href("recorrido")}">${icono("route")}Volver a Mi recorrido</a></div>` });
  }
  try { leccion = await cargarLeccion(id); }
  catch (e) {
    cancelar();
    if (e.status === 404 && modulo(id)) return enConstruccion(main, modulo(id));
    if (e.status === 404) return noEncontrado(main);
    // Error de carga: explica qué pasó, qué hacer, y ofrece seguir con otra cosa
    main.innerHTML = tarjetaError({
      titulo: "No se pudo cargar la lección",
      texto: "Puede ser un problema de conexión. Tu progreso guardado no se pierde.",
      acciones: `<a class="btn btn-outlined" href="${href("recorrido")}">${icono("route")}Volver a Mi recorrido</a><button class="btn btn-filled" type="button" data-reintentar>${icono("refresh")}Reintentar</button>`
    });
    return { titulo: modulo(id) ? "Módulo " + id : "Lección", sub: "No se pudo cargar", foco: "[data-reintentar]" };
  }
  cancelar();
  const meta = metaDe(id, leccion);
  if (args[1] === "completado") return completado(main, meta, leccion);
  let paso = args[1] === "paso" ? parseInt(args[2], 10) : NaN;
  if (isNaN(paso)) {
    // Retomar: el primer paso sin completar, o el primero si todo está hecho
    const vistos = pasosVistos(id);
    paso = Math.min(leccion.pasos.length, (vistos.length ? Math.max(...vistos) + 1 : 1));
    history.replaceState(null, "", href("modulo", id, "paso", paso));
  }
  paso = Math.max(1, Math.min(leccion.pasos.length, paso));
  const cambiaDePaso = actual && actual.id === id && actual.paso !== paso;
  if (!cambiaDePaso) direccion = "adelante";
  actual = { id, leccion, meta, paso };
  if (!meta.prueba) registrarVisita(id, paso);
  pintar(main, cambiaDePaso);
  return { titulo: meta.prueba ? meta.titulo : "Módulo " + meta.id, sub: meta.prueba ? "Lección de prueba" : meta.titulo, foco: "#pasoT" };
}

function pintar(main, animar) {
  detenerLectura();
  const html = vistaPaso();
  // Con transición, el contenido nuevo llega después: el foco se lleva al título del paso cuando ya existe
  const aplicar = () => { main.innerHTML = html.html; html.montar(); if (animar) qs("#pasoT")?.focus({ preventScroll: true }); };
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animar && document.startViewTransition && !reducido) {
    document.documentElement.dataset.dir = direccion;
    document.startViewTransition(aplicar).finished.finally(() => { delete document.documentElement.dataset.dir; });
  } else aplicar();
}

function vistaPaso() {
  const { id, leccion, meta, paso } = actual, total = leccion.pasos.length, P = leccion.pasos[paso - 1];
  const vistos = meta.prueba ? [] : pasosVistos(id);
  const b = bloque(meta.bloque);
  const cuerpo = dibujar(P.bloques, { leccion, meta, paso });
  const ultimo = paso === total;
  const indice = leccion.pasos.map((p, i) => {
    const n = i + 1, hecho = vistos.includes(n), aca = n === paso;
    return `<li><a class="step-link${aca ? " is-here" : ""}" href="${href("modulo", id, "paso", n)}"${aca ? ' aria-current="step"' : ""}>` +
      `<span class="step-ic">${aca ? icono("arrow_right_alt") : hecho ? icono("check_circle", "fill") : `<span class="step-n">${n}</span>`}</span>` +
      `<span class="step-txt">${esc(p.titulo)}<span class="sr-only">${hecho ? ", completado" : aca ? ", paso actual" : ""}</span></span></a></li>`;
  }).join("");
  return {
    montar: cuerpo.montar,
    html: `<div class="lesson">` +
      `<div class="lesson-main">` +
        `<header class="card lesson-head"><div class="lh-chips"><span class="chip chip-neutral">${meta.prueba ? "Lección de prueba" : `Bloque ${meta.bloque} | ${esc(b?.titulo || "")}`}</span></div>` +
          `<h2 class="lh-title">${meta.prueba ? "" : `Módulo ${meta.id} | `}${esc(meta.titulo)}</h2>` +
          `<div class="lh-prog"><span>Paso ${paso} de ${total}</span>${lineal(paso / total * 100, `Paso ${paso} de ${total}`)}</div></header>` +
        (meta.prueba ? `<div class="status status-info" role="note">${icono("science")}<span><b>Lección de prueba</b>Sirve para revisar el motor de lecciones y las actividades. Lo que hagas acá no cuenta para tu progreso.</span></div>` : "") +
        `<div class="lesson-bar" role="toolbar" aria-label="Navegación de la lección">` +
          `<a class="btn btn-text lb-prev${paso === 1 ? " is-off" : ""}" ${paso === 1 ? 'aria-disabled="true" tabindex="-1"' : `href="${href("modulo", id, "paso", paso - 1)}"`} data-dir="atras">${icono("arrow_back")}<span class="lb-lbl">Anterior</span></a>` +
          (puedeLeer() ? `<div class="lb-listen" id="lbListen"><button class="btn btn-tonal" type="button" id="btnEscuchar" aria-pressed="false">${icono("volume_up")}<span class="lb-lbl">Escuchar</span></button></div>` : "") +
          (ultimo
            ? `<a class="btn btn-filled lb-next" href="${href("modulo", id, "completado")}" data-terminar>${icono("flag")}Terminar módulo</a>`
            : `<a class="btn btn-filled lb-next" href="${href("modulo", id, "paso", paso + 1)}" data-dir="adelante" data-completa="${paso}">Siguiente${icono("arrow_forward")}</a>`) +
        `</div>` +
        `<article class="card lesson-step" aria-labelledby="pasoT">` +
          `<p class="step-moment">${esc(MOMENTOS[P.momento] || P.momento || "")}</p>` +
          `<h3 id="pasoT" tabindex="-1">${esc(P.titulo)}</h3>` +
          `<div class="step-body" id="pasoCuerpo">${cuerpo.html}</div>` +
        `</article>` +
      `</div>` +
      `<aside class="card lesson-side" aria-labelledby="idxT"><h3 id="idxT">En este módulo</h3><ol class="step-list">${indice}</ol>` +
        (leccion.objetivos?.length ? `<details class="side-goals"><summary>${icono("flag", "sm")}Objetivos del módulo</summary><ul>${leccion.objetivos.map(o => `<li>${esc(o.texto)}</li>`).join("")}</ul></details>` : "") +
      `</aside>` +
    `</div>`
  };
}

/* ---------- Fin del módulo: insignia con cambio de forma (M3 Expressive) ---------- */
function completado(main, meta, leccion) {
  if (!meta.prueba) { leccion.pasos.forEach((_, i) => completarPaso(meta.id, i + 1)); completarModulo(meta.id); }
  const sig = !meta.prueba && modulo(+meta.id + 1);
  main.innerHTML = `<div class="lesson-done card"><div class="badge-morph" aria-hidden="true">${icono("workspace_premium", "fill")}</div>` +
    `<h2 id="finT" tabindex="-1">${meta.prueba ? "Terminaste la lección de prueba" : `Completaste el Módulo ${meta.id}`}</h2>` +
    `<p>${esc(meta.titulo)}${meta.prueba ? "" : ". La insignia del módulo queda en Mi aprendizaje."}</p>` +
    `<div class="done-actions" data-excepcion-ds="acciones-alineacion"><a class="btn btn-text" href="${href("modulo", meta.id, "paso", 1)}">${icono("replay")}Repasar desde el principio</a>` +
    `<a class="btn btn-outlined" href="${href("recorrido")}">${icono("route")}Volver a Mi recorrido</a>` +
    (sig ? `<a class="btn btn-filled" href="${href("modulo", sig.id)}">Ir al Módulo ${sig.id}${icono("arrow_forward")}</a>` : "") + `</div></div>`;
  return { titulo: meta.prueba ? meta.titulo : "Módulo " + meta.id, sub: meta.titulo, foco: "#finT" };
}

function enConstruccion(main, m) {
  const a = avance(m), b = bloque(m.bloque);
  registrarVisita(m.id, 1);
  main.innerHTML = `<div class="module-page"><section class="card module-hero" aria-labelledby="hMod"><span class="chip chip-neutral">Bloque ${m.bloque} | ${esc(b.titulo)}</span>` +
    `<h2 id="hMod" tabindex="-1">Módulo ${m.id} | ${esc(m.titulo)}</h2><p>${esc(m.descripcion)}</p>` +
    `<div class="mh-prog"><span>${a.hechos} de ${a.pasos} pasos completados | alrededor de ${m.minutos} minutos</span>${lineal(a.pct, "Avance del módulo " + m.id)}</div></section>` +
    `<div class="status status-info" role="note">${icono("info")}<span><b>Lección en preparación</b>El contenido de este módulo se suma en las próximas etapas. Mientras tanto podés recorrer la <a href="${href("modulo", "prueba")}">lección de prueba</a>.</span></div>` +
    `<div style="display:flex;flex-wrap:wrap;gap:var(--app-space-2);justify-content:space-between">` +
      (m.id > 0 ? `<a class="btn btn-outlined" href="${href("modulo", m.id - 1)}">${icono("arrow_back")}Módulo ${m.id - 1}</a>` : "<span></span>") +
      (m.id < datos.modulos.length - 1 ? `<a class="btn btn-filled" href="${href("modulo", m.id + 1)}">Módulo ${m.id + 1}${icono("arrow_forward")}</a>` : "") +
    `</div></div>`;
  return { titulo: "Módulo " + m.id, sub: m.titulo, foco: "#hMod" };
}
function noEncontrado(main) {
  main.innerHTML = `<div class="card">${vacio("No encontramos ese módulo", "Puede que el enlace esté incompleto. Volvé al recorrido para elegir un módulo.", `<a class="btn btn-filled" href="${href("recorrido")}">Ir a Mi recorrido</a>`)}</div>`;
  return { titulo: "Módulo no encontrado", sub: "" };
}

/* ---------- Escuchar ---------- */
function detenerLectura() { lector?.detener(); }
function pintarLector(est, info) {
  const box = qs("#lbListen"); if (!box) return;
  if (est === "detenido") {
    box.innerHTML = `<button class="btn btn-tonal" type="button" id="btnEscuchar" aria-pressed="false">${icono("volume_up")}<span class="lb-lbl">Escuchar</span></button>`;
    return;
  }
  const leyendo = est === "leyendo";
  box.innerHTML = `<div class="connected" role="group" aria-label="Lectura en voz alta">` +
    `<button type="button" data-lec="${leyendo ? "pausar" : "reanudar"}" aria-label="${leyendo ? "Pausar la lectura" : "Seguir leyendo"}" data-tip="${leyendo ? "Pausar" : "Seguir"}">${icono(leyendo ? "pause" : "play_arrow")}</button>` +
    `<button type="button" data-lec="velocidad" aria-label="Velocidad de lectura: ${String(info.velocidad).replace(".", ",")} veces. Cambiar" data-tip="Velocidad">${String(info.velocidad).replace(".", ",")}x</button>` +
    `<button type="button" data-lec="detener" aria-label="Detener la lectura" data-tip="Detener">${icono("stop")}</button></div>`;
}

export function iniciar() {
  lector = crearLector(pintarLector);
  document.addEventListener("click", async e => {
    const nav = e.target.closest(".lesson-bar a[data-dir], .step-link");
    if (nav) {
      if (nav.getAttribute("aria-disabled") === "true") { e.preventDefault(); return; }
      const destino = nav.getAttribute("href")?.match(/paso\/(\d+)/);
      direccion = nav.dataset.dir || (destino && actual && +destino[1] < actual.paso ? "atras" : "adelante");
      if (nav.dataset.completa && actual && !actual.meta.prueba) completarPaso(actual.id, +nav.dataset.completa);
      return; // el enlace cambia el hash y el enrutador dibuja el paso
    }
    if (e.target.closest("#btnEscuchar")) {
      const texto = [qs("#pasoT")?.textContent, qs("#pasoCuerpo")?.innerText].filter(Boolean).join(". ");
      const r = await lector.leer(texto);
      if (!r.ok) aviso(r.motivo);
      else if (r.sinVozEs) aviso("Tu navegador no tiene una voz en español instalada: la lectura puede sonar con otro acento.");
      qs('[data-lec="pausar"]')?.focus();
      return;
    }
    const l = e.target.closest("[data-lec]");
    if (l) {
      const a = l.dataset.lec;
      if (a === "pausar") { lector.pausar(); qs('[data-lec="reanudar"]')?.focus(); }
      else if (a === "reanudar") { lector.reanudar(); qs('[data-lec="pausar"]')?.focus(); }
      else if (a === "velocidad") { lector.otraVelocidad(); qs('[data-lec="velocidad"]')?.focus(); }
      else { lector.detener(); qs("#btnEscuchar")?.focus(); }
    }
  });
  addEventListener("hashchange", () => { if (!location.hash.startsWith("#/modulo/")) detenerLectura(); });
}
