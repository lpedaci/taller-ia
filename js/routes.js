/* Taller - IA | Destinos de navegación y lectura del hash (#/seccion/parametros) */

/** g: grupo del riel (top = Inicio, main = Aprender, res = Recursos, sup = Soporte) */
export const RUTAS = {
  inicio: { t: "Inicio", s: "Tu panel de aprendizaje", ic: "home", g: "top" },
  recorrido: { t: "Mi recorrido", s: "21 módulos en 7 bloques", ic: "route", g: "main", corto: "Recorrido" },
  agenda: { t: "Agenda", s: "Fechas, entregas y encuentros", ic: "calendar_month", g: "main" },
  aprendizaje: { t: "Mi aprendizaje", s: "Competencias, evidencias y objetivos", ic: "insights", g: "main", corto: "Aprendizaje" },
  biblioteca: { t: "Biblioteca", s: "Autores, documentación y normativa", ic: "local_library", g: "res" },
  prompts: { t: "Mis prompts", s: "Tu biblioteca personal de prompts", ic: "bookmarks", g: "res" },
  glosario: { t: "Glosario", s: "Términos con su original en inglés", ic: "menu_book", g: "res" },
  facilitadores: { t: "Facilitadores", s: "Guía para dar cada módulo en clase", ic: "co_present", g: "res" },
  ayuda: { t: "Ayuda", s: "Cómo usar el entorno", ic: "help", g: "sup" },
  ajustes: { t: "Ajustes y accesibilidad", s: "Tema, contraste, movimiento y datos", ic: "tune", g: "sup", corto: "Ajustes" },
  // Destino sin entrada propia en la navegación: pertenece a Mi recorrido
  modulo: { t: "Módulo", s: "", ic: "school", g: "main", oculto: true, padre: "recorrido" }
};

export const GRUPOS = [
  { g: "main", t: "Aprender", ic: "school" },
  { g: "res", t: "Recursos", ic: "library_books" },
  { g: "sup", t: "Soporte", ic: "support" }
];

export const destinos = g => Object.keys(RUTAS).filter(k => RUTAS[k].g === g && !RUTAS[k].oculto);

/** Lee el hash actual. Acepta "#/agenda/semana" y también el formato del prototipo ("#agenda-semana"). */
export function leerHash(hash = location.hash) {
  let h = (hash || "").replace(/^#\/?/, "");
  if (!h) return { id: "inicio", args: [] };
  const partes = h.includes("/") ? h.split("/") : h.split("-");
  const id = partes[0] === "preferencias" ? "ajustes" : partes[0];
  if (!RUTAS[id]) return { id: "inicio", args: [], desconocida: h };
  return { id, args: partes.slice(1).filter(Boolean) };
}

export const href = (id, ...args) => "#/" + [id, ...args].join("/");
