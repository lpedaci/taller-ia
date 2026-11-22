/* Taller - IA | Animación 4: el marco 4D y el ciclo entre descripción y discernimiento
   Guion: animaciones/guiones/04-marco-4d-y-ciclo.md. Textos: content/animaciones/ciclo-4d.json. */
import { proceso } from "./kit.js";

export const escenas = proceso({
  nodos: [
    { id: "dele", ic: "assignment_ind", t: "Delegación", sub: "¿va con IA?", h: [0.11, 0.44], v: [0.5, 0.16] },
    { id: "desc", ic: "edit_note", t: "Descripción", sub: "el pedido", h: [0.33, 0.25], v: [0.26, 0.41] },
    { id: "resp", ic: "chat", t: "Respuesta", sub: "de la IA", tipo: "ia", h: [0.58, 0.25], v: [0.74, 0.41] },
    { id: "disc", ic: "fact_check", t: "Discernimiento", sub: "¿sirve?", h: [0.58, 0.62], v: [0.74, 0.66] },
    { id: "listo", ic: "check_circle", t: "Sirve", sub: "se usa", tipo: "persona", h: [0.84, 0.62], v: [0.26, 0.66] }
  ],
  aristas: [
    { id: "e1", de: "dele", a: "desc" }, { id: "e2", de: "desc", a: "resp" }, { id: "e3", de: "resp", a: "disc" },
    { id: "e4", de: "disc", a: "desc", curva: 60, curvaV: 0, clase: "an-fl-ciclo", etiqueta: "ajustás el pedido", etiquetaV: "ajustás" },
    { id: "e5", de: "disc", a: "listo", etiqueta: "sí" }
  ],
  marcos: [{ id: "dil", ids: ["dele", "desc", "resp", "disc", "listo"], t: "Diligencia: responsabilidad en todo el proceso" }],
  escenas: [
    { nuevos: ["dele"], resalta: ["dele"] },
    { nuevos: ["e1", "desc", "e2", "resp"], viajes: ["e1", "e2"] },
    { nuevos: ["e3", "disc", "e4"], viajes: ["e3", "e4", "e2", "e3", "e4", "e2"], resalta: ["disc"] },
    { nuevos: ["e5", "listo", "dil"], viajes: ["e5"] }
  ]
});
