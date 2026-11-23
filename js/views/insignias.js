/* Taller - IA | Colección de insignias y certificado (D-078)
   - Mi aprendizaje muestra las 21 insignias de los módulos y la de recorrido completo: ganadas a color, por ganar en gris.
   - Cada insignia abre un diálogo con su detalle. Las ganadas se descargan como imagen PNG y se pueden enviar a la
     coordinación por correo (lo envía la persona desde su programa de correo; no hay servidor).
   - El certificado del Módulo 20 también se descarga como imagen y se envía. */
import { esc, qs } from "../util.js";
import { datos, modulo, bloque, avance, fechaModulo, rutaActual, actividadGuardada, perfil, completados } from "../state.js";
import { insigniaSVG, CINTA } from "../insignias.js";
import { icono, cabecera, abrirDialogo, descargar, aviso } from "../ui.js";
import { href } from "../routes.js";

const fechaLarga = iso => new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
const fechaCorta = iso => new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
const coordinacion = () => datos.coordinacion || { nombre: "la coordinación", correo: "" };

/** Módulos de la ruta elegida: los de sus bloques más los sumados uno por uno */
function modulosDeRuta(r = rutaActual()) {
  return datos.modulos.filter(m => r.bloques.includes(m.bloque) || r.modulos.includes(m.id));
}

/** Todas las insignias con su estado. La de recorrido completo se gana al terminar la ruta elegida */
export function insignias() {
  const lista = datos.modulos.map(m => {
    const ganada = avance(m).estado === "completado";
    return { id: m.id, bloque: m.bloque, titulo: m.titulo, cinta: CINTA[m.id], ganada, fecha: ganada ? fechaModulo(m.id) : null };
  });
  const r = rutaActual(), mods = modulosDeRuta(r), hechos = mods.filter(m => avance(m).estado === "completado");
  const fechas = hechos.map(m => fechaModulo(m.id)).filter(Boolean).sort();
  lista.push({ id: "recorrido", titulo: `Recorrido completo: ${r.titulo}`, cinta: CINTA.recorrido, ganada: hechos.length === mods.length,
    fecha: hechos.length === mods.length ? fechas[fechas.length - 1] || null : null, faltan: mods.length - hechos.length, ruta: r });
  return lista;
}
const nombreInsignia = x => x.id === "recorrido" ? x.titulo : `Módulo ${x.id} | ${x.titulo}`;
const etiqueta = x => `Insignia ${nombreInsignia(x)}, ${x.ganada ? (x.fecha ? `ganada el ${fechaLarga(x.fecha)}` : "ganada") : "por ganar"}`;

/** Certificado: se genera en el Módulo 20 y queda guardado con el nombre y la fecha */
function certificado() {
  const a = actividadGuardada("20-certificado");
  return a?.resultado === "hecho" ? a.respuesta : null;
}

/* ---------- Tarjeta de Mi aprendizaje ---------- */
export function seccionInsignias() {
  const lista = insignias(), ganadas = lista.filter(x => x.ganada).length, cert = certificado();
  return `<section class="card wide ins-card" aria-labelledby="hIns" style="grid-column:1/-1" id="insignias">` +
    cabecera("military_tech", "Insignias", `<span class="chip chip-neutral">${ganadas} de ${lista.length}</span>`, "hIns") +
    `<div class="card-body"><p class="ins-intro">Cada módulo terminado suma su insignia. Abrila para descargarla como imagen o enviársela a ${esc(coordinacion().nombre)}.</p>` +
    // El nombre accesible se arma con el texto visible más aclaraciones solo para lectores de pantalla (WCAG 2.5.3)
    `<ul class="ins-grid">${lista.map(x => `<li><button class="ins-item${x.ganada ? "" : " is-pend"}" type="button" data-insignia="${x.id}">` +
      `<span class="ins-svg" aria-hidden="true">${insigniaSVG({ ...x, estado: x.ganada ? "ganada" : "pendiente", tam: 104, etiqueta: "" })}</span>` +
      `<span class="sr-only">Insignia </span><span class="ins-nom">${x.id === "recorrido" ? "Recorrido completo" : `Módulo ${x.id}`}</span>` +
      `${x.id === "recorrido" ? "" : `<span class="sr-only">, ${esc(x.titulo)},</span>`} ` +
      `<span class="ins-est">${x.ganada ? (x.fecha ? `<span class="sr-only">ganada el </span>${fechaCorta(x.fecha)}` : "Ganada") : "Por ganar"}</span></button></li>`).join("")}</ul>` +
    `<div class="ins-cert">${icono("workspace_premium", cert ? "fill" : "")}<div class="ins-cert-txt"><b>Certificado final</b><span>${cert
      ? `Emitido a nombre de ${esc(cert.nombre)} el ${esc(cert.fecha)}.`
      : "Se genera en el Módulo 20, después de guardar tu proyecto final."}</span></div>` +
      `<div class="actions">${cert
        ? `<button class="btn btn-outlined" type="button" data-cert="descargar">${icono("download")}Descargar imagen</button><button class="btn btn-filled" type="button" data-cert="enviar">${icono("send")}Enviar a la coordinadora</button>`
        : `<a class="btn btn-tonal" href="${href("modulo", 20, "paso", 5)}">Ir al certificado</a>`}</div></div>` +
    `</div></section>`;
}

/* ---------- Diálogo de una insignia ---------- */
function dialogo() {
  let dlg = document.getElementById("dlgInsignia");
  if (dlg) return dlg;
  dlg = document.createElement("dialog");
  dlg.className = "dialog dlg-confirm dlg-insignia"; dlg.id = "dlgInsignia"; dlg.setAttribute("aria-labelledby", "dlgInsT");
  document.body.appendChild(dlg);
  dlg.addEventListener("click", e => {
    const b = e.target.closest("[data-ins-act]"); if (!b) return;
    const x = insignias().find(i => String(i.id) === dlg.dataset.id);
    if (b.dataset.insAct === "cerrar") dlg.close();
    if (b.dataset.insAct === "descargar") descargarInsignia(x);
    if (b.dataset.insAct === "enviar") enviar(textoInsignia(x));
  });
  return dlg;
}
export function abrirInsignia(id) {
  const x = insignias().find(i => String(i.id) === String(id)); if (!x) return;
  const dlg = dialogo(); dlg.dataset.id = String(x.id);
  const b = x.id === "recorrido" ? null : bloque(x.bloque);
  const como = x.id === "recorrido"
    ? (x.ganada ? `Completaste todos los módulos de tu ruta (${esc(x.ruta.titulo)}).` : `Se gana al completar todos los módulos de tu ruta (${esc(x.ruta.titulo)}). Te ${x.faltan === 1 ? "falta 1 módulo" : `faltan ${x.faltan} módulos`}.`)
    : (x.ganada ? `Bloque ${x.bloque} | ${esc(b?.titulo || "")}.` : `Se gana al completar el Módulo ${x.id}.`);
  dlg.innerHTML = `<div class="dlg-ins-svg">${insigniaSVG({ ...x, estado: x.ganada ? "ganada" : "pendiente", tam: 200, etiqueta: etiqueta(x) })}</div>` +
    `<h2 id="dlgInsT">${esc(nombreInsignia(x))}</h2>` +
    `<p>${x.ganada ? (x.fecha ? `Ganada el ${fechaLarga(x.fecha)}. ` : "Ganada. ") : ""}${como}</p>` +
    `<div class="dlg-actions">${x.ganada
      ? `<button class="btn btn-text" type="button" data-ins-act="cerrar">Cerrar</button><button class="btn btn-outlined" type="button" data-ins-act="descargar">${icono("download")}Descargar imagen</button><button class="btn btn-filled" type="button" data-ins-act="enviar">${icono("send")}Enviar a la coordinadora</button>`
      : `<button class="btn btn-outlined" type="button" data-ins-act="cerrar">Cerrar</button>${x.id === "recorrido" ? `<a class="btn btn-filled" href="${href("recorrido")}">Ver Mi recorrido</a>` : `<a class="btn btn-filled" href="${href("modulo", x.id)}">Ir al Módulo ${x.id}</a>`}`}</div>`;
  abrirDialogo(dlg, qs("[data-ins-act]:last-of-type, a.btn-filled", dlg));
  qs("a.btn-filled", dlg)?.addEventListener("click", () => dlg.close(), { once: true });
}

/* ---------- Enviar a la coordinación ---------- */
// Se arma un correo listo para enviar desde el programa de correo de la persona. No hay servidor: el envío es suyo
function textoInsignia(x) {
  const nombre = perfil().nombreCompleto || "";
  return {
    asunto: `Taller - IA: insignia ${x.id === "recorrido" ? "Recorrido completo" : `del Módulo ${x.id}`}${nombre ? `, ${nombre}` : ""}`,
    cuerpo: `Hola, ${coordinacion().nombre.split(" ")[0]}:\n\nTe cuento que gané la insignia "${nombreInsignia(x)}" del Taller - IA${x.fecha ? ` el ${fechaLarga(x.fecha)}` : ""}.\n` +
      `Módulos completados: ${completados().length} de ${datos.modulos.length}.\n\n${nombre ? `${nombre}\n\n` : ""}Si querés la imagen de la insignia, te la adjunto (se descarga desde Mi aprendizaje).`
  };
}
function textoCertificado(cert) {
  return {
    asunto: `Taller - IA: certificado final, ${cert.nombre}`,
    cuerpo: `Hola, ${coordinacion().nombre.split(" ")[0]}:\n\nTerminé el Taller - IA y generé el certificado final el ${cert.fecha}.\n` +
      `Módulos completados: ${completados().length} de ${datos.modulos.length}, con el proyecto final.\n\n${cert.nombre}\n\nTe adjunto la imagen del certificado (se descarga desde Mi aprendizaje).`
  };
}
function enviar({ asunto, cuerpo }) {
  const c = coordinacion().correo;
  if (!c) { aviso("Falta configurar el correo de la coordinación"); return; }
  location.href = `mailto:${c}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  aviso("Se abrió tu programa de correo con el mensaje listo");
}

/* ---------- Descargar como imagen ---------- */
// Los colores se toman del tema claro, para que la imagen se vea igual al compartirla
function resolverColores(svg) {
  const raiz = document.documentElement, antes = raiz.getAttribute("data-theme");
  raiz.setAttribute("data-theme", "light");
  const cs = getComputedStyle(raiz);
  const fuera = svg.replace(/var\((--[\w-]+)\)/g, (_, v) => cs.getPropertyValue(v).trim() || "#000000");
  if (antes) raiz.setAttribute("data-theme", antes); else raiz.removeAttribute("data-theme");
  return fuera;
}
async function svgAPng(svg, ancho, alto, archivo) {
  const url = URL.createObjectURL(new Blob([resolverColores(svg)], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise((ok, mal) => { img.onload = ok; img.onerror = mal; img.src = url; });
    const cv = document.createElement("canvas"); cv.width = ancho; cv.height = alto;
    cv.getContext("2d").drawImage(img, 0, 0, ancho, alto);
    const png = await new Promise(r => cv.toBlob(r, "image/png"));
    descargar(archivo, png, "image/png");
    aviso("Descargamos la imagen");
  } catch { aviso("No se pudo armar la imagen. Probá de nuevo."); }
  finally { URL.revokeObjectURL(url); }
}
const textoSVG = (x, y, t, tam, peso, color) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${tam}" font-weight="${peso}" fill="${color}">${esc(t)}</text>`;
/** Parte un texto en líneas de hasta n caracteres, sin cortar palabras */
function lineas(t, n) {
  const out = [""];
  for (const p of String(t).split(" ")) { if ((out[out.length - 1] + " " + p).trim().length > n) out.push(p); else out[out.length - 1] = (out[out.length - 1] + " " + p).trim(); }
  return out;
}
function descargarInsignia(x) {
  const nombre = perfil().nombreCompleto || "";
  const badge = insigniaSVG({ ...x, estado: "ganada", tam: 600, etiqueta: "" }).replace("<svg ", '<svg x="100" y="40" ');
  const titulo = lineas(nombreInsignia(x), 34);
  let y = 720;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" font-family="Roboto Flex, Roboto, Arial, sans-serif">` +
    `<rect width="800" height="1000" fill="var(--md-sys-color-surface)"/>${badge}` +
    titulo.map(l => { const t = textoSVG(400, y, l, 36, 650, "var(--md-sys-color-on-surface)"); y += 46; return t; }).join("") +
    (nombre ? textoSVG(400, y + 14, nombre, 30, 500, "var(--md-sys-color-on-surface)") : "") +
    textoSVG(400, y + (nombre ? 64 : 20), `Taller - IA${x.fecha ? ` | ${fechaLarga(x.fecha)}` : ""}`, 24, 400, "var(--md-sys-color-on-surface-variant)") +
    `</svg>`;
  svgAPng(svg, 800, 1000, `insignia-${x.id === "recorrido" ? "recorrido-completo" : "modulo-" + x.id}.png`);
}
function descargarCertificado(cert) {
  const total = datos.modulos.length, hechos = completados().length;
  const sello = insigniaSVG({ id: "recorrido", cinta: CINTA.recorrido, estado: "ganada", tam: 220, etiqueta: "" }).replace("<svg ", '<svg x="590" y="70" ');
  const cuerpo = lineas(`completó Taller - IA: usar la inteligencia artificial generativa con criterio, con ${hechos} de ${total} módulos y un proyecto final aplicado.`, 62);
  let y = 520;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1000" width="1400" height="1000" font-family="Roboto Flex, Roboto, Arial, sans-serif">` +
    `<rect width="1400" height="1000" fill="var(--md-sys-color-surface)"/>` +
    `<rect x="40" y="40" width="1320" height="920" rx="28" fill="none" stroke="var(--app-insignia-logro-accent)" stroke-width="6"/>` +
    `<rect x="62" y="62" width="1276" height="876" rx="20" fill="none" stroke="var(--app-insignia-logro-accent)" stroke-width="2"/>${sello}` +
    textoSVG(700, 350, "CERTIFICADO DE FINALIZACIÓN", 30, 650, "var(--app-insignia-logro-accent)") +
    textoSVG(700, 440, cert.nombre, 64, 500, "var(--md-sys-color-on-surface)") +
    cuerpo.map(l => { const t = textoSVG(700, y, l, 30, 400, "var(--md-sys-color-on-surface)"); y += 42; return t; }).join("") +
    textoSVG(700, y + 30, cert.fecha, 26, 400, "var(--md-sys-color-on-surface-variant)") +
    textoSVG(700, 800, "Lourdes Pedaci", 30, 650, "var(--md-sys-color-on-surface)") +
    textoSVG(700, 838, "Experience Designer, autora del taller", 22, 400, "var(--md-sys-color-on-surface-variant)") +
    textoSVG(700, 900, "Certificado del taller, emitido por su autora. No es un certificado de Anthropic, Google, OpenAI ni Microsoft, ni de una institución educativa.", 17, 400, "var(--md-sys-color-on-surface-variant)") +
    `</svg>`;
  svgAPng(svg, 1400, 1000, `certificado-taller-ia.png`);
}

/* ---------- Eventos ---------- */
let conectado = false;
export function conectarInsignias() {
  if (conectado) return; conectado = true;
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-insignia]"); if (b) { abrirInsignia(b.dataset.insignia); return; }
    const c = e.target.closest("[data-cert]"); if (!c) return;
    const cert = certificado(); if (!cert) return;
    if (c.dataset.cert === "descargar") descargarCertificado(cert);
    if (c.dataset.cert === "enviar") enviar(textoCertificado(cert));
  });
}
