/* Taller - IA | Piezas de interfaz reutilizables (HTML como texto) y servicios de UI */
import { esc } from "./util.js";
import { TIPOS } from "./state.js";

export const icono = (nombre, extra = "") => `<span class="ms${extra ? " " + extra : ""}" aria-hidden="true">${nombre}</span>`;

/** Encabezado de tarjeta: ícono en contenedor, título y acción opcional */
export const cabecera = (ic, titulo, extra, id, nivel = 2) =>
  `<div class="card-head"><span class="ic">${icono(ic)}</span><h${nivel} id="${id}">${titulo}</h${nivel}>${extra || ""}</div>`;

/** Indicador de progreso lineal determinado */
export function lineal(pct, etiqueta) {
  pct = Math.max(0, Math.min(100, Math.round(pct)));
  return `<div class="lin" role="progressbar" aria-label="${esc(etiqueta)}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-valuetext="${pct}%">` +
    (pct > 0 ? `<span class="a" style="width:${pct}%"></span>` : "") + (pct < 100 ? `<span class="t"></span>` : "") + `</div>`;
}

/** Anillo de progreso (decorativo: el porcentaje se dice en el texto que lo acompaña) */
export function anillo(pct) {
  const r = 20, c = 2 * Math.PI * r;
  return `<div class="ring" aria-hidden="true"><svg viewBox="0 0 48 48"><circle class="bg" cx="24" cy="24" r="${r}" fill="none" stroke-width="5"/>` +
    `<circle class="fg" cx="24" cy="24" r="${r}" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(1)}"/></svg>` +
    (pct >= 100 ? `<b>${icono("check", "fill sm ok")}</b>` : `<b>${pct}%</b>`) + `</div>`;
}

export function chipTipo(tipo) {
  const T = TIPOS[tipo]; if (!T) return "";
  return `<span class="chip ev-${T.k}">${icono(T.ic)}${T.lbl}</span>`;
}

/** Estado vacío: ilustración SVG simple, una línea y una acción opcional */
export function vacio(titulo, texto, accion = "") {
  return `<div class="empty-state"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="var(--md-sys-color-surface-container-highest)"/>` +
    `<rect x="34" y="38" width="52" height="46" rx="12" fill="var(--md-sys-color-surface)" stroke="var(--md-sys-color-outline-variant)" stroke-width="2"/>` +
    `<rect x="42" y="50" width="36" height="6" rx="3" fill="var(--md-sys-color-primary)" opacity=".6"/><rect x="42" y="63" width="24" height="6" rx="3" fill="var(--md-sys-color-outline-variant)"/></svg>` +
    `<h3>${titulo}</h3><p>${texto}</p>${accion}</div>`;
}

/* ---------- Snackbar ---------- */
let snackT;
export function aviso(msg) {
  const s = document.getElementById("snack"); if (!s) return;
  s.textContent = "";
  // Se vacía y se vuelve a escribir para que los lectores de pantalla anuncien mensajes repetidos
  requestAnimationFrame(() => { s.textContent = msg; s.classList.add("show"); });
  clearTimeout(snackT);
  snackT = setTimeout(() => s.classList.remove("show"), 4000);
}

/* ---------- Diálogos M3 sobre <dialog> nativo ---------- */
/** Abre un diálogo y devuelve el foco al elemento de origen al cerrarse */
export function abrirDialogo(dlg, foco) {
  const origen = document.activeElement;
  dlg.showModal();
  (foco || dlg.querySelector("[autofocus]") || dlg.querySelector("button, input, a"))?.focus();
  dlg.addEventListener("close", () => { if (origen && document.contains(origen) && !dlg.dataset.sinRetorno) origen.focus(); delete dlg.dataset.sinRetorno; }, { once: true });
}

/** Diálogo de confirmación. Devuelve una promesa con true (confirmó) o false. */
export function confirmar({ icono: ic = "help", titulo, texto, ok = "Aceptar", peligro = false }) {
  const dlg = document.getElementById("dlgConfirmar");
  dlg.querySelector(".dlg-ic").textContent = ic;
  dlg.querySelector("h2").textContent = titulo;
  dlg.querySelector("p").innerHTML = texto;
  const bOk = dlg.querySelector('[data-r="ok"]');
  bOk.textContent = ok;
  bOk.className = "btn " + (peligro ? "btn-danger" : "btn-filled");
  return new Promise(res => {
    const fin = v => { dlg.removeEventListener("click", clic); dlg.removeEventListener("cancel", cancelar); res(v); };
    const clic = e => { const b = e.target.closest("[data-r]"); if (!b) return; if (b.dataset.r === "ok") dlg.dataset.sinRetorno = "1"; dlg.close(); fin(b.dataset.r === "ok"); };
    const cancelar = () => fin(false);
    dlg.addEventListener("click", clic);
    dlg.addEventListener("cancel", cancelar);
    abrirDialogo(dlg, dlg.querySelector('[data-r="cancelar"]'));
  });
}

/* ---------- Tooltip simple de M3 para botones de ícono (data-tip) ---------- */
export function iniciarTooltips() {
  const tip = document.createElement("div");
  tip.className = "tooltip"; tip.setAttribute("aria-hidden", "true");
  document.body.appendChild(tip);
  let t, actual = null;
  const mostrar = el => {
    actual = el; tip.textContent = el.dataset.tip;
    const r = el.getBoundingClientRect();
    tip.style.left = "0px"; tip.style.top = "0px"; tip.classList.add("show");
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = r.left + r.width / 2 - w / 2, y = r.bottom + 4;
    if (y + h > innerHeight - 8) y = r.top - h - 4;
    x = Math.max(8, Math.min(innerWidth - w - 8, x));
    tip.style.left = x + "px"; tip.style.top = y + "px";
  };
  const ocultar = () => { clearTimeout(t); actual = null; tip.classList.remove("show"); };
  document.addEventListener("pointerover", e => {
    const el = e.target.closest("[data-tip]");
    if (!el || e.pointerType === "touch") { if (!el) ocultar(); return; }
    if (el === actual) return;
    clearTimeout(t); t = setTimeout(() => mostrar(el), 500);
  });
  document.addEventListener("focusin", e => { const el = e.target.closest("[data-tip]"); if (el && el.matches(":focus-visible")) mostrar(el); else ocultar(); });
  document.addEventListener("focusout", ocultar);
  document.addEventListener("keydown", e => { if (e.key === "Escape") ocultar(); });
  document.addEventListener("pointerdown", ocultar);
  addEventListener("scroll", ocultar, { passive: true });
}

/* ---------- Descargar un archivo generado en el navegador ---------- */
export function descargar(nombre, contenido, tipo = "application/json") {
  try {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a = document.createElement("a");
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (e) { return false; }
}

/** Menú M3: navegación con flechas, Inicio, Fin, Escape y Tab */
export function menu(boton, panel) {
  const items = () => [...panel.querySelectorAll('[role="menuitem"]')];
  const abierto = () => !panel.hidden;
  function abrir(cual) {
    panel.hidden = false; boton.setAttribute("aria-expanded", "true");
    const it = items(); (cual === "ultimo" ? it[it.length - 1] : it[0])?.focus();
  }
  function cerrar(volver) {
    if (!abierto()) return;
    panel.hidden = true; boton.setAttribute("aria-expanded", "false");
    if (volver) boton.focus();
  }
  boton.addEventListener("click", () => abierto() ? cerrar(true) : abrir());
  boton.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); abrir(); }
    if (e.key === "ArrowUp") { e.preventDefault(); abrir("ultimo"); }
  });
  panel.addEventListener("keydown", e => {
    const it = items(), i = it.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); it[(i + 1) % it.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
    else if (e.key === "Home") { e.preventDefault(); it[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); it[it.length - 1].focus(); }
    else if (e.key === "Escape") { e.preventDefault(); cerrar(true); }
    else if (e.key === "Tab") cerrar(false);
  });
  panel.addEventListener("click", e => { if (e.target.closest('[role="menuitem"]')) cerrar(false); });
  document.addEventListener("click", e => { if (!e.target.closest(".menu-wrap") || (!panel.contains(e.target) && !boton.contains(e.target))) cerrar(false); });
  return { abrir, cerrar };
}
