/* Taller - IA | Markdown mínimo para el contenido de las lecciones
   Admite: párrafos, listas (- y 1.), **negrita**, *cursiva*, `código`,
   [enlaces](url), {{término del glosario}} y la etiqueta [en inglés] después de un enlace.
   Todo el texto se escapa antes de dar formato: el contenido nunca inserta HTML propio. */
import { esc, norm } from "../util.js";

function enLinea(t) {
  let s = esc(t);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // Términos del glosario: {{alucinación}} o {{texto visible|término}}
  s = s.replace(/\{\{([^}|]+)(?:\|([^}]+))?\}\}/g, (_, vis, term) => {
    const slug = norm(term || vis).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `<a class="term" href="#/glosario/${slug}">${vis}</a>`;
  });
  // Enlaces: los externos abren en otra pestaña y lo anuncian
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)(\s*\[en inglés\])?/g, (_, txt, url, ingles) => {
    const ext = /^https?:/.test(url);
    const seguro = /^(https?:|#)/.test(url) ? url : "#";
    return `<a href="${seguro}"${ext ? ' target="_blank" rel="noopener"' : ""}>${txt}${ext ? '<span class="sr-only"> (se abre en otra pestaña)</span>' : ""}</a>` +
      (ingles ? ' <span class="lang-tag" lang="es">En inglés</span>' : "");
  });
  return s;
}

/** Convierte el texto de una lección en HTML seguro */
export function md(texto) {
  const bloques = String(texto || "").replace(/\r/g, "").split(/\n{2,}/);
  return bloques.map(b => {
    const lineas = b.split("\n").filter(l => l.trim());
    if (!lineas.length) return "";
    if (lineas.every(l => /^\s*-\s+/.test(l))) return `<ul>${lineas.map(l => `<li>${enLinea(l.replace(/^\s*-\s+/, ""))}</li>`).join("")}</ul>`;
    if (lineas.every(l => /^\s*\d+\.\s+/.test(l))) return `<ol>${lineas.map(l => `<li>${enLinea(l.replace(/^\s*\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
    return `<p>${lineas.map(enLinea).join("<br>")}</p>`;
  }).join("");
}
