/* Taller - IA | Escuchar la lección con la voz del navegador (Web Speech API)
   Gratis y sin servidor. Elige una voz en español si existe; si no, lo avisa.
   Lee por oraciones para poder pausar, cambiar la velocidad y evitar cortes en textos largos. */

const sintesis = "speechSynthesis" in window ? window.speechSynthesis : null;
const PREFERIDAS = ["es-AR", "es-419", "es-US", "es-MX", "es-CL", "es-CO", "es-ES"];
export const VELOCIDADES = [1, 1.25, 1.5, 0.75];

export const disponible = () => !!sintesis;

function vozEspanol() {
  const voces = sintesis ? sintesis.getVoices() : [];
  for (const l of PREFERIDAS) { const v = voces.find(x => x.lang.replace("_", "-") === l); if (v) return v; }
  return voces.find(v => /^es/i.test(v.lang)) || null;
}
/** Espera la lista de voces (algunos navegadores la cargan tarde) */
export function vocesListas() {
  if (!sintesis) return Promise.resolve(null);
  if (sintesis.getVoices().length) return Promise.resolve(vozEspanol());
  return new Promise(res => {
    const t = setTimeout(() => res(vozEspanol()), 1500);
    sintesis.addEventListener("voiceschanged", () => { clearTimeout(t); res(vozEspanol()); }, { once: true });
  });
}

/** Lector: estado "detenido" | "leyendo" | "pausado" */
export function crearLector(alCambiar) {
  let frases = [], i = 0, velocidad = 1, estado = "detenido", voz = null, sesion = 0;
  const cambiar = e => { estado = e; alCambiar(estado, { frase: i, total: frases.length, velocidad }); };

  function decir(s) {
    if (s !== sesion || i >= frases.length) { if (s === sesion) cambiar("detenido"); return; }
    const u = new SpeechSynthesisUtterance(frases[i]);
    u.lang = voz ? voz.lang : "es-AR"; if (voz) u.voice = voz;
    u.rate = velocidad;
    u.onend = () => { if (s !== sesion || estado !== "leyendo") return; i++; decir(s); };
    u.onerror = e => { if (s === sesion && e.error !== "interrupted" && e.error !== "canceled") cambiar("detenido"); };
    sintesis.speak(u);
  }
  return {
    get estado() { return estado; },
    get velocidad() { return velocidad; },
    async leer(texto) {
      if (!sintesis) return { ok: false, motivo: "Tu navegador no puede leer en voz alta. Probá con Chrome, Edge o Safari." };
      voz = await vocesListas();
      sintesis.cancel(); sesion++;
      frases = String(texto).replace(/\s+/g, " ").match(/[^.!?:;]+[.!?:;]*/g)?.map(f => f.trim()).filter(Boolean) || [];
      i = 0; cambiar("leyendo"); decir(sesion);
      return { ok: true, sinVozEs: !voz };
    },
    pausar() { if (estado !== "leyendo") return; sesion++; sintesis.cancel(); cambiar("pausado"); },
    reanudar() { if (estado !== "pausado") return; cambiar("leyendo"); decir(sesion); },
    detener() { sesion++; if (sintesis) sintesis.cancel(); i = 0; if (estado !== "detenido") cambiar("detenido"); },
    /** Pasa a la velocidad siguiente; si está leyendo, sigue desde la misma frase */
    otraVelocidad() {
      velocidad = VELOCIDADES[(VELOCIDADES.indexOf(velocidad) + 1) % VELOCIDADES.length];
      if (estado === "leyendo") { sesion++; sintesis.cancel(); decir(sesion); }
      alCambiar(estado, { frase: i, total: frases.length, velocidad });
      return velocidad;
    }
  };
}
