/* Taller - IA | Estado de la persona y contenido del taller
   - El contenido (módulos, bloques, rutas) viene de /content/*.json.
   - Modo real (por defecto): todo sale de lo que la persona completa y produce.
   - Modo de ejemplo (?demo=1): el panel usa content/demo.json para revisar el
     diseño con datos. Lo que se hace en ese modo se guarda aparte y no toca
     el progreso real.
   - Nada sale del navegador: no hay backend ni analítica. */
import { store } from "./storage.js";
import { enDia, semilla, sumarDias, hoy, isoDia } from "./util.js";

const VERSION = 2;
export const DEMO = new URLSearchParams(location.search).get("demo") === "1";
const CLAVE = DEMO ? "estado-demo" : "estado";
export const datos = { bloques: [], modulos: [], competencias: [], niveles: [], rutas: [], demo: null, agenda: null };
let est = null;

/** Tipos de evento de la agenda: grupo (color categórico), ícono y etiqueta. Nunca solo color. */
export const TIPOS = {
  cierre: { k: "entrega", ic: "event_busy", lbl: "Cierre" },
  entrega: { k: "entrega", ic: "upload_file", lbl: "Entrega" },
  apertura: { k: "eval", ic: "lock_open", lbl: "Apertura" },
  parcial: { k: "eval", ic: "quiz", lbl: "Parcial" },
  final: { k: "eval", ic: "workspace_premium", lbl: "Final" },
  videollamada: { k: "vivo", ic: "videocam", lbl: "Encuentro" },
  tutoria: { k: "vivo", ic: "person", lbl: "Tutoría" },
  workshop: { k: "workshop", ic: "groups", lbl: "Workshop" }
};
export const GRUPOS_EVENTO = [
  { k: "entrega", lbl: "Entregas y cierres" },
  { k: "eval", lbl: "Evaluaciones" },
  { k: "vivo", lbl: "Videollamadas" },
  { k: "workshop", lbl: "Workshops" }
];

export async function leerJSON(ruta) {
  const r = await fetch(ruta, { cache: "no-cache" });
  if (!r.ok) { const e = new Error("No se pudo leer " + ruta + " (" + r.status + ")"); e.status = r.status; throw e; }
  return r.json();
}

/** Carga el contenido y el estado guardado. Lanza error si el contenido no está disponible. */
export async function cargar() {
  const [mod, demo, agenda] = await Promise.all([
    leerJSON("content/modulos.json"),
    leerJSON("content/demo.json"),
    leerJSON("content/agenda.json").catch(() => ({ cohortes: [] }))
  ]);
  Object.assign(datos, mod, { demo, agenda });
  est = normalizar(store.get(CLAVE, null));
  return est;
}

function inicial() {
  const base = {
    version: VERSION,
    perfil: { nombre: "", cohorte: null },
    ruta: "esencial",
    ultimo: null,                 // { modulo, paso }
    progreso: {},                 // { [modulo]: { vistos: [pasos], completado: bool } }
    actividades: {},              // { [id]: { modulo, competencia, objetivo, resultado, puntaje, intentos, fecha, respuesta } }
    registro: {},                 // { "aaaa-mm-dd": cantidad completada ese día }
    tareas: { hechas: {}, propias: [], ocultas: [] },
    evidencias: [],
    objetivos: []
  };
  if (!DEMO) return base;
  const d = datos.demo;
  const progreso = {};
  Object.entries(d.progreso).forEach(([k, n]) => { progreso[k] = { vistos: Array.from({ length: n }, (_, i) => i + 1), completado: false }; });
  return { ...base, perfil: { ...d.perfil }, ruta: d.perfil.ruta, ultimo: { ...d.ultimo }, progreso };
}
function normalizar(s) {
  const base = inicial();
  if (!s || typeof s !== "object" || s.version !== VERSION) return base;
  return { ...base, ...s, perfil: { ...base.perfil, ...(s.perfil || {}) }, tareas: { ...base.tareas, ...(s.tareas || {}) } };
}

export const estado = () => est;
export function guardar() { store.set(CLAVE, est); }

/* ---------- Perfil ---------- */
export function perfil() {
  const p = est.perfil, nombre = (p.nombre || "").trim();
  // Iniciales: primera letra del primer y del último nombre ("Ana María López" da "AL")
  const partes = nombre ? nombre.split(/\s+/) : [];
  const iniciales = partes.length ? (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase() : "";
  return { nombre: nombre.split(/\s+/)[0] || "", nombreCompleto: nombre, iniciales: p.iniciales || iniciales, cohorte: p.cohorte || null };
}
export function setNombre(n) { est.perfil.nombre = String(n || "").trim().slice(0, 60); delete est.perfil.iniciales; guardar(); }

/* ---------- Módulos y progreso ---------- */
export const modulo = id => datos.modulos.find(m => String(m.id) === String(id)) || null;
export const bloque = n => datos.bloques.find(b => b.n === +n) || null;
const prog = id => est.progreso[id] || { vistos: [], completado: false };
export function avance(m) {
  const p = prog(m.id);
  const hechos = p.completado ? m.pasos : Math.min(m.pasos, p.vistos.length);
  const pct = Math.round(hechos / m.pasos * 100);
  return { hechos, pasos: m.pasos, pct, estado: pct >= 100 ? "completado" : hechos > 0 ? "en-curso" : "sin-empezar" };
}
export const completados = () => datos.modulos.filter(m => avance(m).estado === "completado");
/** Módulo para "Continuar": el último visitado o, si no hay, el Módulo 0 */
export const moduloActual = () => (est.ultimo && modulo(est.ultimo.modulo)) || datos.modulos[0];
export const pasoActual = () => est.ultimo?.paso || 1;
export const hayProgreso = () => Object.values(est.progreso).some(p => p.vistos.length);

/** La persona llegó a un paso: queda como lugar para retomar */
export function registrarVisita(id, paso = 1) {
  if (!modulo(id)) return;
  est.ultimo = { modulo: +id, paso }; guardar();
}
/** Se completa un paso al avanzar desde él. Devuelve true si es la primera vez. */
export function completarPaso(id, paso) {
  if (!modulo(id)) return false;
  const p = est.progreso[id] || (est.progreso[id] = { vistos: [], completado: false });
  if (p.vistos.includes(paso)) return false;
  p.vistos.push(paso); sumarRegistro(); guardar(); return true;
}
export function completarModulo(id) {
  if (!modulo(id)) return;
  const p = est.progreso[id] || (est.progreso[id] = { vistos: [], completado: false });
  p.completado = true; guardar();
}
export const pasosVistos = id => prog(id).vistos;

/* ---------- Actividades ---------- */
/** Guarda el resultado de una actividad evaluada o producida. resultado: correcto | parcial | incorrecto | hecho */
export function registrarActividad(id, datosAct) {
  const previa = est.actividades[id];
  est.actividades[id] = { ...previa, ...datosAct, intentos: (previa?.intentos || 0) + 1, fecha: new Date().toISOString() };
  if (!previa) sumarRegistro();
  guardar();
}
export const actividadGuardada = id => est.actividades[id] || null;
function sumarRegistro() { const k = isoDia(hoy()); est.registro[k] = (est.registro[k] || 0) + 1; }

/* ---------- Rutas sugeridas ---------- */
export const rutaActual = () => datos.rutas.find(r => r.id === est.ruta) || datos.rutas[0];
export function enRuta(m, ruta = rutaActual()) {
  return ruta.bloques.includes(m.bloque) || ruta.modulos.includes(m.id);
}
export function setRuta(id) {
  if (!datos.rutas.some(r => r.id === id)) return;
  est.ruta = id; guardar();
}

/* ---------- Competencias ---------- */
/** Nivel a partir de los objetivos demostrados: el cálculo sale de actividades evaluadas, no de páginas vistas */
export function competencias() {
  if (DEMO) return datos.competencias.map(c => ({ ...c, ...(datos.demo.competencias[c.id] || { nivel: 0, evidencias: 0, objetivos: [0, 0] }) }));
  const acts = Object.values(est.actividades).filter(a => a.resultado === "correcto" || a.resultado === "hecho");
  return datos.competencias.map(c => {
    const total = datos.modulos.reduce((n, m) => n + (m.objetivos || []).filter(o => o.competencia === c.id).length, 0);
    const mias = acts.filter(a => a.competencia === c.id);
    const logrados = new Set(mias.map(a => a.objetivo).filter(Boolean)).size;
    const ratio = total ? logrados / total : 0;
    const nivel = !mias.length ? 0 : ratio >= 1 ? 3 : ratio >= .34 ? 2 : 1;
    return { ...c, nivel, evidencias: mias.length, objetivos: [Math.min(logrados, total), total] };
  });
}
export function objetivosTotales() {
  const cs = competencias();
  return { logrados: cs.reduce((a, c) => a + c.objetivos[0], 0), total: cs.reduce((a, c) => a + c.objetivos[1], 0) };
}
/** Próximo paso sugerido: la competencia con menos evidencia que tenga módulos por hacer */
export function sugerencia() {
  if (DEMO) return datos.demo.sugerencia;
  if (!hayProgreso()) return { modulo: 0, texto: "empezá por la bienvenida: ahí ves cómo funciona el entorno y hacés tu autodiagnóstico." };
  const m = datos.modulos.find(x => enRuta(x) && avance(x).estado !== "completado");
  return m ? { modulo: m.id, texto: `seguí con "${m.titulo}", el próximo módulo de tu ruta.` } : null;
}

/* ---------- Evidencias, objetivos personales y avisos ---------- */
export const evidencias = () => DEMO ? datos.demo.evidencias : est.evidencias;
export const evidenciasTotal = () => DEMO ? datos.demo.evidenciasTotal : est.evidencias.length;
export const objetivosPersonales = () => DEMO ? datos.demo.objetivos : est.objetivos;
export const avisos = () => DEMO ? (datos.demo.avisos || []) : [];

/* ---------- Agenda ---------- */
let cacheEventos = null;
export function eventos() {
  if (cacheEventos) return cacheEventos;
  let lista = [];
  if (DEMO) {
    lista = datos.demo.eventos.map(e => ({ titulo: e.titulo, tipo: e.tipo, modulo: e.modulo ?? null, inicio: enDia(e.dia, e.inicio), fin: e.fin ? enDia(e.dia, e.fin) : null }));
  } else {
    const coh = (datos.agenda?.cohortes || []).find(c => c.id === est.perfil.cohorte);
    lista = (coh?.eventos || []).map(e => ({ titulo: e.titulo, tipo: e.tipo, modulo: e.modulo ?? null, enlace: e.enlace || null, inicio: new Date(e.inicio), fin: e.fin ? new Date(e.fin) : null }));
  }
  cacheEventos = lista.filter(e => !isNaN(e.inicio)).sort((a, b) => a.inicio - b.inicio);
  return cacheEventos;
}
export const terminado = e => (e.fin || e.inicio) < new Date();

/* ---------- Pendientes ---------- */
export function tareas() {
  const t = est.tareas;
  const curso = DEMO ? datos.demo.pendientes
    .filter(p => !t.ocultas.includes(p.id))
    .map(p => ({ id: p.id, titulo: p.titulo, vence: enDia(p.dia, p.hora).getTime(), tipo: p.tipo, propia: !!p.propia, hecha: p.id in t.hechas ? t.hechas[p.id] : !!p.hecha })) : [];
  const propias = t.propias.map(p => ({ ...p, propia: true, tipo: null }));
  return curso.concat(propias).sort((a, b) => (a.hecha - b.hecha) || (a.vence - b.vence));
}
export const tareasAbiertas = () => tareas().filter(t => !t.hecha).length;
export function marcarTarea(id, hecha) {
  const p = est.tareas.propias.find(x => x.id === id);
  if (p) p.hecha = hecha; else est.tareas.hechas[id] = hecha;
  guardar();
}
export function agregarTarea(titulo, vence) {
  const t = { id: Date.now(), titulo, vence, hecha: false };
  est.tareas.propias.push(t); guardar(); return t;
}
export function eliminarTarea(id) {
  const i = est.tareas.propias.findIndex(x => x.id === id);
  if (i > -1) est.tareas.propias.splice(i, 1);
  else if (DEMO && datos.demo.pendientes.some(p => p.id === id && p.propia)) est.tareas.ocultas.push(id);
  guardar();
}

/* ---------- Registro de actividad ---------- */
let cacheAct = null;
/** { "Wed Nov 18 2026": cantidad } */
export function actividad() {
  if (!DEMO) {
    const act = {};
    Object.entries(est.registro).forEach(([k, n]) => { const [y, m, d] = k.split("-").map(Number); act[new Date(y, m - 1, d).toDateString()] = n; });
    return act;
  }
  if (cacheAct) return cacheAct;
  const s = datos.demo.actividad?.semilla ?? 7, h = hoy(), act = {};
  for (let i = 0; i < 400; i++) {
    const r = semilla(i + s), rampa = i < 120 ? 1 : i < 200 ? .55 : .2;
    let c = 0;
    if (r < .62 * rampa) c = 1 + Math.floor(semilla(i * 3) * 5 * rampa + (i < 40 ? 1 : 0));
    if (c) act[sumarDias(h, -i).toDateString()] = c;
  }
  cacheAct = act;
  return act;
}

/* ---------- Exportar, importar y borrar ---------- */
export function exportar() {
  const datosGuardados = {};
  store.claves().filter(k => k !== "estado-demo").forEach(k => { datosGuardados[k] = store.get(k); });
  if (!DEMO && !("estado" in datosGuardados)) datosGuardados.estado = est;
  return { app: "taller-ia", version: VERSION, exportado: new Date().toISOString(), datos: datosGuardados };
}
/** Valida y aplica un archivo exportado. Devuelve un mensaje de error o null si salió bien. */
export function importar(obj) {
  if (!obj || obj.app !== "taller-ia" || typeof obj.datos !== "object") return "El archivo no es un progreso exportado del Taller - IA.";
  if (obj.version > VERSION) return "El archivo es de una versión más nueva del taller. Actualizá la página e intentá de nuevo.";
  Object.entries(obj.datos).forEach(([k, v]) => store.set(k, v));
  est = normalizar(store.get(CLAVE, null));
  return null;
}
export function borrarTodo() {
  store.borrarTodo();
  est = inicial();
}
