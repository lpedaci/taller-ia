/* Taller - IA | Estado de la persona y contenido del taller
   - El contenido (módulos, bloques, rutas) viene de /content/*.json.
   - Etapa 1: el panel usa datos de ejemplo (content/demo.json). Lo que la
     persona cambia (tareas, ruta, último paso) se guarda en el navegador.
   - Nada sale del navegador: no hay backend ni analítica. */
import { store } from "./storage.js";
import { enDia, semilla, sumarDias, hoy } from "./util.js";

const VERSION = 1;
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

async function leerJSON(ruta) {
  const r = await fetch(ruta, { cache: "no-cache" });
  if (!r.ok) throw new Error("No se pudo leer " + ruta + " (" + r.status + ")");
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
  est = normalizar(store.get("estado", null));
  return est;
}

function inicial() {
  const d = datos.demo;
  return {
    version: VERSION,
    perfil: { ...d.perfil },
    ruta: d.perfil.ruta,
    ultimo: { ...d.ultimo },
    progreso: { ...d.progreso },
    tareas: { hechas: {}, propias: [], ocultas: [] }
  };
}
function normalizar(s) {
  const base = inicial();
  if (!s || typeof s !== "object" || s.version !== VERSION) return base;
  return {
    ...base, ...s,
    perfil: { ...base.perfil, ...(s.perfil || {}) },
    tareas: { ...base.tareas, ...(s.tareas || {}) }
  };
}

export const estado = () => est;
export function guardar() { store.set("estado", est); }

/* ---------- Módulos y progreso ---------- */
export const modulo = id => datos.modulos.find(m => m.id === +id) || null;
export const bloque = n => datos.bloques.find(b => b.n === +n) || null;
export function avance(m) {
  const hechos = Math.min(m.pasos, +(est.progreso[m.id] || 0));
  const pct = Math.round(hechos / m.pasos * 100);
  return { hechos, pasos: m.pasos, pct, estado: pct >= 100 ? "completado" : hechos > 0 ? "en-curso" : "sin-empezar" };
}
export const completados = () => datos.modulos.filter(m => avance(m).estado === "completado");
export const moduloActual = () => modulo(est.ultimo?.modulo ?? 0) || datos.modulos[0];

/* ---------- Rutas sugeridas ---------- */
export const rutaActual = () => datos.rutas.find(r => r.id === est.ruta) || datos.rutas[0];
export function enRuta(m, ruta = rutaActual()) {
  return ruta.bloques.includes(m.bloque) || ruta.modulos.includes(m.id);
}
export function setRuta(id) {
  if (!datos.rutas.some(r => r.id === id)) return;
  est.ruta = id; est.perfil.ruta = id; guardar();
}
export function registrarVisita(id, paso = 1) {
  if (!modulo(id)) return;
  est.ultimo = { modulo: +id, paso }; guardar();
}

/* ---------- Competencias (etapa 1: datos de ejemplo) ---------- */
export function competencias() {
  return datos.competencias.map(c => {
    const v = datos.demo.competencias[c.id] || { nivel: 0, evidencias: 0, objetivos: [0, 0] };
    return { ...c, ...v };
  });
}
export function objetivosTotales() {
  const cs = competencias();
  return { logrados: cs.reduce((a, c) => a + c.objetivos[0], 0), total: cs.reduce((a, c) => a + c.objetivos[1], 0) };
}

/* ---------- Agenda ---------- */
let cacheEventos = null;
export function eventos() {
  if (cacheEventos) return cacheEventos;
  const lista = datos.demo.eventos.map(e => ({
    titulo: e.titulo, tipo: e.tipo, modulo: e.modulo ?? null,
    inicio: enDia(e.dia, e.inicio), fin: e.fin ? enDia(e.dia, e.fin) : null
  }));
  cacheEventos = lista.sort((a, b) => a.inicio - b.inicio);
  return cacheEventos;
}
export const terminado = e => (e.fin || e.inicio) < new Date();

/* ---------- Pendientes ---------- */
export function tareas() {
  const t = est.tareas;
  const demo = datos.demo.pendientes
    .filter(p => !t.ocultas.includes(p.id))
    .map(p => ({ id: p.id, titulo: p.titulo, vence: enDia(p.dia, p.hora).getTime(), tipo: p.tipo, propia: !!p.propia, hecha: p.id in t.hechas ? t.hechas[p.id] : !!p.hecha }));
  const propias = t.propias.map(p => ({ ...p, propia: true, tipo: null }));
  return demo.concat(propias).sort((a, b) => (a.hecha - b.hecha) || (a.vence - b.vence));
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
  else if (datos.demo.pendientes.some(p => p.id === id && p.propia)) est.tareas.ocultas.push(id);
  guardar();
}

/* ---------- Registro de actividad (datos de ejemplo generados con semilla fija) ---------- */
let cacheAct = null;
export function actividad() {
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
  store.claves().forEach(k => { datosGuardados[k] = store.get(k); });
  if (!("estado" in datosGuardados)) datosGuardados.estado = est;
  return { app: "taller-ia", version: VERSION, exportado: new Date().toISOString(), datos: datosGuardados };
}
/** Valida y aplica un archivo exportado. Devuelve un mensaje de error o null si salió bien. */
export function importar(obj) {
  if (!obj || obj.app !== "taller-ia" || typeof obj.datos !== "object") return "El archivo no es un progreso exportado del Taller - IA.";
  if (obj.version > VERSION) return "El archivo es de una versión más nueva del taller. Actualizá la página e intentá de nuevo.";
  Object.entries(obj.datos).forEach(([k, v]) => store.set(k, v));
  est = normalizar(store.get("estado", null));
  return null;
}
export function borrarTodo() {
  store.borrarTodo();
  est = inicial();
}
