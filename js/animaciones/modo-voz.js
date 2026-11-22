/* Taller - IA | Animación 10: cómo funciona el modo de voz (voz, texto, modelo, texto y voz de nuevo)
   Guion: animaciones/guiones/10-modo-de-voz.md. Textos: content/animaciones/modo-voz.json.
   Lienzo horizontal: los cinco pasos en fila. Vertical (mobile y columna de la lección): un ciclo en sentido horario. */
import { proceso, pulso, debajo } from "./kit.js";

export const escenas = proceso({
  nodos: [
    { id: "voz", w: 270, wv: 300, ic: "mic", t: "Hablás", h: [0.12, 0.34], v: [0.26, 0.12] },
    { id: "stt", w: 270, wv: 300, ic: "subject", t: "Se transcribe", sub: "voz a texto", h: [0.31, 0.34], v: [0.74, 0.12] },
    { id: "modelo", w: 270, wv: 300, ic: "psychology", t: "El modelo", sub: "responde en texto", tipo: "ia", h: [0.5, 0.34], v: [0.74, 0.37] },
    { id: "resp", w: 270, wv: 300, ic: "notes", t: "Respuesta", sub: "en texto", h: [0.69, 0.34], v: [0.74, 0.62] },
    { id: "tts", w: 270, wv: 300, ic: "volume_up", t: "Voz sintética", sub: "texto a voz", h: [0.88, 0.34], v: [0.26, 0.62] }
  ],
  aristas: [
    { id: "a1", de: "voz", a: "stt" }, { id: "a2", de: "stt", a: "modelo" }, { id: "a3", de: "modelo", a: "resp" },
    { id: "a4", de: "resp", a: "tts" }, { id: "vuelta", de: "tts", a: "voz", curva: 200, curvaV: 0, clase: "an-fl-ciclo", etiqueta: "podés interrumpir" }
  ],
  escenas: [
    { nuevos: ["voz"], extra: (svg, { W }, o) => pulso(svg, o.voz, W, 0.1) },
    { nuevos: ["a1", "stt"], viajes: ["a1"], extra: (svg, { W, d }, o) => debajo(svg, o.stt, W, d.dicho, 0.62) },
    { nuevos: ["a2", "modelo", "a3", "resp"], viajes: ["a2", "a3"], resalta: ["modelo"], extra: (svg, { W, d }, o) => debajo(svg, o.resp, W, d.respuesta, 0.85) },
    { nuevos: ["a4", "tts", "vuelta"], viajes: ["a4"], extra: (svg, { W }, o) => pulso(svg, o.tts, W, 0.3) }
  ]
});
