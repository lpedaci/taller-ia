/* Taller - IA | Animación 9: un flujo de automatización con revisión humana
   Guion: animaciones/guiones/09-flujo-con-revision.md. Textos: content/animaciones/flujo-revision.json. */
import { proceso } from "./kit.js";

export const escenas = proceso({
  nodos: [
    { id: "disp", ic: "bolt", t: "Disparador", sub: "llega una inscripción", h: [0.1, 0.3], v: [0.26, 0.12] },
    { id: "plan", ic: "table_chart", t: "Acción", sub: "va a la planilla", h: [0.32, 0.3], v: [0.74, 0.12] },
    { id: "ia", ic: "auto_awesome", t: "La IA redacta", sub: "la bienvenida", tipo: "ia", h: [0.54, 0.3], v: [0.74, 0.37] },
    { id: "rev", ic: "person_check", t: "Revisás vos", sub: "antes de enviar", tipo: "persona", h: [0.76, 0.3], v: [0.26, 0.37] },
    { id: "env", ic: "send", t: "Se envía", sub: "a la persona", h: [0.76, 0.64], v: [0.26, 0.62] },
    { id: "corr", ic: "edit", t: "Corregís", sub: "si algo está mal", tipo: "alerta", h: [0.54, 0.64], v: [0.74, 0.62] }
  ],
  aristas: [
    { id: "a1", de: "disp", a: "plan" }, { id: "a2", de: "plan", a: "ia" }, { id: "a3", de: "ia", a: "rev" },
    { id: "a4", de: "rev", a: "env", etiqueta: "bien" }, { id: "a5", de: "rev", a: "corr", etiqueta: "mal" },
    { id: "a6", de: "corr", a: "ia", clase: "an-fl-ciclo", etiqueta: "vuelve" }
  ],
  escenas: [
    { nuevos: ["disp", "a1", "plan"], viajes: ["a1"] },
    { nuevos: ["a2", "ia"], viajes: ["a2"], resalta: ["ia"] },
    { nuevos: ["a3", "rev", "a4", "env"], viajes: ["a3", "a4"], resalta: ["rev"] },
    { nuevos: ["a5", "corr", "a6"], viajes: ["a5", "a6", "a3", "a4"] }
  ]
});
