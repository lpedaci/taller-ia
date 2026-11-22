/* Taller - IA | Animación 8: RAG, buscar en documentos y responder con fuentes
   Guion: animaciones/guiones/08-rag.md. Textos: content/animaciones/rag.json. */
import { proceso, debajo } from "./kit.js";

export const escenas = proceso({
  nodos: [
    { id: "preg", ic: "help", t: "Tu pregunta", sub: "licencia por estudio", h: [0.1, 0.3], v: [0.26, 0.12] },
    { id: "busca", ic: "manage_search", t: "Busca", sub: "en tus documentos", h: [0.32, 0.3], v: [0.26, 0.37] },
    { id: "docs", ic: "description", t: "Fragmentos", sub: "pág. 4 y pág. 7", h: [0.54, 0.3], v: [0.26, 0.62] },
    { id: "modelo", ic: "psychology", t: "El modelo", sub: "responde con eso", tipo: "ia", h: [0.76, 0.3], v: [0.74, 0.62] },
    { id: "resp", ic: "format_quote", t: "Respuesta", sub: "con sus fuentes", tipo: "persona", h: [0.76, 0.64], v: [0.74, 0.37] },
    { id: "sin", ic: "warning", t: "Sin buscar", sub: "lo más probable", tipo: "alerta", h: [0.32, 0.64], v: [0.74, 0.12] }
  ],
  aristas: [
    { id: "a1", de: "preg", a: "busca" }, { id: "a2", de: "busca", a: "docs" }, { id: "a3", de: "docs", a: "modelo" },
    { id: "a4", de: "modelo", a: "resp" }, { id: "a5", de: "preg", a: "sin", etiqueta: "sin RAG" }
  ],
  escenas: [
    { nuevos: ["preg"], resalta: ["preg"], extra: (svg, { W, d }, o) => debajo(svg, o.preg, W, d.pregunta, 0.3) },
    { nuevos: ["a1", "busca", "a2", "docs"], viajes: ["a1", "a2"], resalta: ["docs"] },
    { nuevos: ["a3", "modelo", "a4", "resp"], viajes: ["a3", "a4"], resalta: ["resp"] },
    { nuevos: ["a5", "sin"], viajes: ["a5"] }
  ]
});
