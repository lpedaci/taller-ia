/* Taller - IA | Inicio: saludo, resumen, agenda, continuar, competencias, pendientes, registro y módulos */
import { esc, cap, hoy, ahora, mismoDia, sumarDias, diasDesdeHoy, hhmm, fechaLarga, DIAS, MESES, isoDia, plural, pad2, qs } from "../util.js";
import { tieneCohorte, datos, perfil, evidenciasTotal, hayProgreso, pasosVistos, avance, completados, objetivosTotales, eventos, terminado, tareas, tareasAbiertas, marcarTarea, agregarTarea, eliminarTarea, TIPOS, GRUPOS_EVENTO } from "../state.js";
import { icono, cabecera, anillo, chipTipo, vacio, aviso, abrirDialogo, confirmar } from "../ui.js";
import { tarjetaModulo, competenciasHTML, registroHTML, dibujarRegistro } from "./piezas.js";
import { href } from "../routes.js";

const restantesHoy = () => eventos().filter(e => mismoDia(e.inicio, hoy()) && e.inicio >= ahora()).length;

function tarjetaResumen(ic, num, lbl, destino, enlace, tiempo) {
  return `<div class="card stat${tiempo ? " tone-time" : ""}"><div class="top"><span class="ic">${icono(ic)}</span><div><div class="num">${num}</div><div class="lbl">${lbl}</div></div></div>` +
    `<div class="actions"><a class="btn btn-text trailing" href="${destino}">${enlace}${icono("arrow_forward")}</a></div></div>`;
}

/* ---------- Agenda: hoy ---------- */
export function agendaHoyHTML() {
  const n = ahora(), evs = eventos().filter(e => mismoDia(e.inicio, hoy()));
  if (!evs.length) return vacio("No tenés eventos hoy", tieneCohorte() ? "Cuando haya entregas, evaluaciones o encuentros, los vas a ver acá." : "En modo autoasistido podés agregar tus propios eventos y recordatorios.", tieneCohorte() ? "" : `<button class="btn btn-tonal" type="button" data-nuevo-evento aria-haspopup="dialog">${icono("add")}Agregar evento</button>`);
  let h = '<ol class="timeline">', marcada = false;
  const lineaAhora = () => `<li class="now-li"><div class="now-line">Ahora, ${hhmm(n)}</div></li>`;
  evs.forEach(e => {
    const fin = e.fin || e.inicio, T = TIPOS[e.tipo];
    if (!marcada && e.inicio > n) { h += lineaAhora(); marcada = true; }
    const st = fin < n ? "past" : (e.inicio <= n && fin >= n ? "now" : "");
    const cuando = e.fin ? hhmm(e.inicio) + " a " + hhmm(e.fin) : (T.k === "entrega" ? "Cierra a las " : "Desde las ") + hhmm(e.inicio);
    h += `<li><time datetime="${e.inicio.toISOString()}">${hhmm(e.inicio)}</time><div class="evt k-${T.k} ${st}"><h4>${esc(e.titulo)}</h4>` +
      `<div class="meta">${chipTipo(e.tipo)}<span>${cuando}</span>` +
      (st === "past" ? `<span class="fin">${icono("check")}Finalizado</span>` : st === "now" ? `<span class="en-curso">En curso</span>` : "") + `</div></div></li>`;
  });
  if (!marcada) h += lineaAhora();
  return h + "</ol>";
}

/* ---------- Agenda: próximos días, agrupados por día ---------- */
export function proximosHTML(dias, limite) {
  const evs = eventos().filter(e => e.inicio >= sumarDias(hoy(), 1) && e.inicio < sumarDias(hoy(), dias + 1));
  if (!evs.length) return vacio("Sin eventos próximos", `No hay fechas en los próximos ${dias} días.`);
  limite = limite || evs.length;
  const grupos = [];
  evs.forEach((e, i) => { const g = grupos.find(x => mismoDia(x.d, e.inicio)); g ? g.e.push([e, i]) : grupos.push({ d: e.inicio, e: [[e, i]] }); });
  const extra = evs.length - limite;
  return `<div class="up-days" id="upList">` + grupos.map(g => {
    const dd = diasDesdeHoy(g.d);
    const lbl = (dd === 1 ? "Mañana, " + DIAS[g.d.getDay()] : cap(DIAS[g.d.getDay()])) + " " + g.d.getDate() + " de " + MESES[g.d.getMonth()];
    return `<section class="up-day${dd === 1 ? " tomorrow" : ""}${g.e[0][1] >= limite ? " extra" : ""}" aria-label="${lbl}"><h4 aria-hidden="true">${lbl}</h4><ul class="up-group">` +
      g.e.map(([e, i]) => {
        const T = TIPOS[e.tipo], hora = e.fin ? hhmm(e.inicio) + " a " + hhmm(e.fin) : (T.k === "entrega" || /^Cierra/.test(e.titulo) ? "Cierra a las " : "A las ") + hhmm(e.inicio);
        return `<li${i >= limite ? ' class="extra"' : ""}><a class="up-row k-${T.k}" href="${href("agenda", "dia", isoDia(e.inicio))}"><span class="up-bar" aria-hidden="true"></span>` +
          `<span class="up-txt"><b>${esc(e.titulo)}</b><span class="up-meta">${icono(T.ic)}${T.lbl} | ${hora}</span></span>${icono("chevron_right", "chev")}</a></li>`;
      }).join("") + `</ul></section>`;
  }).join("") + `</div>` +
    (extra > 0 ? `<button class="btn btn-text up-more" type="button" aria-expanded="false" aria-controls="upList" data-more="${extra}"><span class="lbl">Ver ${extra} más</span>${icono("expand_more")}</button>` : "");
}

/* ---------- Agenda: calendario del mes ---------- */
function miniMes() {
  const h = hoy(), y = h.getFullYear(), m = h.getMonth(), primero = new Date(y, m, 1), desde = sumarDias(primero, -((primero.getDay() + 6) % 7));
  const ultimo = new Date(y, m + 1, 0), semanas = Math.ceil((((primero.getDay() + 6) % 7) + ultimo.getDate()) / 7);
  let out = `<div class="mm-head"><b id="hMes">${cap(MESES[m])} ${y}</b><a class="btn btn-text" href="${href("agenda", "mes")}">Ver mes</a></div>` +
    `<div class="mm" role="group" aria-labelledby="hMes">` + ["L", "M", "M", "J", "V", "S", "D"].map(d => `<span class="wd" aria-hidden="true">${d}</span>`).join("");
  for (let i = 0; i < semanas * 7; i++) {
    const d = sumarDias(desde, i);
    if (d.getMonth() !== m) { out += `<span class="mm-d out" aria-hidden="true">${d.getDate()}</span>`; continue; }
    const evs = eventos().filter(e => mismoDia(e.inicio, d)), esHoy = mismoDia(d, h), cls = "mm-d" + (esHoy ? " today" : "") + (d < h ? " past" : "");
    const puntos = evs.length ? `<span class="dots" aria-hidden="true">${evs.slice(0, 3).map(e => `<i class="dot-k k-${TIPOS[e.tipo].k}"></i>`).join("")}</span>` : "";
    if (evs.length || esHoy) out += `<a class="${cls}" href="${href("agenda", "dia", isoDia(d))}" aria-label="${esHoy ? "Hoy, " : ""}${cap(fechaLarga(d))}, ${plural(evs.length, "evento", "eventos")}"${esHoy ? ' aria-current="date"' : ""}>${d.getDate()}${puntos}</a>`;
    else out += `<span class="${cls}" aria-hidden="true">${d.getDate()}</span>`;
  }
  return out + `</div><div class="mm-legend" aria-hidden="true">${GRUPOS_EVENTO.map(g => `<span><i class="dot-k k-${g.k}"></i>${g.lbl}</span>`).join("")}</div>`;
}

const selectorVista = cls => `<div class="connected ${cls}" role="group" aria-label="Vista de agenda"><button type="button" aria-pressed="true">Día</button><button type="button" data-goto="semana" aria-pressed="false">Semana</button><button type="button" data-goto="mes" aria-pressed="false">Mes</button></div>`;

/* ---------- Pendientes ---------- */
function vence(ts) {
  const d = new Date(ts), x = diasDesdeHoy(d), n = ahora();
  const dia = x === 0 ? "Hoy" : x === 1 ? "Mañana" : x === -1 ? "Ayer" : cap(DIAS[d.getDay()]) + " " + d.getDate();
  return { txt: dia + ", " + hhmm(d), urgente: d >= n && (d - n) < 864e5 };
}
function pendientesHTML() {
  const lista = tareas();
  if (!lista.length) return vacio("No tenés tareas pendientes", "Agregá tus propias tareas con fecha y hora para organizar tu cursada.") + botonAgregar();
  return `<ul class="todo-list">` + lista.map(t => {
    const v = vence(t.vence), u = v.urgente && !t.hecha;
    return `<li class="${t.hecha ? "done" : ""}"><input type="checkbox" id="td${t.id}" data-todo="${t.id}" ${t.hecha ? "checked" : ""}>` +
      `<label for="td${t.id}"><span class="tt">${esc(t.titulo)}</span><span class="due${u ? " urgent" : ""}">${icono(u ? "warning" : "schedule", "sm")}${u ? "Vence " + v.txt.charAt(0).toLowerCase() + v.txt.slice(1) : v.txt}${t.tipo ? " " + chipTipo(t.tipo) : ""}${t.propia ? '<span class="own">Propia</span>' : ""}</span></label>` +
      (t.propia ? `<button class="icon-btn td-del" type="button" data-del="${t.id}" aria-label="Eliminar la tarea: ${esc(t.titulo)}" data-tip="Eliminar">${icono("delete")}</button>` : "") + `</li>`;
  }).join("") + `</ul>` + botonAgregar();
}
const botonAgregar = () => `<button class="btn btn-tonal btn-m add-task" type="button" id="addTaskBtn" aria-haspopup="dialog">${icono("add")}Agregar tarea</button>`;
function repintarPendientes(foco) {
  const box = qs("#todoBox"); if (!box) return;
  box.innerHTML = pendientesHTML();
  const c = qs("#todoCount"); if (c) c.textContent = tareasAbiertas() + " por hacer";
  const g = qs("#greetSub"); if (g) g.textContent = resumenDia();
  if (foco) (typeof foco === "string" ? qs(foco) : foco)?.focus();
}
function resumenDia() {
  const r = restantesHoy(), p = tareasAbiertas();
  if (!r && !p) return `${cap(fechaLarga(hoy()))}. No tenés eventos ni tareas pendientes para hoy.`;
  return `${cap(fechaLarga(hoy()))}. Tenés ${plural(r, "evento", "eventos")} más hoy y ${plural(p, "tarea pendiente", "tareas pendientes")}.`;
}

/* ---------- Vista ---------- */
export function render() {
  const p = perfil(), o = objetivosTotales();
  const proxCierre = eventos().find(e => e.inicio >= ahora() && TIPOS[e.tipo].k === "entrega");
  const enCurso = datos.modulos.filter(m => avance(m).estado === "en-curso");
  const recientes = enCurso.concat(completados().slice(-2).reverse()).slice(0, 4);
  const hora = ahora().getHours(), saludo = hora < 12 ? "Buen día" : hora < 20 ? "Buenas tardes" : "Buenas noches";
  const proximos = datos.modulos.filter(m => avance(m).estado !== "completado").slice(0, 2);

  return `<div class="home"><div class="home-main">` +
    `<div class="greet"><div><h2>${p.nombre ? `${saludo}, <span class="u-name">${esc(p.nombre)}</span>` : saludo}</h2><p id="greetSub">${resumenDia()}</p></div></div>` +
    `<section class="stats" aria-label="Resumen">` +
      tarjetaResumen("task_alt", `${completados().length}<small> de ${datos.modulos.length}</small>`, "Módulos completados", href("recorrido"), "Ver recorrido") +
      tarjetaResumen("verified", o.total ? `${o.logrados}<small> de ${o.total}</small>` : "0", "Objetivos demostrados", href("aprendizaje"), "Ver competencias") +
      tarjetaResumen("folder_special", String(evidenciasTotal()), "Evidencias en tu portafolio", href("aprendizaje", "portafolio"), "Ver evidencias") +
      tarjetaResumen("alarm", proxCierre ? `${mismoDia(proxCierre.inicio, hoy()) ? "Hoy" : cap(DIAS[proxCierre.inicio.getDay()])}<small> ${hhmm(proxCierre.inicio)}</small>` : "Sin fechas", "Próximo cierre", href("agenda"), "Ver agenda", true) +
    `</section>` +
    `<div class="dash"><div class="dash-grid"><div class="dash-col">` +
      `<section class="card a-cont" aria-labelledby="hCont">${cabecera("history", "Continuar donde dejaste", "", "hCont")}<div class="card-body">` +
        (recientes.length ? `<ul class="list">` + recientes.map(m => {
          const a = avance(m);
          const ultimo = Math.min(a.pasos, Math.max(1, ...pasosVistos(m.id).map(n => n + 1)));
          return `<li><a class="list-item" href="${a.pct >= 100 ? href("modulo", m.id, "paso", 1) : href("modulo", m.id, "paso", ultimo)}">${anillo(a.pct)}<span class="li-text"><span class="li-head">${esc(m.titulo)}</span>` +
            `<span class="li-sup">Bloque ${m.bloque} | ${a.pct >= 100 ? "Completado, repasar" : "Paso " + (a.hechos + 1) + " de " + a.pasos} (${a.pct}%)</span></span>` +
            `<span class="li-trail">${icono(a.pct >= 100 ? "replay" : "chevron_right")}</span></a></li>`;
        }).join("") + `</ul>` : vacio("Todavía no empezaste ningún módulo", "Empezá por la bienvenida: ahí ves cómo funciona el entorno y hacés tu autodiagnóstico.", `<a class="btn btn-filled" href="${href("modulo", 0)}">${icono("play_arrow")}Empezar el Módulo 0</a>`)) +
      `</div></section>` +
      `<section class="card a-comp" aria-labelledby="hComp">${cabecera("psychology", "Dominio de competencias", `<a class="btn btn-text" href="${href("aprendizaje")}">Ver todo</a>`, "hComp")}<div class="card-body">${competenciasHTML(false)}</div></section>` +
    `</div><div class="dash-col">` +
      `<section class="card a-todo tone-time" aria-labelledby="hTodo">${cabecera("checklist", "Pendientes", `<span class="chip chip-neutral" id="todoCount">${tareasAbiertas()} por hacer</span>`, "hTodo")}<div class="card-body" id="todoBox">${pendientesHTML()}</div></section>` +
      `<section class="card a-mods" aria-labelledby="hMods">${cabecera("school", "Próximos módulos", `<a class="btn btn-text" href="${href("recorrido")}">Ver los ${datos.modulos.length}</a>`, "hMods")}<div class="card-body"><div class="mods">${proximos.map(m => tarjetaModulo(m)).join("")}</div></div></section>` +
    `</div>` +
      `<section class="card a-heat" aria-labelledby="hHeat">${cabecera("grid_view", "Registro de actividad", `<a class="btn btn-text" href="${href("aprendizaje")}">Ver detalle</a>`, "hHeat")}<div class="card-body">${registroHTML("heatDash", false)}</div></section>` +
    `</div></div></div>` +
    `<aside class="agenda-pane tone-time" aria-labelledby="hAg"><div class="pane-head"><span class="ic">${icono("calendar_month")}</span><h2 id="hAg">Agenda</h2>` +
      `<a class="btn btn-text pane-cal-link" href="${href("agenda")}">Calendario</a>${selectorVista("seg-head")}</div><div class="pane-body">` +
      `<section class="pane-sec pane-cal" aria-label="Calendario del mes">${miniMes()}</section>` +
      `<section class="pane-sec pane-hoy" aria-labelledby="hHoy"><div class="agenda-head"><h3 class="pane-t" id="hHoy" style="margin:0">${icono("today")}Hoy, ${hoy().getDate()} de ${MESES[hoy().getMonth()]}</h3>${selectorVista("seg-hoy")}</div>${agendaHoyHTML()}</section>` +
      `<section class="pane-sec pane-prox" aria-labelledby="hProx"><h3 class="pane-t" id="hProx">${icono("event_upcoming")}Próximos 7 días</h3>${proximosHTML(7, 3)}</section>` +
    `</div></aside></div>`;
}

export function despues() { dibujarRegistro("heatDash"); }

/* ---------- Interacciones del inicio (se registran una sola vez) ---------- */
export function iniciar() {
  document.addEventListener("click", async e => {
    const mb = e.target.closest(".up-more");
    if (mb) {
      const abrir = mb.getAttribute("aria-expanded") !== "true", lista = qs("#upList");
      lista.classList.toggle("all", abrir); mb.setAttribute("aria-expanded", String(abrir));
      mb.querySelector(".lbl").textContent = abrir ? "Ver menos" : "Ver " + mb.dataset.more + " más";
      if (abrir) qs("li.extra a", lista)?.focus();
      return;
    }
    const g = e.target.closest("[data-goto]");
    if (g) { location.hash = href("agenda", g.dataset.goto); return; }
    if (e.target.closest("#addTaskBtn")) { abrirNuevaTarea(); return; }
    const del = e.target.closest("[data-del]");
    if (del) {
      const id = +del.dataset.del, t = tareas().find(x => x.id === id); if (!t) return;
      const visibles = tareas(), pos = visibles.findIndex(x => x.id === id);
      const ok = await confirmar({ icono: "delete", titulo: "¿Eliminar esta tarea?", ok: "Eliminar", peligro: true, texto: `<b>${esc(t.titulo)}</b><br>Se quita de tus pendientes. No se puede deshacer.` });
      if (!ok) return;
      eliminarTarea(id);
      const sig = visibles.filter(x => x.id !== id)[Math.min(pos, visibles.length - 2)];
      repintarPendientes(sig ? "#td" + sig.id : "#addTaskBtn");
      aviso("Tarea eliminada");
    }
  });
  document.addEventListener("change", e => {
    const c = e.target.closest("[data-todo]"); if (!c) return;
    marcarTarea(+c.dataset.todo, c.checked);
    repintarPendientes("#td" + c.dataset.todo);
    aviso(c.checked ? "Tarea completada" : "Tarea marcada como pendiente");
  });

  // Diálogo "Nueva tarea"
  const dlg = qs("#dlgTarea"), form = qs("#formTarea"), tit = qs("#tTitulo"), err = qs("#tErr");
  const limpiarError = () => { tit.removeAttribute("aria-invalid"); tit.removeAttribute("aria-describedby"); err.hidden = true; };
  function abrirNuevaTarea() {
    const m = sumarDias(hoy(), 1);
    form.reset(); limpiarError();
    qs("#tFecha").value = isoDia(m); qs("#tHora").value = "23:59";
    abrirDialogo(dlg, tit);
  }
  dlg.addEventListener("click", e => { if (e.target.closest('[data-tarea="cancelar"]')) dlg.close(); });
  tit.addEventListener("input", () => { if (tit.value.trim()) limpiarError(); });
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!tit.value.trim()) { tit.setAttribute("aria-invalid", "true"); tit.setAttribute("aria-describedby", "tErr"); err.hidden = false; tit.focus(); return; }
    const f = qs("#tFecha").value, h = qs("#tHora").value || "23:59";
    const [hh, mm] = h.split(":").map(Number);
    let venc;
    if (f) { const [y, mo, d] = f.split("-").map(Number); venc = new Date(y, mo - 1, d, hh, mm).getTime(); }
    else { const m = sumarDias(hoy(), 1); m.setHours(23, 59); venc = m.getTime(); }
    agregarTarea(tit.value.trim(), venc);
    dlg.dataset.sinRetorno = "1";
    dlg.close();
    repintarPendientes("#addTaskBtn");
    aviso("Tarea agregada");
  });
}
