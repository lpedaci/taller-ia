/* Taller - IA | Utilidades: fechas en español, texto seguro y normalización */

export const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const DIAS_C = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const MESES_C = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export const ahora = () => new Date();
export const hoy = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
export const sumarDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const mismoDia = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const pad2 = n => String(n).padStart(2, "0");
export const hhmm = d => pad2(d.getHours()) + ":" + pad2(d.getMinutes());
export const fechaLarga = d => DIAS[d.getDay()] + " " + d.getDate() + " de " + MESES[d.getMonth()];
export const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
export const diasDesdeHoy = d => Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - hoy()) / 864e5);
/** Lunes de la semana de d */
export const inicioSemana = d => sumarDias(d, -((d.getDay() + 6) % 7));
/** "2026-11-18" en hora local */
export const isoDia = d => d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
export const desdeIsoDia = s => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};
/** Fecha relativa a hoy con hora "HH:MM" */
export const enDia = (offset, hora = "00:00") => {
  const [h, m] = hora.split(":").map(Number);
  const d = sumarDias(hoy(), offset);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
};

const MAPA_ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
/** Escapa texto para insertarlo en HTML */
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => MAPA_ESC[c]);
/** Minúsculas sin tildes, para buscar */
export const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
export const plural = (n, uno, varios) => n + " " + (n === 1 ? uno : varios);
/** Número pseudoaleatorio estable a partir de una semilla (datos de ejemplo) */
export const semilla = i => { const x = Math.sin(i * 9301 + 49297) * 233280; return x - Math.floor(x); };
export const qs = (sel, raiz = document) => raiz.querySelector(sel);
export const qsa = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
