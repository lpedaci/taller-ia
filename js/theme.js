/* Taller - IA | Tema (automático, claro u oscuro) y contraste (estándar, medio o alto)
   El esquema de color sale de css/tokens.css con los atributos data-theme y data-contrast. */
import { store } from "./storage.js";

const mq = matchMedia("(prefers-color-scheme: dark)");
const oyentes = new Set();

export const tema = {
  get preferencia() { return store.get("tema", "system"); },
  get contraste() { return store.get("contraste", "standard"); },
  /** Modo efectivo: "light" o "dark" */
  get modo() { return document.documentElement.getAttribute("data-theme") || "light"; },

  aplicar() {
    const pref = this.preferencia;
    const modo = pref === "system" ? (mq.matches ? "dark" : "light") : pref;
    document.documentElement.setAttribute("data-theme", modo);
    document.documentElement.setAttribute("data-contrast", this.contraste);
    oyentes.forEach(fn => fn(modo));
  },
  setPreferencia(v) {
    if (!["system", "light", "dark"].includes(v)) return;
    store.set("tema", v); this.aplicar();
  },
  setContraste(v) {
    if (!["standard", "medium", "high"].includes(v)) return;
    store.set("contraste", v); this.aplicar();
  },
  /** Botón de la barra superior: alterna entre claro y oscuro */
  alternar() { this.setPreferencia(this.modo === "dark" ? "light" : "dark"); },
  alCambiar(fn) { oyentes.add(fn); }
};

mq.addEventListener("change", () => { if (tema.preferencia === "system") tema.aplicar(); });
