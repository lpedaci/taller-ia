/* Taller - IA | Agenda completa: vistas Día, Semana y Mes, navegación y filtros por tipo */
import { esc, cap, hoy, mismoDia, sumarDias, inicioSemana, hhmm, fechaLarga, DIAS_C, MESES, MESES_C, isoDia, desdeIsoDia, plural, qs } from "../util.js";
import { eventos, terminado, TIPOS, GRUPOS_EVENTO, tieneCohorte, agregarEvento, eliminarEvento } from "../state.js";
import { icono, chipTipo, vacio, abrirDialogo, confirmar, aviso } from "../ui.js";
import { href } from "../routes.js";

let vista = "semana", ref = hoy();
const filtro = new Set(GRUPOS_EVENTO.map(g => g.k));
const delDia = d => eventos().filter(e => mismoDia(e.inicio, d) && filtro.has(TIPOS[e.tipo].k));
const finTag = e => terminado(e) ? `<span class="fin">${icono("check")}Finalizado</span>` : "";

/** Lee #/agenda/{dia|semana|mes}/{aaaa-mm-dd} */
export function preparar(args) {
  vista = ["dia", "semana", "mes"].includes(args[0]) ? args[0] : "semana";
  ref = desdeIsoDia(args[1]) || (args[0] === "dia" ? hoy() : ref || hoy());
}

function etiqueta() {
  if (vista === "dia") return cap(fechaLarga(ref));
  if (vista === "semana") { const s = inicioSemana(ref), e = sumarDias(s, 6); return `${s.getDate()} ${MESES_C[s.getMonth()]} al ${e.getDate()} ${MESES_C[e.getMonth()]} ${e.getFullYear()}`; }
  return cap(MESES[ref.getMonth()]) + " " + ref.getFullYear();
}

function cuerpo() {
  if (vista === "dia") {
    const evs = delDia(ref);
    if (!evs.length) return `<div class="card">${vacio("Sin eventos este día", "Probá con otra fecha o revisá los filtros.")}</div>`;
    return `<div class="card"><div class="card-body" style="padding-top:16px"><ol class="timeline">` + evs.map(e => {
      const T = TIPOS[e.tipo];
      return `<li><time datetime="${e.inicio.toISOString()}">${hhmm(e.inicio)}</time><div class="evt k-${T.k}${terminado(e) ? " past" : ""}"><h3>${esc(e.titulo)}</h3>` +
        `<div class="meta">${chipTipo(e.tipo)}<span>${e.fin ? hhmm(e.inicio) + " a " + hhmm(e.fin) : "a las " + hhmm(e.inicio)}</span>${finTag(e)}${e.propio ? '<span class="own">Propio</span>' : ""}</div>` +
        (e.propio ? `<button class="icon-btn evt-del" type="button" data-del-evento="${esc(e.id)}" aria-label="Eliminar el evento: ${esc(e.titulo)}" data-tip="Eliminar">${icono("delete")}</button>` : "") + `</div></li>`;
    }).join("") + `</ol></div></div>`;
  }
  if (vista === "semana") {
    const s = inicioSemana(ref);
    return `<div class="week">` + [0, 1, 2, 3, 4, 5, 6].map(i => {
      const d = sumarDias(s, i), evs = delDia(d);
      return `<section class="day${mismoDia(d, hoy()) ? " is-today" : ""}" aria-label="${cap(fechaLarga(d))}${mismoDia(d, hoy()) ? ", hoy" : ""}"><div class="dh" aria-hidden="true"><span>${DIAS_C[d.getDay()]}</span><b>${d.getDate()}</b></div>` +
        (evs.length ? evs.map(e => `<div class="mini ev-${TIPOS[e.tipo].k}${terminado(e) ? " past" : ""}"><time datetime="${e.inicio.toISOString()}">${hhmm(e.inicio)}</time>${esc(e.titulo)}<span class="sr-only">, ${TIPOS[e.tipo].lbl}</span>${finTag(e)}</div>`).join("")
          : `<span class="none">Sin eventos</span>`) + `</section>`;
    }).join("") + `</div>`;
  }
  const primero = new Date(ref.getFullYear(), ref.getMonth(), 1), desde = inicioSemana(primero);
  let h = `<div class="month">` + ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => `<div class="wd" aria-hidden="true">${d}</div>`).join("");
  for (let i = 0; i < 42; i++) {
    const d = sumarDias(desde, i), evs = delDia(d);
    if (i === 35 && d.getMonth() !== ref.getMonth()) break;
    const fuera = d.getMonth() !== ref.getMonth(), esHoy = mismoDia(d, hoy());
    const lbl = `${esHoy ? "Hoy, " : ""}${cap(fechaLarga(d))}, ${plural(evs.length, "evento", "eventos")}`;
    // El nombre del enlace sale de su contenido: fecha para lectores de pantalla y eventos visibles
    const interior = `<span class="sr-only">${lbl}: </span><span class="num" aria-hidden="true">${d.getDate()}</span>` +
      evs.slice(0, 2).map(e => `<span class="mini ev-${TIPOS[e.tipo].k}${terminado(e) ? " past" : ""}">${terminado(e) ? icono("check") : ""}${hhmm(e.inicio)} ${esc(e.titulo)}${terminado(e) ? '<span class="sr-only">, finalizado</span>' : ""}<span class="sr-only">. </span></span>`).join("") +
      (evs.length > 2 ? `<span class="more" aria-hidden="true">y ${evs.length - 2} más</span>` : "") +
      `<span class="dots" aria-hidden="true">${evs.map(e => `<i class="dot-k k-${TIPOS[e.tipo].k}"></i>`).join("")}</span>`;
    // Los días con eventos llevan al detalle del día (en mobile es la forma de ver el detalle)
    h += evs.length
      ? `<a class="cell${fuera ? " out" : ""}${esHoy ? " is-today" : ""}" href="${href("agenda", "dia", isoDia(d))}" data-excepcion-tactil="Grilla del mes: 7 columnas en 360 px dejan celdas de 47 px; cumplen el mínimo de 24 px de WCAG 2.2">${interior}</a>`
      : `<div class="cell${fuera ? " out" : ""}${esHoy ? " is-today" : ""}" aria-hidden="true">${interior}</div>`;
  }
  return h + `</div>`;
}

export const botonEvento = (clase = "btn-tonal") => `<button class="btn ${clase}" type="button" data-nuevo-evento aria-haspopup="dialog">${icono("add")}Agregar evento</button>`;

export function render() {
  // Modo autoasistido sin eventos: estado vacío con la primera acción
  if (!tieneCohorte() && !eventos().length) {
    return `<div class="view-head"><div class="vh-txt"><h2>Agenda</h2><p>Fechas, entregas y encuentros.</p></div></div>` +
      `<div class="card">${vacio("Tu agenda está vacía", "Estás cursando en modo autoasistido, sin fechas de una cohorte. Podés agregar tus propios eventos: un encuentro, una entrega o un recordatorio para avanzar con un módulo.", botonEvento("btn-filled"))}</div>`;
  }
  return `<div class="view-head"><div class="vh-txt"><h2>Agenda</h2><p>Los eventos que ya pasaron se ven atenuados y marcados como finalizados.</p></div>` + botonEvento() +
    `<div class="connected" role="group" aria-label="Vista de agenda">${[["dia", "Día"], ["semana", "Semana"], ["mes", "Mes"]].map(v => `<button type="button" data-vista="${v[0]}" aria-pressed="${vista === v[0]}">${v[1]}</button>`).join("")}</div></div>` +
    `<div class="view-head" style="margin-top:0"><div class="cal-nav">` +
      `<button class="icon-btn" type="button" data-cal="-1" aria-label="${vista === "dia" ? "Día anterior" : vista === "semana" ? "Semana anterior" : "Mes anterior"}" data-tip="Anterior">${icono("chevron_left")}</button>` +
      `<span class="lbl" aria-live="polite" id="calLbl">${etiqueta()}</span>` +
      `<button class="icon-btn" type="button" data-cal="1" aria-label="${vista === "dia" ? "Día siguiente" : vista === "semana" ? "Semana siguiente" : "Mes siguiente"}" data-tip="Siguiente">${icono("chevron_right")}</button>` +
      `<button class="btn btn-outlined" type="button" data-cal="0">Hoy</button></div>` +
    `<div class="filter-chips" role="group" aria-label="Filtrar por tipo de evento">${GRUPOS_EVENTO.map(g => `<button type="button" class="filter-chip" data-filtro="${g.k}" aria-pressed="${filtro.has(g.k)}">${icono("check", "chk")}${g.lbl}</button>`).join("")}</div></div>` +
    `<div id="calBody">${cuerpo()}</div>`;
}

/** Interacciones de la Agenda */
export function iniciar(rerender) {
  // Diálogo "Nuevo evento"
  const dlg = qs("#dlgEvento"), form = qs("#formEvento"), tit = qs("#evTitulo"), err = qs("#evErr");
  const limpiar = () => { tit.removeAttribute("aria-invalid"); tit.removeAttribute("aria-describedby"); err.hidden = true; };
  document.addEventListener("click", async e => {
    if (e.target.closest("[data-nuevo-evento]")) {
      form.reset(); limpiar();
      qs("#evFecha").value = isoDia(ref || hoy()); qs("#evInicio").value = "18:00";
      abrirDialogo(dlg, tit); return;
    }
    const del = e.target.closest("[data-del-evento]");
    if (del) {
      const ev = eventos().find(x => x.id === del.dataset.delEvento); if (!ev) return;
      if (await confirmar({ icono: "delete", titulo: "¿Eliminar este evento?", texto: `<b>${esc(ev.titulo)}</b><br>Se quita de tu agenda. No se puede deshacer.`, ok: "Eliminar", peligro: true })) {
        eliminarEvento(ev.id); rerender(); qs("[data-nuevo-evento]")?.focus(); aviso("Evento eliminado");
      }
    }
  });
  dlg.addEventListener("click", e => { if (e.target.closest('[data-evento="cancelar"]')) dlg.close(); });
  tit.addEventListener("input", () => { if (tit.value.trim()) limpiar(); });
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!tit.value.trim()) { tit.setAttribute("aria-invalid", "true"); tit.setAttribute("aria-describedby", "evErr"); err.hidden = false; tit.focus(); return; }
    const f = qs("#evFecha").value || isoDia(hoy());
    const [y, mo, d] = f.split("-").map(Number);
    const hora = s => { const [h, m] = (s || "00:00").split(":").map(Number); return new Date(y, mo - 1, d, h, m).getTime(); };
    const fin = qs("#evFin").value;
    agregarEvento({ titulo: tit.value.trim(), tipo: qs("#evTipo").value, inicio: hora(qs("#evInicio").value || "09:00"), fin: fin ? hora(fin) : null });
    ref = new Date(y, mo - 1, d);
    dlg.dataset.sinRetorno = "1"; dlg.close();
    if (location.hash.startsWith("#/agenda")) { history.replaceState(null, "", href("agenda", "dia", f)); vista = "dia"; }
    rerender();
    qs("[data-nuevo-evento]")?.focus();
    aviso("Evento agregado a tu agenda");
  });
  document.addEventListener("click", e => {
    if (!qs("#calBody")) return;
    const v = e.target.closest("[data-vista]");
    if (v) { location.hash = href("agenda", v.dataset.vista, isoDia(ref)); return; }
    const c = e.target.closest("[data-cal]");
    if (c) {
      const n = +c.dataset.cal;
      const nueva = n === 0 ? hoy() : vista === "dia" ? sumarDias(ref, n) : vista === "semana" ? sumarDias(ref, 7 * n) : new Date(ref.getFullYear(), ref.getMonth() + n, 1);
      history.replaceState(null, "", href("agenda", vista, isoDia(nueva)));
      ref = nueva;
      qs("#calLbl").textContent = etiqueta();
      qs("#calBody").innerHTML = cuerpo();
      return;
    }
    const f = e.target.closest("[data-filtro]");
    if (f) {
      const k = f.dataset.filtro; filtro.has(k) ? filtro.delete(k) : filtro.add(k);
      f.setAttribute("aria-pressed", String(filtro.has(k)));
      qs("#calBody").innerHTML = cuerpo();
    }
  });
}
