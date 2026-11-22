/* Taller - IA | Animación 7: cómo funciona un agente (planificar, usar herramientas, verificar)
   Guion: animaciones/guiones/07-agente.md. Textos: content/animaciones/agente.json. */
import { proceso } from "./kit.js";

export const escenas = proceso({
  nodos: [
    { id: "obj", ic: "flag", t: "Objetivo", sub: "lo que le pedís", h: [0.1, 0.3], v: [0.26, 0.12] },
    { id: "plan", ic: "checklist", t: "Planifica", sub: "divide en pasos", tipo: "ia", h: [0.32, 0.3], v: [0.74, 0.12] },
    { id: "act", ic: "build", t: "Usa herramientas", sub: "busca, lee, ejecuta", tipo: "ia", h: [0.56, 0.3], v: [0.74, 0.37] },
    { id: "obs", ic: "visibility", t: "Mira el resultado", sub: "¿qué falta?", tipo: "ia", h: [0.56, 0.64], v: [0.26, 0.37] },
    { id: "ver", ic: "fact_check", t: "Verifica", sub: "y entrega", tipo: "ia", h: [0.82, 0.64], v: [0.26, 0.62] },
    { id: "vos", ic: "person_check", t: "Revisás vos", sub: "antes de usarlo", tipo: "persona", h: [0.82, 0.3], v: [0.74, 0.62] }
  ],
  aristas: [
    { id: "a1", de: "obj", a: "plan" }, { id: "a2", de: "plan", a: "act" }, { id: "a3", de: "act", a: "obs" },
    { id: "a4", de: "obs", a: "plan", curva: -40, curvaV: 0, clase: "an-fl-ciclo", etiqueta: "otra vuelta", etiquetaV: "otra vez" },
    { id: "a5", de: "obs", a: "ver" }, { id: "a6", de: "ver", a: "vos" }
  ],
  escenas: [
    { nuevos: ["obj", "a1", "plan"], viajes: ["a1"] },
    { nuevos: ["a2", "act"], viajes: ["a2"], resalta: ["act"] },
    { nuevos: ["a3", "obs", "a4"], viajes: ["a3", "a4", "a2", "a3", "a4", "a2"] },
    { nuevos: ["a5", "ver", "a6", "vos"], viajes: ["a5", "a6"], resalta: ["vos"] }
  ]
});
