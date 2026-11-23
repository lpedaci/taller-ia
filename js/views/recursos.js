/* Taller - IA | Secciones transversales: Glosario, Biblioteca y Guía para facilitadores (D-062 a D-064)
   Cada vista carga su archivo de contenido, dibuja en el contenedor principal y devuelve título y foco. */
import { esc, qs, qsa, norm } from "../util.js";
import { icono, vacio } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { datos, leerJSON } from "../state.js";
import { href } from "../routes.js";

export const slugTermino = t => norm(t).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const cache = {};
const cargarJSON = ruta => (cache[ruta] ||= leerJSON(ruta).catch(e => { delete cache[ruta]; throw e; }));
/* La búsqueda y los filtros se conservan durante la sesión, para que Atrás devuelva la misma lista */
const sesion = {
  leer: k => { try { return JSON.parse(sessionStorage.getItem(`tia.${k}`)); } catch { return null; } },
  guardar: (k, v) => { try { sessionStorage.setItem(`tia.${k}`, JSON.stringify(v)); } catch { /* sin almacenamiento: no se recuerda */ } }
};
const enlaceModulo = id =>`<a href="${href("modulo", id)}">Módulo ${id}</a>`;
const sel = (id, etiqueta, opciones) => `<div class="tf"><label for="${id}">${etiqueta}</label><span class="sel"><select class="field" id="${id}"><option value="">Todos</option>` +
  opciones.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join("") + `</select><span class="ms tf-ic" aria-hidden="true">arrow_drop_down</span></span></div>`;

/* ===================== Glosario ===================== */
export async function glosario(main, args) {
  const { terminos } = await cargarJSON("content/glosario.json");
  const lista = terminos.slice().sort((a, b) => a.termino.localeCompare(b.termino, "es"));
  const letras = [...new Set(lista.map(t => norm(t.termino)[0].toUpperCase()))];
  main.innerHTML = `<div class="view-head"><div class="vh-txt"><h2 tabindex="-1" id="glT">Glosario</h2><p>${lista.length} términos del taller, con su original en inglés y una definición propia.</p></div></div>` +
    `<div class="card gl-buscar"><div class="tf"><label for="glQ">Buscar un término</label><input class="field" id="glQ" type="search" autocomplete="off" aria-describedby="glN"></div><p class="gl-n" id="glN" aria-live="polite"></p>` +
    `<nav class="gl-letras" aria-label="Ir a una letra">${letras.map(l => `<a href="#gl-${l}" data-letra="${l}">${l}</a>`).join("")}</nav></div>` +
    `<div class="gl-lista">${letras.map(l => `<section class="gl-grupo" data-letra="${l}" aria-labelledby="gl-${l}"><h3 id="gl-${l}" tabindex="-1">${l}</h3>` +
      lista.filter(t => norm(t.termino)[0].toUpperCase() === l).map(t => `<article class="gl-term" id="t-${slugTermino(t.termino)}" tabindex="-1" data-busca="${esc(norm([t.termino, t.original, t.definicion, ...(t.alias || [])].join(" ")))}">` +
        `<h4>${esc(t.termino)} <span class="gl-orig" lang="en">${esc(t.original)}</span></h4><p>${esc(t.definicion)}</p>` +
        (t.modulo != null ? `<p class="gl-mod">${icono("school", "sm")}<span>Se explica en el ${enlaceModulo(t.modulo)}</span></p>` : "") + `</article>`).join("") + `</section>`).join("")}</div>` +
    `<div class="gl-vacio" hidden>${vacio("No encontramos ese término", "Probá con otra palabra, en español o en inglés.")}</div>`;
  const q = qs("#glQ"), n = qs("#glN");
  const filtrar = () => {
    const v = norm(q.value.trim()); let total = 0;
    qsa(".gl-term").forEach(a => { const ok = !v || a.dataset.busca.includes(v); a.hidden = !ok; if (ok) total++; });
    qsa(".gl-grupo").forEach(g => { g.hidden = !qs(".gl-term:not([hidden])", g); });
    qsa(".gl-letras a").forEach(a => { a.hidden = !!v; });
    qs(".gl-vacio").hidden = total > 0;
    n.textContent = v ? (total === 1 ? "1 término" : `${total} términos`) : "";
  };
  q.addEventListener("input", () => { sesion.guardar("glosario", q.value); filtrar(); });
  // Un enlace directo a un término muestra la lista completa; si no, vuelve la última búsqueda
  if (args[0]) sesion.guardar("glosario", ""); else { q.value = sesion.leer("glosario") || ""; if (q.value) filtrar(); }
  qs(".gl-letras").addEventListener("click", e => { const a = e.target.closest("[data-letra]"); if (!a) return; e.preventDefault(); const h = qs(`#gl-${a.dataset.letra}`); h.scrollIntoView({ block: "start" }); h.focus({ preventScroll: true }); });
  // Enlace directo desde una lección: #/glosario/alucinacion (también por alias, como "tokens")
  let foco = "#glT";
  if (args[0]) {
    const buscado = args[0];
    const t = lista.find(x => slugTermino(x.termino) === buscado || (x.alias || []).some(a => slugTermino(a) === buscado));
    if (t) { foco = `#t-${slugTermino(t.termino)}`; requestAnimationFrame(() => { const el = qs(foco); el.classList.add("is-on"); el.scrollIntoView({ block: "center" }); }); }
  }
  return { titulo: "Glosario", foco };
}

/* ===================== Biblioteca ===================== */
const TIPOS = ["libro", "paper", "curso", "documentación", "normativa", "artículo", "video"];
const IDIOMA = { es: "Español", en: "Inglés" };
export async function biblioteca(main) {
  const { fuentes, actualizado } = await cargarJSON("content/fuentes.json");
  const bloques = datos.bloques;
  main.innerHTML = `<div class="view-head"><div class="vh-txt"><h2 tabindex="-1" id="biT">Biblioteca</h2><p>Todas las fuentes del taller, en formato APA 7, con una línea sobre por qué leer cada una.</p></div></div>` +
    `<form class="card bi-filtros" aria-label="Filtros de la Biblioteca" onsubmit="return false">` +
      sel("biB", "Bloque", bloques.map(b => [String(b.n), `Bloque ${b.n} | ${b.titulo}`])) +
      sel("biN", "Nivel", ["Inicial", "Profundización", "Técnica"].map(x => [x, x])) +
      sel("biI", "Idioma", Object.entries(IDIOMA)) +
      sel("biT2", "Tipo", TIPOS.filter(t => fuentes.some(f => f.tipo === t)).map(t => [t, t[0].toUpperCase() + t.slice(1)])) +
      `<div class="bi-pie"><p class="gl-n" id="biN2" aria-live="polite"></p><button class="btn btn-text" type="reset">${icono("filter_alt_off")}Quitar filtros</button></div></form>` +
    `<ul class="bi-lista">${fuentes.map((f, i) => `<li class="card bi-f" data-b="${f.bloques.join(" ")}" data-n="${esc(f.nivel)}" data-i="${f.idioma}" data-t="${esc(f.tipo)}">` +
      `<h3 id="bi-${i}">${esc(f.titulo)}</h3><p class="bi-porque">${esc(f.porque)}</p><div class="bi-apa">${md(f.apa)}</div>` +
      `<div class="bi-chips"><span class="chip chip-neutral">${esc(f.tipo[0].toUpperCase() + f.tipo.slice(1))}</span><span class="chip chip-neutral">${esc(f.nivel)}</span><span class="chip chip-neutral">${IDIOMA[f.idioma] || f.idioma}</span></div>` +
      `<p class="bi-mods">${icono("school", "sm")}<span>En ${f.modulos.map(enlaceModulo).join(", ")}</span></p>` +
      (f.url ? `<a class="btn btn-outlined bi-abrir" href="${esc(f.url)}" target="_blank" rel="noopener" aria-describedby="bi-${i}">${icono("open_in_new")}Abrir<span class="sr-only"> (se abre en otra pestaña)</span></a>` : `<p class="bi-sin">${icono("menu_book", "sm")}Libro: buscalo en tu biblioteca o librería.</p>`) +
      `</li>`).join("")}</ul>` +
    `<div class="gl-vacio" hidden>${vacio("No hay fuentes con esos filtros", "Probá quitando alguno.")}</div>` +
    `<p class="ml-fecha">${icono("event", "sm")}Enlaces revisados en ${esc(actualizado)}.</p>`;
  const f = qs(".bi-filtros"), n = qs("#biN2");
  const filtrar = () => {
    const b = qs("#biB").value, nv = qs("#biN").value, id = qs("#biI").value, t = qs("#biT2").value; let total = 0;
    qsa(".bi-f").forEach(li => { const ok = (!b || li.dataset.b.split(" ").includes(b)) && (!nv || li.dataset.n === nv) && (!id || li.dataset.i === id) && (!t || li.dataset.t === t); li.hidden = !ok; if (ok) total++; });
    qs(".gl-vacio").hidden = total > 0;
    n.textContent = total === 1 ? "1 fuente" : `${total} fuentes`;
  };
  const ids = ["biB", "biN", "biI", "biT2"];
  const guardar = () => sesion.guardar("biblioteca", Object.fromEntries(ids.map(i => [i, qs(`#${i}`).value])));
  const previos = sesion.leer("biblioteca") || {};
  ids.forEach(i => { const s = qs(`#${i}`); if (previos[i] && [...s.options].some(o => o.value === previos[i])) s.value = previos[i]; });
  f.addEventListener("change", () => { guardar(); filtrar(); });
  f.addEventListener("reset", () => setTimeout(() => { guardar(); filtrar(); }));
  filtrar();
  return { titulo: "Biblioteca", foco: "#biT" };
}

/* ===================== Guía para facilitadores ===================== */
export async function facilitadores(main, args) {
  const [guia, ...lecciones] = await Promise.all([cargarJSON("content/facilitadores.json"),
    ...datos.modulos.map(m => cargarJSON(`content/modulo-${String(m.id).padStart(2, "0")}.json`).catch(() => null))]);
  const objetivos = Object.fromEntries(datos.modulos.map((m, i) => [m.id, lecciones[i]?.objetivos || []]));
  const lista = arr => `<ul>${arr.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  main.innerHTML = `<div class="view-head"><div class="vh-txt"><h2 tabindex="-1" id="faT">Guía para facilitadores</h2><p>Cómo dar cada módulo como clase online sincrónica, individual o grupal.</p></div>` +
    `<button class="btn btn-outlined" type="button" data-imprimir-guia>${icono("print")}Imprimir la guía</button></div>` +
    `<div class="card fa-intro"><p>${esc(guia.general)}</p></div>` +
    datos.bloques.map(b => `<section class="fa-bloque" aria-labelledby="fa-b${b.n}"><h3 id="fa-b${b.n}">Bloque ${b.n} | ${esc(b.titulo)}</h3>` +
      datos.modulos.filter(m => m.bloque === b.n).map(m => { const g = guia.modulos[m.id]; if (!g) return "";
        return `<details class="guia fa-mod" id="fa-${m.id}"${String(args[0]) === String(m.id) ? " open" : ""}><summary>${icono("co_present", "sm")}<span>Módulo ${m.id} | ${esc(m.titulo)}</span></summary><div class="guia-cuerpo fa-cuerpo">` +
          `<p class="fa-dur">${icono("schedule", "sm")}<span><b>Duración sugerida:</b> ${g.individual} minutos en tutoría individual; ${g.grupal} minutos en grupo.</span></p>` +
          `<h4>Objetivos</h4>${lista(objetivos[m.id].map(o => o.texto))}` +
          `<h4>Secuencia de clase</h4><ul><li><b>Inicio:</b> ${esc(g.inicio)}</li><li><b>Desarrollo:</b> ${esc(g.desarrollo)}</li><li><b>Cierre:</b> ${esc(g.cierre)}</li></ul>` +
          `<h4>Preguntas para debatir</h4>${lista(g.preguntas)}` +
          `<h4>Dinámicas para clases online</h4>${lista(g.dinamicas)}` +
          `<h4>Para estudiantes del último año de escuela técnica</h4><p>${esc(g.tecnica)}</p>` +
          `<h4>Errores frecuentes</h4>${lista(g.errores)}` +
          (g.recursos ? `<h4>Recursos para proyectar</h4><ul>${g.recursos.map(r => `<li><a href="${esc(r.url)}" download>${esc(r.titulo)}</a>${r.subtitulos ? ` | <a href="${esc(r.subtitulos)}" download>subtítulos (.vtt)</a>` : ""}</li>`).join("")}</ul>` : "") +
          `<p class="fa-ir"><a class="btn btn-text" href="${href("modulo", m.id)}">${icono("arrow_forward")}Ver la lección</a></p></div></details>`; }).join("") + `</section>`).join("");
  qs("[data-imprimir-guia]").addEventListener("click", () => {
    const abiertos = qsa(".fa-mod").filter(d => !d.open); abiertos.forEach(d => { d.open = true; });
    document.body.classList.add("imprimiendo-guia");
    const fin = () => { document.body.classList.remove("imprimiendo-guia"); abiertos.forEach(d => { d.open = false; }); removeEventListener("afterprint", fin); };
    addEventListener("afterprint", fin); print(); setTimeout(fin, 1000);
  });
  if (args[0]) requestAnimationFrame(() => qs(`#fa-${args[0]}`)?.scrollIntoView({ block: "start" }));
  return { titulo: "Facilitadores", foco: args[0] ? `#fa-${args[0]} summary` : "#faT" };
}
