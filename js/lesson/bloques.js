/* Taller - IA | Bloques de contenido de una lección
   Cada paso de una lección es una lista de bloques ({ "tipo": "...", ... }).
   Los tipos se registran acá; las actividades, los videos, los gráficos y las
   animaciones se suman con registrar() desde sus propios archivos. */
import { esc } from "../util.js";
import { icono } from "../ui.js";
import { md } from "./markdown.js";

const tipos = new Map();
let contador = 0;

/** Registra un tipo de bloque: render(bloque, ctx) devuelve HTML; montar(el, bloque, ctx) agrega el comportamiento */
export function registrar(tipo, def) { tipos.set(tipo, def); }

/** Dibuja la lista de bloques de un paso y devuelve las funciones para montarlos */
export function dibujar(bloques, ctx) {
  const montajes = [];
  const html = (bloques || []).map(b => {
    const def = tipos.get(b.tipo);
    const id = "b" + (++contador);
    if (!def) return `<div class="status status-warning">${icono("warning")}<span><b>Bloque sin diseño todavía</b>El tipo "${esc(b.tipo)}" se construye más adelante.</span></div>`;
    if (def.montar) montajes.push(() => { const el = document.getElementById(id); if (el) def.montar(el, b, ctx); });
    return `<div class="blk blk-${esc(b.tipo)}" id="${id}">${def.render(b, ctx)}</div>`;
  }).join("");
  return { html, montar: () => montajes.forEach(f => f()) };
}

/* ---------- Tipos básicos ---------- */
registrar("texto", { render: b => `<div class="lesson-text">${md(b.md)}</div>` });

const ESTADOS = { info: "info", atencion: "warning", positivo: "check_circle", error: "error" };
const CLASES = { info: "status-info", atencion: "status-warning", positivo: "status-success", error: "status-error" };
registrar("nota", {
  render: b => `<div class="status ${CLASES[b.estado] || "status-info"}" role="note">${icono(ESTADOS[b.estado] || "info")}<div>${b.titulo ? `<b>${esc(b.titulo)}</b>` : ""}${md(b.md)}</div></div>`
});

registrar("objetivos", {
  render: (b, ctx) => `<div class="lesson-goals"><h4>${esc(b.titulo || "Al terminar este módulo vas a poder:")}</h4><ul>${(ctx.leccion.objetivos || []).map(o => `<li>${icono("flag", "sm")}<span>${esc(o.texto)}</span></li>`).join("")}</ul></div>`
});

/* Cita traducida: español arriba, original abajo en chico y con su idioma, etiqueta de traducción y referencia APA */
registrar("cita", {
  render: b => {
    const idioma = b.idioma || "inglés", lang = b.lang || "en";
    const etiqueta = b.traduccion === "oficial" ? "Traducción oficial" : `Traducción propia del ${idioma}`;
    return `<figure class="cita-tr"><blockquote class="cita-es"><p>${esc(b.es)}</p></blockquote>` +
      (b.original ? `<blockquote class="cita-orig" lang="${esc(lang)}"><p>${esc(b.original)}</p></blockquote>` : "") +
      `<figcaption><span class="chip chip-neutral">${icono("translate")}${etiqueta}</span><cite>${md(b.referencia).replace(/^<p>|<\/p>$/g, "")}</cite></figcaption></figure>`;
  }
});

/* Para profundizar: de 1 a 3 enlaces a fuentes oficiales, con su idioma y nivel */
registrar("profundizar", {
  render: b => `<section class="deeper" aria-label="Para profundizar"><h4>${icono("menu_book", "sm")}Para profundizar</h4><ul class="list">` +
    (b.fuentes || []).map(f => `<li><a class="list-item" href="${esc(f.url)}" target="_blank" rel="noopener"><span class="li-lead-ic">${icono(f.tipo === "video" ? "smart_display" : "description")}</span>` +
      `<span class="li-text"><span class="li-head">${esc(f.titulo)}</span><span class="li-sup">${esc(f.apa || "")}</span>` +
      `<span class="deeper-tags">${f.idioma === "en" ? '<span class="lang-tag">En inglés</span>' : ""}${f.nivel ? `<span class="chip chip-neutral">${esc(f.nivel)}</span>` : ""}</span></span>` +
      `<span class="li-trail">${icono("open_in_new")}<span class="sr-only">(se abre en otra pestaña)</span></span></a></li>`).join("") + `</ul></section>`
});
