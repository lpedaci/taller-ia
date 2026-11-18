/* Taller - IA | Piezas compartidas entre vistas: tarjeta de módulo, competencias y registro de actividad */
import { esc, cap, sumarDias, hoy, mismoDia, fechaLarga, MESES, MESES_C, plural } from "../util.js";
import { datos, avance, competencias, objetivosTotales, actividad, enRuta } from "../state.js";
import { icono, lineal } from "../ui.js";
import { href } from "../routes.js";

/* Miniaturas abstractas por bloque, con los tokens de color (cambian con el tema) */
const MINIATURAS = [
  '<circle cx="70" cy="70" r="46" fill="var(--md-sys-color-primary-container)"/><circle cx="70" cy="70" r="22" fill="var(--md-sys-color-primary)" opacity=".55"/>',
  '<rect x="28" y="28" width="40" height="40" rx="12" fill="var(--md-sys-color-primary-container)"/><rect x="72" y="28" width="40" height="40" rx="20" fill="var(--md-sys-color-primary)" opacity=".5"/><rect x="28" y="72" width="40" height="40" rx="20" fill="var(--md-sys-color-secondary-container)"/><rect x="72" y="72" width="40" height="40" rx="12" fill="var(--md-sys-color-secondary)" opacity=".35"/>',
  '<path d="M20 112 L70 22 L120 112 Z" fill="var(--md-sys-color-secondary-container)"/><circle cx="70" cy="82" r="16" fill="var(--md-sys-color-secondary)" opacity=".55"/>',
  '<rect x="14" y="40" width="100" height="60" rx="30" fill="var(--md-sys-color-secondary-container)"/><circle cx="46" cy="70" r="11" fill="var(--md-sys-color-secondary)"/><circle cx="82" cy="70" r="11" fill="var(--md-sys-color-secondary)" opacity=".5"/>',
  '<circle cx="50" cy="60" r="34" fill="var(--md-sys-color-secondary-container)"/><circle cx="86" cy="82" r="34" fill="var(--md-sys-color-primary-container)"/>',
  '<path d="M16 92 C40 30, 80 122, 122 50" stroke="var(--md-sys-color-primary)" stroke-width="10" fill="none" stroke-linecap="round" opacity=".55"/><circle cx="16" cy="92" r="11" fill="var(--md-sys-color-primary)"/><circle cx="122" cy="50" r="11" fill="var(--md-sys-color-primary)"/>',
  '<rect x="26" y="26" width="88" height="88" rx="30" fill="var(--md-sys-color-secondary-container)"/><rect x="52" y="52" width="36" height="36" rx="10" fill="var(--md-sys-color-secondary)" opacity=".45"/>'
];

const ESTADO_MOD = {
  "completado": { t: "Completado", ic: "check_circle" },
  "en-curso": { t: "En curso", ic: "progress_activity" },
  "sin-empezar": { t: "Sin empezar", ic: "radio_button_unchecked" }
};

/** Tarjeta de módulo: toda la tarjeta es el enlace. Se lee como "Módulo 6, título, estado". */
export function tarjetaModulo(m, { marcarRuta = false } = {}) {
  const a = avance(m), st = ESTADO_MOD[a.estado], fuera = marcarRuta && !enRuta(m);
  return `<a class="mod${a.estado === "completado" ? " done" : ""}${fuera ? " off-route" : ""}" href="${href("modulo", m.id)}">` +
    `<div class="thumb"><span class="chip chip-neutral">Bloque ${m.bloque} | Módulo ${m.id}</span>` +
    (marcarRuta && !fuera ? `<span class="chip chip-primary">${icono("alt_route")}En tu ruta</span>` : "") +
    `<svg viewBox="0 0 140 140" aria-hidden="true">${MINIATURAS[m.bloque - 1]}</svg></div>` +
    `<div class="body"><h3>${esc(m.titulo)}</h3><p>${esc(m.descripcion)}</p>` +
    `<div class="meta"><span>${a.hechos} de ${a.pasos} pasos</span><span class="st">${icono(st.ic, a.estado === "completado" ? "fill" : "")}${st.t}</span></div>` +
    lineal(a.pct, "Avance del módulo " + m.id) + `</div></a>`;
}

/* ---------- Dominio de competencias ---------- */
export function competenciasHTML(completo) {
  const N = datos.niveles, cs = competencias(), o = objetivosTotales();
  const lista = completo ? cs : cs.filter((c, i) => c.nivel > 0 || i < 5);
  const sug = datos.demo.sugerencia;
  return `<div class="comp-sum"><b>${o.logrados} de ${o.total}</b><span>objetivos de aprendizaje demostrados con evidencias</span></div>` +
    lineal(o.logrados / o.total * 100, "Objetivos de aprendizaje demostrados") +
    `<div class="scale" aria-hidden="true">${N.map((n, i) => `<span><i class="s${i}"></i>${n}</span>`).join("")}</div>` +
    `<ul class="comp-list">${lista.map(c => `<li><span class="name">${esc(c.titulo)}</span><span class="lvl lvl-${c.nivel}">${N[c.nivel]}</span>` +
      `<span class="steps" role="img" aria-label="${esc(c.titulo)}: nivel ${N[c.nivel]}, ${c.objetivos[0]} de ${c.objetivos[1]} objetivos, ${plural(c.evidencias, "evidencia", "evidencias")}">` +
      [1, 2, 3].map(i => `<i class="${c.nivel >= i ? "on" + i : ""}"></i>`).join("") + `</span></li>`).join("")}</ul>` +
    (sug ? `<div class="next-step">${icono("tips_and_updates")}<span><b>Próximo paso sugerido:</b> ${esc(sug.texto)} <a href="${href("modulo", sug.modulo)}">Ir al Módulo ${sug.modulo}</a></span></div>` : "");
}

/* ---------- Registro de actividad (cuadrícula estilo GitHub) ---------- */
const nivelAct = c => c === 0 ? 0 : c <= 1 ? 1 : c <= 2 ? 2 : c <= 4 ? 3 : 4;
/** Actividades disponibles en un mes (dato de ejemplo para la tabla "N de M") */
function disponiblesMes(clave, hechas) {
  const h = [...clave].reduce((a, c) => a + c.charCodeAt(0), 0), act = clave === MESES[hoy().getMonth()] + " " + hoy().getFullYear();
  return Math.max(hechas, Math.ceil(hechas / (act ? .62 : .72 + ((Math.sin(h) + 1) / 2) * .25)) + (hechas < 5 ? 2 : 0));
}

export function registroHTML(id, conTabla) {
  return `<div class="heat-wrap" id="${id}"></div><div class="heat-foot"><span id="${id}Sum"></span>` +
    `<span class="heat-scale" aria-hidden="true">Menos${[0, 1, 2, 3, 4].map(l => `<span class="c l${l}"></span>`).join("")}Más</span></div>` +
    `<p class="note">${icono("info")}<span>Cada cuadro es un día y el color indica cuántas actividades, lecturas o evaluaciones completaste. No mide tiempo de conexión ni rachas.</span></p>` +
    (conTabla ? `<details class="alt"><summary>${icono("table", "sm")}Ver como tabla por mes</summary><div class="tbl-wrap" id="${id}Tbl"></div></details>` : "");
}

/** Dibuja la cuadrícula según el ancho disponible (la cantidad de semanas se adapta) */
export function dibujarRegistro(id) {
  const wrap = document.getElementById(id); if (!wrap || !wrap.clientWidth) return;
  const ACT = actividad(), h = hoy();
  const celda = innerWidth < 600 ? 11 : 13;
  const semanas = Math.max(8, Math.min(53, Math.floor((wrap.clientWidth - 40) / (celda + 3))));
  const inicio = sumarDias(h, -h.getDay() - (semanas - 1) * 7);
  let celdas = "", meses = "", total = 0; const porMes = {};
  for (let w = 0; w < semanas; w++) {
    const wd = sumarDias(inicio, w * 7);
    meses += `<span style="white-space:nowrap">${wd.getDate() <= 7 ? MESES_C[wd.getMonth()] : ""}</span>`;
    for (let d = 0; d < 7; d++) {
      const dia = sumarDias(inicio, w * 7 + d);
      if (dia > h) { celdas += '<span class="c empty"></span>'; continue; }
      const c = ACT[dia.toDateString()] || 0; total += c;
      const k = MESES[dia.getMonth()] + " " + dia.getFullYear(); porMes[k] = (porMes[k] || 0) + c;
      celdas += `<span class="c l${nivelAct(c)}${mismoDia(dia, h) ? " today" : ""}" title="${cap(fechaLarga(dia))}: ${plural(c, "actividad", "actividades")}"></span>`;
    }
  }
  wrap.innerHTML = `<div class="heat-grid"><div class="heat-days" aria-hidden="true" style="--cell:${celda}px"><span></span><span>Lun</span><span></span><span>Mié</span><span></span><span>Vie</span><span></span></div>` +
    `<div><div class="heat-months" aria-hidden="true" style="grid-auto-columns:${celda}px">${meses}</div>` +
    `<div class="heat" role="img" aria-label="Registro de actividad: ${total} actividades completadas en las últimas ${semanas} semanas." style="--cell:${celda}px">${celdas}</div></div></div>`;
  const mejor = Object.entries(porMes).sort((a, b) => b[1] - a[1])[0];
  document.getElementById(id + "Sum").innerHTML = `<b>${total}</b> actividades completadas en ${semanas} semanas` + (mejor ? ` | Mes con más actividad: ${mejor[0]}` : "");
  const tb = document.getElementById(id + "Tbl");
  if (tb) tb.innerHTML = `<table class="tbl"><caption class="sr-only">Actividades completadas por mes</caption><thead><tr><th scope="col">Mes</th><th scope="col">Actividades completadas</th><th scope="col">Avance</th></tr></thead><tbody>` +
    Object.entries(porMes).map(([k, v]) => { const y = disponiblesMes(k, v), pc = Math.round(v / y * 100); return `<tr><th scope="row">${cap(k)}</th><td>${v} de ${y}</td><td><span class="tbl-prog"><span class="bar" aria-hidden="true"><i style="width:${pc}%"></i></span>${pc}%</span></td></tr>`; }).join("") +
    `</tbody></table>`;
}
