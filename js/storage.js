/* Taller - IA | Persistencia en el navegador
   localStorage con prefijo propio. Toda lectura y escritura va en try/catch:
   si el navegador bloquea el almacenamiento (modo privado, permisos), los
   datos quedan en memoria mientras la pestaña esté abierta. */

const PREFIJO = "tia.";
const memoria = new Map();
let disponible = true;

try {
  const k = PREFIJO + "__prueba";
  localStorage.setItem(k, "1");
  localStorage.removeItem(k);
} catch (e) {
  disponible = false;
}

export const store = {
  /** true si los datos se guardan entre visitas; false si solo viven en memoria */
  get persistente() { return disponible; },

  get(clave, porDefecto = null) {
    try {
      const v = localStorage.getItem(PREFIJO + clave);
      if (v === null) return memoria.has(clave) ? memoria.get(clave) : porDefecto;
      return JSON.parse(v);
    } catch (e) {
      return memoria.has(clave) ? memoria.get(clave) : porDefecto;
    }
  },

  set(clave, valor) {
    memoria.set(clave, valor);
    try { localStorage.setItem(PREFIJO + clave, JSON.stringify(valor)); return true; }
    catch (e) { disponible = false; return false; }
  },

  remove(clave) {
    memoria.delete(clave);
    try { localStorage.removeItem(PREFIJO + clave); } catch (e) { /* sin acceso */ }
  },

  /** Todas las claves del taller, sin prefijo */
  claves() {
    const set = new Set(memoria.keys());
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIJO)) set.add(k.slice(PREFIJO.length));
      }
    } catch (e) { /* sin acceso */ }
    return [...set];
  },

  /** Borra todos los datos del taller en este navegador */
  borrarTodo() {
    this.claves().forEach(k => this.remove(k));
    memoria.clear();
  }
};
