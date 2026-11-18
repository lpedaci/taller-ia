/* Taller - IA | Marco del entorno: riel, barra inferior, hoja "Más", barra superior,
   búsqueda, menú de usuario, avisos y acciones globales. */
import { RUTAS, GRUPOS, destinos, href } from "./routes.js";
import { store } from "./storage.js";
import { tema } from "./theme.js";
import { esc, norm, qs, qsa, mismoDia, hoy } from "./util.js";
import { datos, estado, eventos, moduloActual, exportar, importar, borrarTodo } from "./state.js";
import { aviso, menu, confirmar, descargar, icono } from "./ui.js";

const LARGE = 1200, MEDIUM = 600;
const esLarge = () => innerWidth >= LARGE;
let rail, appEl, scrim, railToggle, sheet, moreBtn;
let gruposAbiertos = { main: true, res: false, sup: false };
let actual = "inicio";
let peeking = false, peekT = null;
let alRenderizar = () => {};

/* ---------- Construcción ---------- */
function eventosRestantesHoy() {
  const n = new Date();
  return eventos().filter(e => mismoDia(e.inicio, hoy()) && e.inicio >= n).length;
}
function itemRiel(k) {
  const r = RUTAS[k], n = k === "agenda" ? eventosRestantesHoy() : 0;
  return `<a class="rail-item" href="${href(k)}" data-route="${k}"><span class="ind">${icono(r.ic)}</span>` +
    `<span class="txt short">${r.corto || r.t}</span><span class="txt full">${r.t}</span>` +
    (n ? `<span class="badge">${n}<span class="sr-only"> ${n === 1 ? "evento más" : "eventos más"} hoy</span></span>` : "") + `</a>`;
}
function construir() {
  qs("#railGroups").innerHTML =
    `<div class="rail-group rail-solo"><div class="rail-items">${destinos("top").map(itemRiel).join("")}</div></div>` +
    GRUPOS.map(G => `<div class="rail-group" data-group="${G.g}">` +
      `<button class="group-btn" type="button" data-group-btn="${G.g}" aria-expanded="false" aria-controls="grp-${G.g}"><span class="ind">${icono(G.ic)}</span><span class="short" aria-hidden="true">${G.t}</span><span class="full" aria-hidden="true">${G.t}</span>${icono("expand_more", "chev")}</button>` +
      `<div class="rail-items" id="grp-${G.g}">${destinos(G.g).map(itemRiel).join("")}</div></div>`).join("");

  const nHoy = eventosRestantesHoy();
  qs("#navbar").innerHTML = destinos("top").concat(destinos("main")).map(k => {
    const r = RUTAS[k], b = k === "agenda" && nHoy ? `<span class="badge">${nHoy}<span class="sr-only"> ${nHoy === 1 ? "evento más" : "eventos más"} hoy</span></span>` : "";
    return `<a href="${href(k)}" data-route="${k}"><span class="ind">${icono(r.ic)}${b}</span>${r.corto || r.t}</a>`;
  }).join("") +
    `<button type="button" id="moreBtn" aria-haspopup="dialog" aria-expanded="false" aria-controls="sheet"><span class="ind">${icono("menu")}</span>Más</button>`;

  qs("#sheetLinks").innerHTML = ["res", "sup"].map(g => {
    const G = GRUPOS.find(x => x.g === g);
    return `<h2 id="sh-${g}">${G.t}</h2><nav aria-labelledby="sh-${g}">` + destinos(g).map(k => `<a href="${href(k)}" data-route="${k}">${icono(RUTAS[k].ic)}${RUTAS[k].t}</a>`).join("") + `</nav>`;
  }).join("");
}

/* ---------- Riel: colapsado o expandido; en Large se recuerda, en Medium y Expanded es modal ---------- */
function pintarGrupos() {
  const exp = rail.classList.contains("expanded");
  GRUPOS.forEach(G => {
    const b = qs(`[data-group-btn="${G.g}"]`), lista = qs("#grp-" + G.g), abierto = !!gruposAbiertos[G.g];
    const activa = RUTAS[actual]?.g === G.g;
    b.setAttribute("aria-expanded", exp ? String(abierto) : "false");
    lista.hidden = !abierto;
    b.classList.toggle("has-active", activa);
    b.setAttribute("aria-label", (exp ? (abierto ? "Ocultar " : "Mostrar ") : "Abrir ") + G.t + (activa ? ", contiene la página actual" : ""));
  });
}
function setRail(exp, recordar) {
  rail.classList.toggle("expanded", exp);
  railToggle.setAttribute("aria-expanded", String(exp));
  railToggle.setAttribute("aria-label", exp ? "Contraer navegación" : "Expandir navegación");
  qs("#railToggleIcon").textContent = exp ? "menu_open" : "menu";
  const modal = exp && !esLarge() && innerWidth >= MEDIUM;
  appEl.classList.toggle("rail-modal", modal);
  scrim.classList.toggle("open", modal || !sheet.hidden);
  if (recordar && esLarge()) store.set("rielExpandido", exp);
  pintarGrupos();
}
const estaModal = () => appEl.classList.contains("rail-modal");
function iniciarPeek() {
  peeking = true; rail.classList.add("expanded", "peek"); appEl.classList.add("rail-peek");
  railToggle.setAttribute("aria-expanded", "true"); railToggle.setAttribute("aria-label", "Fijar navegación expandida");
  qs("#railToggleIcon").textContent = "menu_open"; pintarGrupos();
}
function terminarPeek() {
  clearTimeout(peekT);
  if (!peeking) return;
  peeking = false; rail.classList.remove("peek", "expanded"); appEl.classList.remove("rail-peek");
  railToggle.setAttribute("aria-expanded", "false"); railToggle.setAttribute("aria-label", "Expandir navegación");
  qs("#railToggleIcon").textContent = "menu"; pintarGrupos();
}

/* ---------- Hoja "Más" (Compact) ---------- */
function abrirHoja() {
  sheet.hidden = false;
  requestAnimationFrame(() => { sheet.classList.add("open"); scrim.classList.add("open"); });
  moreBtn.setAttribute("aria-expanded", "true");
  (qs('[aria-current="page"]', sheet) || qs("a", sheet))?.focus();
}
function cerrarHoja(volver) {
  if (sheet.hidden) return;
  sheet.classList.remove("open");
  if (!estaModal()) scrim.classList.remove("open");
  moreBtn.setAttribute("aria-expanded", "false");
  setTimeout(() => { sheet.hidden = true; }, 320);
  if (volver) moreBtn.focus();
}

/* ---------- Búsqueda: módulos y secciones (el glosario se suma en la etapa 9) ---------- */
function resultados(q) {
  const v = norm(q.trim()); if (!v) return null;
  const mods = datos.modulos.filter(m => norm(m.titulo + " " + m.descripcion + " modulo " + m.id).includes(v))
    .map(m => ({ href: href("modulo", m.id), ic: "school", txt: `<b>Módulo ${m.id}</b> | ${esc(m.titulo)}`, tipo: "Módulo" }));
  const secs = Object.keys(RUTAS).filter(k => !RUTAS[k].oculto && norm(RUTAS[k].t + " " + RUTAS[k].s).includes(v))
    .map(k => ({ href: href(k), ic: RUTAS[k].ic, txt: esc(RUTAS[k].t), tipo: "Sección" }));
  return secs.concat(mods).slice(0, 8);
}
function pintarResultados(input, caja, estadoEl) {
  const r = resultados(input.value);
  if (!r) { caja.hidden = true; caja.innerHTML = ""; estadoEl.textContent = ""; return; }
  caja.innerHTML = r.length
    ? r.map(x => `<a href="${x.href}">${icono(x.ic, "sm muted")}<span>${x.txt}</span><span class="sr-type">${x.tipo}</span></a>`).join("")
    : `<p class="sr-none">No hay resultados para "${esc(input.value)}". Probá con otra palabra.</p>`;
  caja.hidden = false;
  estadoEl.textContent = r.length ? (r.length === 1 ? "1 resultado" : r.length + " resultados") : "Sin resultados";
}
function conectarBusqueda(input, caja, estadoEl, alElegir) {
  input.addEventListener("input", () => pintarResultados(input, caja, estadoEl));
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { const a = qs("a", caja); if (a && !caja.hidden) { e.preventDefault(); a.focus(); } }
    if (e.key === "Escape" && input.value) { e.stopPropagation(); e.preventDefault(); input.value = ""; pintarResultados(input, caja, estadoEl); }
    if (e.key === "Enter") { const a = qs("a", caja); if (a) { e.preventDefault(); location.hash = a.getAttribute("href"); alElegir(); } }
  });
  caja.addEventListener("keydown", e => {
    const it = qsa("a", caja), i = it.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); it[Math.min(i + 1, it.length - 1)]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); i <= 0 ? input.focus() : it[i - 1].focus(); }
    if (e.key === "Escape") { e.preventDefault(); input.focus(); }
  });
  caja.addEventListener("click", e => { if (e.target.closest("a")) alElegir(); });
}

/* ---------- Acciones globales (menú de usuario, Ajustes) ---------- */
export async function accion(nombre) {
  if (nombre === "exportar-progreso") {
    const ok = descargar("taller-ia-progreso-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(exportar(), null, 2));
    aviso(ok ? "Se descargó tu progreso en un archivo JSON" : "No se pudo descargar el archivo. Probá desde otro navegador.");
  } else if (nombre === "importar-progreso") {
    qs("#importFile").click();
  } else if (nombre === "borrar") {
    const ok = await confirmar({
      icono: "delete", titulo: "¿Borrar tus datos?", ok: "Borrar", peligro: true,
      texto: "Se borran de este navegador tu progreso, tus prompts guardados, tu diario, tus pendientes y tus ajustes. No se puede deshacer. Si querés conservarlos, exportá tu progreso antes."
    });
    if (!ok) return;
    borrarTodo(); tema.aplicar(); setRail(esLarge(), false);
    alRenderizar(); qs("#contenido").focus();
    aviso("Se borraron tus datos de este navegador");
  } else if (nombre === "tema") {
    tema.alternar();
    aviso(tema.modo === "dark" ? "Modo oscuro activado" : "Modo claro activado");
  }
}

function pintarTema() {
  const oscuro = tema.modo === "dark";
  qs("#themeIcon").textContent = oscuro ? "light_mode" : "dark_mode";
  const lbl = oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  qs("#themeBtn").setAttribute("aria-label", lbl); qs("#themeBtn").dataset.tip = lbl;
}

/** Actualiza el botón "Continuar: Módulo X" y los datos de la persona en la barra */
export function pintarPersona() {
  const m = moduloActual(), p = estado().perfil;
  const cta = qs("#topCta");
  cta.href = href("modulo", m.id);
  cta.setAttribute("aria-label", "Continuar: Módulo " + m.id);
  qs("#ctaNum").textContent = ": Módulo " + m.id;
  qsa("[data-iniciales]").forEach(el => { el.textContent = p.iniciales; });
  qs("#userBtn").setAttribute("aria-label", p.iniciales + ", menú de usuario de " + p.nombreCompleto);
  qs("#mhName").textContent = p.nombreCompleto;
  const ruta = datos.rutas.find(r => r.id === estado().ruta);
  qs("#mhSub").textContent = p.cohorte + " | " + (ruta ? ruta.titulo : "");
}

/* ---------- Al cambiar de página ---------- */
export function marcarActual(id) {
  actual = id;
  const g = RUTAS[id].g;
  gruposAbiertos = { main: false, res: false, sup: false };
  if (g !== "top") gruposAbiertos[g] = true;
  const destino = RUTAS[id].padre || id;
  qsa("[data-route]").forEach(a => a.dataset.route === destino ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  // En la barra inferior, "Más" se marca si la página está en Recursos o Soporte
  moreBtn?.classList.toggle("has-active", g === "res" || g === "sup");
  moreBtn?.setAttribute("aria-label", "Más" + (g === "res" || g === "sup" ? ", contiene la página actual" : ""));
  cerrarHoja(false);
  if (estaModal()) setRail(false);
  terminarPeek();
  pintarGrupos();
  const titulo = RUTAS[id];
  qs("#topbar").classList.toggle("no-title", id === "inicio");
  return titulo;
}
export function setTitulos(t, s) {
  qs("#pageTitle").textContent = t; qs("#pageSub").textContent = s || "";
  document.title = (t === "Inicio" ? "Inicio" : t) + " | Taller - IA";
}

/* ---------- Inicio ---------- */
export function iniciarShell({ render }) {
  alRenderizar = render;
  rail = qs("#rail"); appEl = qs("#app"); scrim = qs("#scrim"); railToggle = qs("#railToggle"); sheet = qs("#sheet");
  construir();
  moreBtn = qs("#moreBtn");

  // Estado inicial sin animación: el riel no se "abre" cada vez que se carga la página
  rail.classList.add("sin-anim");
  setRail(esLarge() ? store.get("rielExpandido", true) : false);
  requestAnimationFrame(() => requestAnimationFrame(() => rail.classList.remove("sin-anim")));
  railToggle.addEventListener("click", () => {
    if (peeking) { peeking = false; rail.classList.remove("peek"); appEl.classList.remove("rail-peek"); setRail(true, true); return; }
    setRail(!rail.classList.contains("expanded"), true);
  });
  qs("#railGroups").addEventListener("click", e => {
    const b = e.target.closest("[data-group-btn]"); if (!b) return;
    const g = b.dataset.groupBtn;
    if (!rail.classList.contains("expanded")) { gruposAbiertos[g] = true; setRail(true, true); qs(`#grp-${g} a`)?.focus(); }
    else { gruposAbiertos[g] = !gruposAbiertos[g]; pintarGrupos(); }
  });
  // Vista previa: solo con mouse, con el riel colapsado y desde 600 px
  const conMouse = matchMedia("(hover: hover) and (pointer: fine)");
  rail.addEventListener("mouseenter", () => {
    if (rail.classList.contains("expanded") || !conMouse.matches || innerWidth < MEDIUM) return;
    clearTimeout(peekT); peekT = setTimeout(iniciarPeek, 700);
  });
  rail.addEventListener("mouseleave", terminarPeek);
  scrim.addEventListener("click", () => { setRail(false); cerrarHoja(false); });
  let eraLarge = esLarge();
  addEventListener("resize", () => {
    if (esLarge() !== eraLarge) { eraLarge = esLarge(); terminarPeek(); setRail(eraLarge ? store.get("rielExpandido", true) : false); }
    if (innerWidth >= MEDIUM) cerrarHoja(false);
  });

  moreBtn.addEventListener("click", abrirHoja);
  // La hoja es modal: el foco queda dentro mientras está abierta
  sheet.addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    const it = qsa("a", sheet), i = it.indexOf(document.activeElement);
    if (e.shiftKey && i === 0) { e.preventDefault(); it[it.length - 1].focus(); }
    else if (!e.shiftKey && i === it.length - 1) { e.preventDefault(); it[0].focus(); }
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    if (!sheet.hidden) cerrarHoja(true);
    else if (estaModal()) { setRail(false); railToggle.focus(); }
    else if (peeking) terminarPeek();
  });

  // Barra superior: toma el color del riel al hacer scroll
  const topbar = qs("#topbar");
  addEventListener("scroll", () => topbar.classList.toggle("scrolled", scrollY > 4), { passive: true });

  // Tema
  pintarTema(); tema.alCambiar(pintarTema);
  qs("#themeBtn").addEventListener("click", () => accion("tema"));

  // Menús
  menu(qs("#userBtn"), qs("#userMenu"));
  menu(qs("#avisosBtn"), qs("#avisosMenu"));
  const av = datos.demo.avisos || [];
  qs("#avisosItems").innerHTML = av.length
    ? av.map(a => `<a role="menuitem" href="${esc(a.href)}" tabindex="-1">${icono(a.icono)}<span class="mi-txt">${esc(a.titulo)}<small>${esc(a.detalle)}</small></span></a>`).join("")
    : `<p class="menu-title">No tenés avisos nuevos.</p>`;
  const nAv = av.length;
  qs("#avisosBtn").setAttribute("aria-label", nAv ? `Avisos, ${nAv} ${nAv === 1 ? "nuevo" : "nuevos"}` : "Avisos");
  qs("#avisosBtn").dataset.tip = "Avisos";
  qs("#avisosDot").hidden = !nAv;

  // Búsqueda en la barra (Expanded y Large) y a pantalla completa (Compact y Medium)
  const q = qs("#q"), qr = qs("#qResults"), qe = qs("#qEstado");
  conectarBusqueda(q, qr, qe, () => { q.value = ""; pintarResultados(q, qr, qe); });
  document.addEventListener("click", e => { if (!e.target.closest(".search")) qr.hidden = true; });
  const dlgB = qs("#dlgBuscar"), q2 = qs("#q2"), qr2 = qs("#q2Results"), qe2 = qs("#q2Estado");
  conectarBusqueda(q2, qr2, qe2, () => dlgB.close());
  qs("#searchBtn").addEventListener("click", () => { q2.value = ""; pintarResultados(q2, qr2, qe2); dlgB.showModal(); q2.focus(); });
  qs("#q2Cerrar").addEventListener("click", () => dlgB.close());
  dlgB.addEventListener("close", () => { if (!location.hash.startsWith("#/modulo") && !dlgB.dataset.nav) qs("#searchBtn").focus(); });

  // Acciones con data-action en cualquier parte
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-action]"); if (!a) return;
    e.preventDefault(); accion(a.dataset.action);
  });
  qs("#importFile").addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    try {
      const err = importar(JSON.parse(await f.text()));
      if (err) { aviso(err); return; }
      tema.aplicar(); pintarPersona(); alRenderizar();
      aviso("Se importó tu progreso");
    } catch (x) { aviso("No se pudo leer el archivo. Elegí un archivo .json exportado desde el taller."); }
  });

  // Saltar al contenido sin alterar el enrutamiento por hash
  qs(".skip").addEventListener("click", e => { e.preventDefault(); const m = qs("#contenido"); m.focus(); m.scrollIntoView(); });

  pintarPersona();
}
