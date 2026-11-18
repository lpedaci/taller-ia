/* Taller - IA | Estados de carga, espera, error y sin conexión
   Parámetro de desarrollo ?simular=lento | error | error-leccion | sin-conexion para revisar cada estado.
   Reglas (sección 4 del brief):
   - nunca una pantalla en blanco ni un ícono girando sin contexto;
   - el mensaje dice qué se está haciendo; a los 3 s se actualiza; a los 10 s ofrece una salida;
   - progreso con aria-live polite; errores con aria-live assertive;
   - nunca se agrega una espera artificial (salvo con ?simular=lento, solo para revisar). */
import { icono, aviso } from "./ui.js";

export const SIMULAR = new URLSearchParams(location.search).get("simular") || "";
export const sinConexion = () => SIMULAR === "sin-conexion" || !navigator.onLine;
/** Demora solo con ?simular=lento */
export const demoraSimulada = (ms = 4000) => SIMULAR === "lento" ? new Promise(r => setTimeout(r, ms)) : Promise.resolve();
/** ?simular=error falla la carga inicial; ?simular=error-leccion falla solo la carga de las lecciones */
export const errorSimulado = (que, clave = "error") => { if (SIMULAR === clave) throw new Error("Error simulado al cargar " + que + " (?simular=" + clave + ")"); };

/** Mensaje de espera que se actualiza a los 3 s y ofrece una salida a los 10 s. Devuelve una función para cancelarlo. */
export function esperaConMensaje(el, { texto, despues = "Ya casi está.", salida = null }) {
  el.innerHTML = `<div class="espera" role="status"><div class="lin-ind" aria-hidden="true"></div><p class="espera-t">${texto}</p><div class="espera-salida"></div></div>`;
  const t = el.querySelector(".espera-t"), s = el.querySelector(".espera-salida");
  const t3 = setTimeout(() => { t.textContent = despues; }, 3000);
  const t10 = setTimeout(() => { if (salida) s.innerHTML = `<p>Está tardando más de lo normal.</p>${salida}`; }, 10000);
  return () => { clearTimeout(t3); clearTimeout(t10); };
}

/* ---------- Pantalla de inicio breve: solo si la carga tarda más de 300 ms ---------- */
let tSplash, t3s, t10s;
export function splashSiTarda() {
  const sp = document.getElementById("splash"); if (!sp) return;
  tSplash = setTimeout(() => { sp.hidden = false; }, 300);
  t3s = setTimeout(() => { sp.querySelector(".splash-msg").textContent = "Ya casi está, preparando las actividades."; }, 3000);
  t10s = setTimeout(() => { sp.querySelector(".splash-salida").hidden = false; }, 10000);
}
export function cerrarSplash() {
  clearTimeout(tSplash); clearTimeout(t3s); clearTimeout(t10s);
  const sp = document.getElementById("splash"); if (sp) sp.hidden = true;
}

/** Tarjeta de error en lenguaje simple: qué pasó, qué hacer y que el progreso no se pierde */
export function tarjetaError({ titulo = "No se pudo cargar esta parte", texto = "Revisá tu conexión e intentá de nuevo. Tu progreso guardado no se pierde.", acciones = "" } = {}) {
  return `<div class="card estado-error" role="alert"><div class="status status-error">${icono("error", "fill")}<div><b>${titulo}</b><p>${texto}</p></div></div>` +
    `<div class="act-actions">${acciones || `<button class="btn btn-filled" type="button" data-reintentar>${icono("refresh")}Reintentar</button>`}</div></div>`;
}

/** Proceso con duración conocida: indicador determinado con porcentaje y paso actual */
export function procesoDeterminado(titulo, pasos) {
  const dlg = document.getElementById("dlgProceso");
  dlg.querySelector("h2").textContent = titulo;
  const barra = dlg.querySelector(".lin"), msg = dlg.querySelector(".proc-msg");
  dlg.showModal();
  return {
    paso(i) {
      const pct = Math.round(i / pasos.length * 100);
      barra.setAttribute("aria-valuenow", pct); barra.setAttribute("aria-valuetext", `${pct}%, paso ${i} de ${pasos.length}`);
      barra.innerHTML = (pct > 0 ? `<span class="a" style="width:${pct}%"></span>` : "") + (pct < 100 ? `<span class="t"></span>` : "");
      msg.textContent = `Paso ${Math.min(i + 1, pasos.length)} de ${pasos.length}: ${pasos[Math.min(i, pasos.length - 1)]}`;
    },
    cerrar() { dlg.close(); }
  };
}

/** Avisos de conexión: el entorno sigue funcionando sin conexión, salvo videos y enlaces externos */
export function vigilarConexion() {
  addEventListener("offline", () => aviso("Estás sin conexión. Podés seguir: tu progreso se guarda en este navegador."));
  addEventListener("online", () => aviso("Volvió la conexión."));
}
