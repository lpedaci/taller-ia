/* Taller - IA | Animación 5: qué pasa con los datos cuando los cargás en una IA
   Guion: animaciones/guiones/05-datos-al-cargar.md. Textos: content/animaciones/datos-carga.json. */
import { proceso } from "./kit.js";

export const escenas = proceso({
  nodos: [
    { id: "vos", ic: "person", t: "Vos", sub: "escribís o adjuntás", h: [0.1, 0.3], v: [0.26, 0.12] },
    { id: "nube", ic: "cloud", t: "Servidores", sub: "de la empresa", h: [0.32, 0.3], v: [0.74, 0.12] },
    { id: "guarda", ic: "database", t: "Se guarda", sub: "un tiempo", h: [0.54, 0.3], v: [0.74, 0.37] },
    { id: "entrena", ic: "model_training", t: "Puede entrenar", sub: "si no lo desactivás", tipo: "alerta", h: [0.8, 0.18], v: [0.74, 0.62] },
    { id: "revisa", ic: "visibility", t: "Puede leerlo", sub: "una persona", tipo: "alerta", h: [0.8, 0.52], v: [0.26, 0.62] },
    { id: "antes", ic: "shield_person", t: "Antes de cargar", sub: "anonimizá y revisá", tipo: "persona", h: [0.1, 0.62], v: [0.26, 0.37] }
  ],
  aristas: [
    { id: "a1", de: "vos", a: "nube" }, { id: "a2", de: "nube", a: "guarda" },
    { id: "a3", de: "guarda", a: "entrena" }, { id: "a4", de: "guarda", a: "revisa" },
    { id: "a5", de: "antes", a: "vos", clase: "an-fl-ciclo" }
  ],
  escenas: [
    { nuevos: ["vos", "a1", "nube"], viajes: ["a1"] },
    { nuevos: ["a2", "guarda"], viajes: ["a2"], resalta: ["guarda"] },
    { nuevos: ["a3", "entrena", "a4", "revisa"], viajes: ["a3", "a4"] },
    { nuevos: ["antes", "a5"], resalta: ["antes"] }
  ]
});
