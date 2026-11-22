/* Taller - IA | Arranque y enrutamiento por hash (#/seccion/parametros)
   Funciona publicado en GitHub Pages sin configuración extra. */
import { tema } from "./theme.js";
import { cargar } from "./state.js";
import { RUTAS, leerHash, href } from "./routes.js";
import { qs } from "./util.js";
import { iniciarShell, marcarActual, setTitulos, pintarPersona } from "./shell.js";
import { iniciarTooltips, icono } from "./ui.js";
import * as inicio from "./views/inicio.js";
import * as agenda from "./views/agenda.js";
import * as recorrido from "./views/recorrido.js";
import * as aprendizaje from "./views/aprendizaje.js";
import { ajustes, iniciarAjustes, simple, ayuda, misPrompts, iniciarPrompts } from "./views/otras.js";
import * as leccion from "./lesson/leccion.js";
import * as recursos from "./views/recursos.js";
import { DEMO } from "./state.js";
import { dibujarRegistro } from "./views/piezas.js";
import { SIMULAR, demoraSimulada, errorSimulado, splashSiTarda, cerrarSplash, vigilarConexion, esperaConMensaje } from "./estados.js";

const main = qs("#contenido");
let primera = true, ultimaRuta = "";

function vista(id, args) {
  const r = RUTAS[id];
  switch (id) {
    case "inicio": return { html: inicio.render(), despues: inicio.despues };
    case "agenda": agenda.preparar(args); return { html: agenda.render() };
    case "recorrido": recorrido.preparar(args); return { html: recorrido.render(), despues: recorrido.despues };
    case "aprendizaje": aprendizaje.preparar(args); return { html: aprendizaje.render(), despues: aprendizaje.despues };
    case "ajustes": return { html: ajustes() };
    case "ayuda": return { html: ayuda() };
    case "prompts": return { html: misPrompts() };
    case "modulo": return { asincrono: () => leccion.mostrar(main, args) };
    case "glosario": return { asincrono: () => recursos.glosario(main, args) };
    case "biblioteca": return { asincrono: () => recursos.biblioteca(main, args) };
    case "facilitadores": return { asincrono: () => recursos.facilitadores(main, args) };
    default: return { html: simple(id), titulo: r.t, sub: r.s };
  }
}

/* Secciones con contenido largo: skeleton de tarjetas y lista mientras se prepara (se ve con ?simular=lento) */
const LARGAS = { aprendizaje: "Preparando tu aprendizaje: competencias, objetivos y evidencias.", biblioteca: "Cargando la Biblioteca: fuentes y filtros.", glosario: "Cargando el glosario.", prompts: "Cargando tus prompts." };
const esqueletoLista = () => `<div id="esperaLista"></div><div class="learn-grid" aria-hidden="true">` +
  `<div class="card" style="padding:16px;display:grid;gap:12px"><div class="sk" style="height:24px;width:60%"></div><div class="sk" style="height:12px"></div><div class="sk" style="height:12px;width:80%"></div><div class="sk" style="height:96px"></div></div>`.repeat(3) + `</div>`;

/** Dibuja la ruta actual. mantenerFoco: true cuando se vuelve a dibujar la misma pantalla. */
let turno = 0;
async function render(mantenerFoco) {
  const { id, args } = leerHash();
  const r = marcarActual(id);
  const mio = ++turno;
  if (SIMULAR === "lento" && LARGAS[id] && !mantenerFoco) {
    main.setAttribute("aria-busy", "true"); main.innerHTML = esqueletoLista();
    const cancelar = esperaConMensaje(qs("#esperaLista"), { texto: LARGAS[id] });
    await demoraSimulada(2500); cancelar();
    if (mio !== turno) return;
  }
  const v = vista(id, args);
  let res = v;
  if (v.asincrono) {
    try { res = await v.asincrono() || {}; }
    catch (e) { if (mio === turno) error(e.message); return; }
    if (mio !== turno) return; // la persona ya fue a otra pantalla
    pintarPersona();
  } else main.innerHTML = v.html;
  main.setAttribute("aria-busy", "false");
  setTitulos(res.titulo || r.t, res.sub ?? r.s);
  res.despues && res.despues();
  const clave = location.hash;
  if (!primera && !mantenerFoco && clave !== ultimaRuta) {
    // Al cambiar de pantalla, el foco va al título del contenido nuevo (o al contenido) y la página vuelve arriba
    if (!(id === "recorrido" && args[0] === "rutas") && !(id === "aprendizaje" && args[0])) {
      const f = res.foco && qs(res.foco);
      (f || main).focus({ preventScroll: true }); scrollTo({ top: 0 });
    }
  }
  ultimaRuta = location.hash; primera = false;
}

function error(msg) {
  cerrarSplash();
  main.setAttribute("aria-busy", "false");
  const local = location.protocol === "file:";
  main.innerHTML = `<div class="card" style="padding:var(--app-space-6);max-width:640px" role="alert">` +
    `<h2 style="font:var(--md-sys-typescale-headline-small);margin-bottom:var(--app-space-3)">No se pudo cargar el contenido del taller</h2>` +
    `<p style="margin-bottom:var(--app-space-4)">${local
      ? "Abriste el archivo directamente desde la carpeta. El navegador no permite leer el contenido así. Abrilo con el comando <code>npm run servir</code> o desde la versión publicada en GitHub Pages."
      : "Revisá tu conexión e intentá de nuevo. Tu progreso guardado no se pierde."}</p>` +
    `<button class="btn btn-filled" type="button" data-recargar>${icono("refresh")}Reintentar</button>` +
    `<p class="muted" style="font:var(--md-sys-typescale-body-small);margin-top:var(--app-space-4)">Detalle técnico: ${msg}</p></div>`;
}

async function arrancar() {
  tema.aplicar();
  document.addEventListener("click", e => { if (e.target.closest("[data-recargar]")) location.reload(); });
  splashSiTarda();
  try { await demoraSimulada(4500); errorSimulado("el contenido del taller"); await cargar(); }
  catch (e) { error(e.message); return; }
  cerrarSplash();
  const rerender = () => render(true);
  iniciarShell({ render: rerender });
  iniciarTooltips();
  inicio.iniciar();
  agenda.iniciar(rerender);
  recorrido.iniciar(rerender);
  leccion.iniciar();
  // Pie: el aviso de datos de ejemplo solo aparece en el modo de ejemplo
  if (!DEMO) qs("#foot").textContent = "© 2026 Lourdes Pedaci, Experience Designer";
  iniciarAjustes(rerender);
  iniciarPrompts(rerender);
  vigilarConexion();
  // Reintentar en una tarjeta de error: vuelve a dibujar la pantalla actual
  document.addEventListener("click", e => { if (e.target.closest("[data-reintentar]")) render(false); });
  // El registro de actividad adapta las semanas al ancho disponible
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { dibujarRegistro("heatDash"); dibujarRegistro("heatFull"); }, 150); });
  addEventListener("hashchange", () => {
    const h = location.hash;
    if (h && !h.startsWith("#/") && document.getElementById(h.slice(1))) return; // ancla interna
    render(false);
  });
  if (!location.hash) history.replaceState(null, "", href("inicio"));
  render(false);
  // Panel de diagnóstico de accesibilidad: solo con ?diagnostico=1
  if (new URLSearchParams(location.search).get("diagnostico") === "1") import("./diagnostico.js").then(m => m.iniciar());
}

arrancar();
