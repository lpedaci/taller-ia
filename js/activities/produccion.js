/* Taller - IA | Actividades de producción: constructor guiado (prompt, prompt visual y brief),
   reflexión para el diario, comparador antes y después, tabla comparativa editable,
   constructor de flujos, storyboard por escenas y mapa de impactos.
   Lo que la persona escribe se guarda como borrador mientras escribe. */
import { esc, qs, qsa } from "../util.js";
import { icono, aviso, descargar } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar } from "../lesson/bloques.js";
import { guardarDiario, guardarPrompt } from "../state.js";
import { marco, idDe, leer, esPrueba, guardarResultado, guardarParcial, mostrarFeedback, acciones, boton, demorar, copiar } from "./comun.js";

/* Asistentes para "Abrir en": enlaces a la web, sin API (verificados el 2026-11-18).
   En la etapa 6 pasan a content/herramientas.json. */
const ASISTENTES = [
  { n: "Claude", url: "https://claude.ai/new" },
  { n: "ChatGPT", url: "https://chatgpt.com/" },
  { n: "Gemini", url: "https://gemini.google.com/app" },
  { n: "Copilot", url: "https://copilot.com/" }
];
const fid = (ctx, b, x) => esc(`${idDe(ctx, b)}-${x}`);

/* ===================== Constructor guiado: prompt, prompt visual o brief ===================== */
function armar(b, valores) {
  if (b.plantilla) {
    return b.plantilla.split("\n").map(linea => {
      const claves = [...linea.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
      if (claves.length && claves.every(k => !(valores[k] || "").trim())) return null; // línea sin datos: se omite
      return linea.replace(/\{(\w+)\}/g, (_, k) => (valores[k] || "").trim());
    }).filter(l => l !== null).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  return b.campos.filter(c => (valores[c.id] || "").trim()).map(c => `${c.etiqueta}: ${valores[c.id].trim()}`).join("\n\n");
}
registrar("constructor", {
  render: (b, ctx) => {
    const salida = b.salida || (b.modo === "brief" ? "Tu brief" : b.modo === "visual" ? "Tu prompt visual" : "Tu prompt");
    return marco("constructor", b, ctx,
      `<div class="con-campos">${b.campos.map(c => `<div class="tf"><label for="${fid(ctx, b, c.id)}">${esc(c.etiqueta)}${c.obligatorio ? "" : ' <span class="opc">(opcional)</span>'}</label>` +
        (c.opciones
          // Campo con opciones: desplegable del design system (D-042)
          ? `<span class="sel"><select class="field" id="${fid(ctx, b, c.id)}" data-campo="${esc(c.id)}" aria-describedby="${fid(ctx, b, c.id)}-h"><option value="">Elegí una opción</option>${c.opciones.map(o => `<option>${esc(o)}</option>`).join("")}</select><span class="ms tf-ic" aria-hidden="true">arrow_drop_down</span></span>`
          : `<textarea class="field" id="${fid(ctx, b, c.id)}" data-campo="${esc(c.id)}" rows="${c.multilinea ? 3 : 1}" aria-describedby="${fid(ctx, b, c.id)}-h"></textarea>`) +
        `<span class="tf-help" id="${fid(ctx, b, c.id)}-h">${esc(c.ayuda || "")}${c.ejemplo ? ` Por ejemplo: ${esc(c.ejemplo)}` : ""}</span></div>`).join("")}</div>` +
      acciones(boton("limpiar", "Vaciar", "btn-text", "backspace"), boton("ejemplo", "Completar con el ejemplo", "btn-text", "auto_fix_high")) +
      `<div class="con-salida"><div class="con-salida-head"><h5 id="${fid(ctx, b, "out")}">${salida}</h5><span class="chip chip-neutral con-cuenta"></span></div>` +
      `<pre class="con-texto" aria-labelledby="${fid(ctx, b, "out")}" tabindex="0"></pre></div>` +
      (b.modo === "brief" || b.descargar
        // Brief: la acción principal es descargarlo
        ? acciones(boton("copiar", "Copiar", "btn-tonal", "content_copy"), boton("descargar", "Descargar (.md)", "btn-filled", "download"))
        // Prompt: abrir en un asistente es secundario; copiar es la acción principal
        : acciones(`<div class="con-abrir" role="group" aria-label="Copiar y abrir en un asistente">${ASISTENTES.map(a => `<a class="btn btn-outlined" href="${a.url}" target="_blank" rel="noopener" data-abrir>${a.n}<span class="sr-only"> (copia el texto y se abre en otra pestaña)</span>${icono("open_in_new")}</a>`).join("")}</div>`, boton("copiar", "Copiar", "btn-filled", "content_copy"))) +
      (b.modo !== "brief" ? `<details class="con-guardar"><summary>${icono("bookmark_add", "sm")}Guardar en Mis prompts</summary>` +
        `<div class="con-guardar-in"><div class="tf"><label for="${fid(ctx, b, "nom")}">Nombre</label><input class="field" id="${fid(ctx, b, "nom")}" autocomplete="off"></div>` +
        `<div class="tf"><label for="${fid(ctx, b, "tags")}">Etiquetas <span class="opc">(separadas por coma)</span></label><input class="field" id="${fid(ctx, b, "tags")}" autocomplete="off"></div>` +
        boton("guardar", "Guardar", "btn-tonal", "bookmark") + `</div></details>` : ""));
  },
  montar(el, b, ctx) {
    const valores = { ...(leer(ctx, b)?.respuesta || {}) };
    const salida = qs(".con-texto", el), cuenta = qs(".con-cuenta", el);
    const guardarB = demorar(() => guardarParcial(ctx, b, valores));
    const actualizar = () => {
      const t = armar(b, valores);
      salida.textContent = t || "Completá los campos y acá se arma el texto.";
      salida.classList.toggle("is-empty", !t);
      cuenta.textContent = `${t.split(/\s+/).filter(Boolean).length} palabras`;
      return t;
    };
    qsa("[data-campo]", el).forEach(c => { c.value = valores[c.dataset.campo] || ""; });
    actualizar();
    el.addEventListener("input", e => { const c = e.target.closest("[data-campo]"); if (!c) return; valores[c.dataset.campo] = c.value; actualizar(); guardarB(); });
    el.addEventListener("click", async e => {
      const ab = e.target.closest("[data-abrir]");
      if (ab) { const t = actualizar(); if (t) { await copiar(t); aviso("Copiamos el texto: pegalo en el chat que se abrió."); } return; }
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
      const t = actualizar();
      if (a === "ejemplo") { b.campos.forEach(c => { if (c.ejemplo) { valores[c.id] = c.ejemplo; qs(`[data-campo="${c.id}"]`, el).value = c.ejemplo; } }); actualizar(); guardarB(); }
      if (a === "limpiar") { b.campos.forEach(c => { valores[c.id] = ""; qs(`[data-campo="${c.id}"]`, el).value = ""; }); actualizar(); guardarB(); qs("[data-campo]", el).focus(); }
      if (a === "copiar") { if (!t) { mostrarFeedback(el, "info", "Todavía no hay texto para copiar."); return; } aviso(await copiar(t) ? "Copiado al portapapeles" : "No se pudo copiar. Seleccioná el texto y copialo a mano."); }
      if (a === "descargar") { if (!t) { mostrarFeedback(el, "info", "Completá los campos antes de descargar."); return; } descargar(`${(b.archivo || "brief")}.md`, `# ${b.titulo || "Brief"}\n\n${t}\n`, "text/markdown"); }
      if (a === "guardar") {
        const falta = b.campos.find(c => c.obligatorio && !(valores[c.id] || "").trim());
        if (falta) { mostrarFeedback(el, "info", `Completá "${falta.etiqueta}" para guardar.`); qs(`[data-campo="${falta.id}"]`, el).focus(); return; }
        const nombre = qs(`#${CSS.escape(idDe(ctx, b))}-nom`, el).value.trim() || b.titulo || "Prompt sin nombre";
        const etiquetas = qs(`#${CSS.escape(idDe(ctx, b))}-tags`, el).value.split(",").map(x => x.trim()).filter(Boolean);
        if (!esPrueba(ctx)) guardarPrompt({ id: "p-" + idDe(ctx, b), nombre, etiquetas, texto: t, modulo: ctx.meta.id, origen: b.modo || "prompt" });
        guardarResultado(ctx, b, { resultado: "hecho", respuesta: valores });
        mostrarFeedback(el, "hecho", esPrueba(ctx) ? "Listo (en la lección de prueba no se guarda)" : `Guardado en Mis prompts como "${nombre}"`, `<p>Lo encontrás en <a href="#/prompts">Mis prompts</a>.</p>`);
      }
    });
  }
});

/* ===================== Reflexión para el diario ===================== */
registrar("reflexion", {
  render: (b, ctx) => marco("reflexion", b, ctx,
    `<div class="tf"><label for="${fid(ctx, b, "r")}">${esc(b.pregunta)}</label><textarea class="field" id="${fid(ctx, b, "r")}" rows="5" aria-describedby="${fid(ctx, b, "rh")}"></textarea>` +
    `<span class="tf-help" id="${fid(ctx, b, "rh")}">${esc(b.ayuda || "Escribí con tus palabras. Se guarda solo en este navegador.")}</span></div>` +
    acciones(boton("guardar", "Guardar en mi diario", "btn-filled", "bookmark"))),
  montar(el, b, ctx) {
    const ta = qs("textarea", el), previo = leer(ctx, b);
    ta.value = previo?.respuesta || "";
    const guardarB = demorar(() => guardarParcial(ctx, b, ta.value));
    ta.addEventListener("input", guardarB);
    el.addEventListener("click", e => {
      if (e.target.closest("[data-a]")?.dataset.a !== "guardar") return;
      const t = ta.value.trim(), min = b.minimo || 20;
      if (t.length < min) { mostrarFeedback(el, "info", "Escribí un poco más para guardar", `<p>Con una o dos oraciones alcanza (al menos ${min} caracteres).</p>`); ta.focus(); return; }
      if (!esPrueba(ctx)) guardarDiario(idDe(ctx, b), ctx.meta.id, b.pregunta, t);
      guardarResultado(ctx, b, { resultado: "hecho", respuesta: t });
      mostrarFeedback(el, "hecho", esPrueba(ctx) ? "Listo (en la lección de prueba no se guarda en el diario)" : "Guardado en tu diario de aprendizaje", "<p>Podés volver a editarlo cuando quieras: se reemplaza la versión anterior.</p>");
    });
  }
});

/* ===================== Comparador antes y después ===================== */
registrar("comparador", {
  render: (b, ctx) => marco("comparador", b, ctx,
    `<div class="cmp">` + [["antes", "Antes", "history"], ["despues", "Después", "auto_awesome"]].map(([k, t, ic]) =>
      `<section class="cmp-panel cmp-${k}" aria-labelledby="${fid(ctx, b, k)}"><h5 id="${fid(ctx, b, k)}"><span class="chip ${k === "antes" ? "chip-neutral" : "chip-primary"}">${icono(ic)}${t}</span>${esc(b[k].titulo || "")}</h5><pre class="cmp-texto">${esc(b[k].texto)}</pre></section>`).join("") + `</div>` +
    `<button class="btn btn-tonal cmp-ver" type="button" aria-expanded="false" aria-controls="${fid(ctx, b, "cambios")}">${icono("expand_more")}Ver qué cambió y por qué</button>` +
    `<ol class="cmp-cambios" id="${fid(ctx, b, "cambios")}" hidden>${b.cambios.map(c => `<li><b>${esc(c.titulo)}.</b> ${esc(c.texto)}</li>`).join("")}</ol>`),
  montar(el, b, ctx) {
    const btn = qs(".cmp-ver", el), lista = qs(".cmp-cambios", el);
    btn.addEventListener("click", () => {
      const abrir = lista.hidden; lista.hidden = !abrir; btn.setAttribute("aria-expanded", String(abrir));
      qs(".ms", btn).textContent = abrir ? "expand_less" : "expand_more";
      if (abrir) guardarResultado(ctx, b, { resultado: "hecho" });
    });
  }
});

/* ===================== Tabla comparativa editable ===================== */
registrar("tabla", {
  render: (b, ctx) => marco("tabla", b, ctx,
    `<div class="tbl-edit-wrap"><table class="tbl tbl-edit"><caption class="sr-only">${esc(b.titulo || "Tabla comparativa")}</caption>` +
    `<thead><tr><td></td>${b.columnas.map((c, j) => `<th scope="col" id="${fid(ctx, b, "c" + j)}">${esc(c.titulo)}</th>`).join("")}</tr></thead><tbody>` +
    b.filas.map((f, i) => `<tr><th scope="row" id="${fid(ctx, b, "f" + i)}">${esc(f.titulo)}</th>` +
      b.columnas.map((c, j) => `<td data-col="${esc(c.titulo)}"><textarea class="field" rows="2" data-celda="${i}-${j}" aria-labelledby="${fid(ctx, b, "f" + i)} ${fid(ctx, b, "c" + j)}"></textarea></td>`).join("") + `</tr>`).join("") +
    `</tbody></table></div>` + acciones(boton("guardar", "Guardar la tabla", "btn-filled", "save"))),
  montar(el, b, ctx) {
    const valores = { ...(leer(ctx, b)?.respuesta || {}) };
    qsa("[data-celda]", el).forEach(t => { t.value = valores[t.dataset.celda] || ""; });
    const guardarB = demorar(() => guardarParcial(ctx, b, valores));
    el.addEventListener("input", e => { const t = e.target.closest("[data-celda]"); if (t) { valores[t.dataset.celda] = t.value; guardarB(); } });
    el.addEventListener("click", e => {
      if (e.target.closest("[data-a]")?.dataset.a !== "guardar") return;
      const llenas = Object.values(valores).filter(v => v.trim()).length, total = b.filas.length * b.columnas.length;
      guardarResultado(ctx, b, { resultado: "hecho", respuesta: valores });
      mostrarFeedback(el, "hecho", `Tabla guardada: ${llenas} de ${total} celdas completas`, llenas < total ? "<p>Podés completar el resto después: la tabla se guarda mientras escribís.</p>" : "");
    });
  }
});

/* ===================== Constructor de flujos por bloques ===================== */
const TIPOS_FLUJO = { disparador: ["Disparador", "bolt"], accion: ["Acción", "play_circle"], condicion: ["Condición", "call_split"], ia: ["Interviene la IA", "auto_awesome"], revision: ["Revisa una persona", "person_check"] };
registrar("flujo", {
  render: (b, ctx) => marco("flujo", b, ctx,
    `<ol class="flujo" aria-label="Pasos del flujo"></ol>` +
    acciones(boton("svg", "Descargar diagrama", "btn-text", "download"), boton("agregar", "Agregar paso", "btn-tonal", "add"), boton("revisar", "Revisar mi flujo", "btn-filled", "fact_check"))),
  montar(el, b, ctx) {
    const max = b.maximo || 5, min = b.minimo || 3;
    let pasos = leer(ctx, b)?.respuesta || [{ tipo: "disparador", texto: "" }];
    const lista = qs(".flujo", el), guardarB = demorar(() => guardarParcial(ctx, b, pasos));
    function pintar(foco) {
      lista.innerHTML = pasos.map((p, i) => {
        const [lbl, ic] = TIPOS_FLUJO[p.tipo];
        return `<li class="flujo-paso k-${p.tipo}"><div class="fp-head"><span class="fp-n">${icono(ic)}<span>Paso ${i + 1}</span></span>` +
          `<label class="sr-only" for="${fid(ctx, b, "t" + i)}">Tipo del paso ${i + 1}</label><span class="sel fp-sel"><select class="field fp-tipo" id="${fid(ctx, b, "t" + i)}" data-tipo="${i}">${Object.entries(TIPOS_FLUJO).map(([k, [l]]) => `<option value="${k}"${k === p.tipo ? " selected" : ""}>${l}</option>`).join("")}</select><span class="ms tf-ic" aria-hidden="true">arrow_drop_down</span></span>` +
          `<span class="fp-ctrl"><button class="icon-btn" type="button" data-sube="${i}" aria-label="Subir el paso ${i + 1}"${i === 0 ? " disabled" : ""}>${icono("arrow_upward")}</button>` +
          `<button class="icon-btn" type="button" data-baja="${i}" aria-label="Bajar el paso ${i + 1}"${i === pasos.length - 1 ? " disabled" : ""}>${icono("arrow_downward")}</button>` +
          `<button class="icon-btn" type="button" data-quita="${i}" aria-label="Quitar el paso ${i + 1}"${pasos.length === 1 ? " disabled" : ""}>${icono("delete")}</button></span></div>` +
          `<div class="tf"><label for="${fid(ctx, b, "d" + i)}">Qué pasa en este paso</label><input class="field" id="${fid(ctx, b, "d" + i)}" data-texto="${i}" value="${esc(p.texto)}" autocomplete="off"></div>` +
          `<span class="sr-only">${lbl}</span></li>`;
      }).join("");
      qs('[data-a="agregar"]', el).disabled = pasos.length >= max;
      if (foco) qs(foco, el)?.focus();
    }
    pintar();
    el.addEventListener("input", e => { const t = e.target.closest("[data-texto]"); if (t) { pasos[+t.dataset.texto].texto = t.value; guardarB(); } });
    el.addEventListener("change", e => { const s = e.target.closest("[data-tipo]"); if (s) { pasos[+s.dataset.tipo].tipo = s.value; pintar(`[data-tipo="${s.dataset.tipo}"]`); guardarB(); } });
    el.addEventListener("click", e => {
      const t = e.target.closest("[data-sube],[data-baja],[data-quita],[data-a]"); if (!t) return;
      if (t.dataset.sube) { const i = +t.dataset.sube; [pasos[i - 1], pasos[i]] = [pasos[i], pasos[i - 1]]; pintar(`[data-sube="${Math.max(1, i - 1)}"]`); guardarB(); aviso(`Paso movido al lugar ${i}`); return; }
      if (t.dataset.baja) { const i = +t.dataset.baja; [pasos[i + 1], pasos[i]] = [pasos[i], pasos[i + 1]]; pintar(`[data-baja="${Math.min(pasos.length - 2, i + 1)}"]`); guardarB(); aviso(`Paso movido al lugar ${i + 2}`); return; }
      if (t.dataset.quita) { pasos.splice(+t.dataset.quita, 1); pintar('[data-a="agregar"]'); guardarB(); aviso("Paso quitado"); return; }
      const a = t.dataset.a;
      if (a === "agregar" && pasos.length < max) { pasos.push({ tipo: "accion", texto: "" }); pintar(`[data-texto="${pasos.length - 1}"]`); guardarB(); }
      if (a === "revisar") {
        const obs = [];
        if (pasos.length < min) obs.push(`Un flujo útil tiene entre ${min} y ${max} pasos. Sumá ${min - pasos.length} más.`);
        if (pasos[0].tipo !== "disparador") obs.push("Empezá con un disparador: lo que pone en marcha el flujo (por ejemplo, llega un correo).");
        const iIa = pasos.findIndex(p => p.tipo === "ia");
        if (iIa > -1 && !pasos.slice(iIa + 1).some(p => p.tipo === "revision")) obs.push("Hay un paso con IA y ninguna revisión de una persona después. Sumá una revisión antes de que el resultado salga del flujo.");
        if (pasos.some(p => !p.texto.trim())) obs.push("Describí qué pasa en cada paso.");
        guardarResultado(ctx, b, { resultado: obs.length ? "parcial" : "hecho", respuesta: pasos });
        mostrarFeedback(el, obs.length ? "parcial" : "hecho", obs.length ? "Tu flujo se puede mejorar" : "Tu flujo está bien armado",
          obs.length ? `<ul>${obs.map(o => `<li>${esc(o)}</li>`).join("")}</ul>` : "<p>Tiene disparador, pasos claros y una persona que revisa lo que hace la IA.</p>");
      }
      if (a === "svg") descargar("flujo.svg", svgFlujo(b.titulo || "Flujo", pasos), "image/svg+xml");
    });
  }
});
/** Diagrama vertical en SVG para descargar (colores fijos porque el archivo se usa fuera del sitio) */
function svgFlujo(titulo, pasos) {
  const w = 520, h = 70 + pasos.length * 96, xe = s => esc(s).slice(0, 70);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Roboto Flex, Arial, sans-serif">` +
    `<rect width="${w}" height="${h}" fill="#faf9fd"/><text x="24" y="40" font-size="20" fill="#1a1c1e">${xe(titulo)}</text>` +
    pasos.map((p, i) => { const y = 64 + i * 96, ia = p.tipo === "ia", rev = p.tipo === "revision";
      return `<rect x="24" y="${y}" width="${w - 48}" height="68" rx="16" fill="${ia ? "#d5e3ff" : rev ? "#a3f69c" : "#ffffff"}" stroke="#74777f"/>` +
        `<text x="44" y="${y + 28}" font-size="13" fill="#43474e">Paso ${i + 1} | ${TIPOS_FLUJO[p.tipo][0]}</text><text x="44" y="${y + 50}" font-size="16" fill="#1a1c1e">${xe(p.texto || "(sin descripción)")}</text>` +
        (i < pasos.length - 1 ? `<path d="M${w / 2} ${y + 68} v24" stroke="#74777f" stroke-width="2"/><path d="M${w / 2 - 6} ${y + 86} l6 6 l6 -6" fill="none" stroke="#74777f" stroke-width="2"/>` : "");
    }).join("") + `</svg>`;
}

/* ===================== Storyboard por escenas ===================== */
const CAMPOS_ESCENA = [["visual", "Descripción visual"], ["texto", "Texto en pantalla"], ["voz", "Voz o narración"], ["prompt", "Prompt para generar la escena"]];
registrar("storyboard", {
  render: (b, ctx) => marco("storyboard", b, ctx,
    `<div class="sb"></div>` + acciones(boton("imprimir", "Imprimir o guardar como PDF", "btn-outlined", "print"), boton("agregar", "Agregar escena", "btn-tonal", "add"))),
  montar(el, b, ctx) {
    const min = b.minimo || 4, max = b.maximo || 6;
    let escenas = leer(ctx, b)?.respuesta || Array.from({ length: min }, () => ({}));
    const box = qs(".sb", el), guardarB = demorar(() => guardarParcial(ctx, b, escenas));
    function pintar(foco) {
      box.innerHTML = escenas.map((e, i) => `<section class="sb-esc" aria-labelledby="${fid(ctx, b, "e" + i)}"><div class="sb-head"><h5 id="${fid(ctx, b, "e" + i)}">Escena ${i + 1}</h5>` +
        `<button class="icon-btn" type="button" data-quita="${i}" aria-label="Quitar la escena ${i + 1}"${escenas.length <= min ? " disabled" : ""}>${icono("delete")}</button></div>` +
        CAMPOS_ESCENA.map(([k, l]) => `<div class="tf"><label for="${fid(ctx, b, `${k}${i}`)}">${l}</label><textarea class="field" rows="2" id="${fid(ctx, b, `${k}${i}`)}" data-e="${i}" data-k="${k}">${esc(e[k] || "")}</textarea></div>`).join("") + `</section>`).join("");
      qs('[data-a="agregar"]', el).disabled = escenas.length >= max;
      if (foco) qs(foco, el)?.focus();
    }
    pintar();
    el.addEventListener("input", e => { const t = e.target.closest("[data-e]"); if (t) { escenas[+t.dataset.e][t.dataset.k] = t.value; guardarB(); } });
    el.addEventListener("click", e => {
      const q = e.target.closest("[data-quita]");
      if (q) { escenas.splice(+q.dataset.quita, 1); pintar('[data-a="agregar"]'); guardarB(); aviso("Escena quitada"); return; }
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "agregar" && escenas.length < max) { escenas.push({}); pintar(`[data-e="${escenas.length - 1}"]`); guardarB(); }
      if (a === "imprimir") {
        guardarResultado(ctx, b, { resultado: "hecho", respuesta: escenas });
        el.classList.add("imprimir"); document.body.classList.add("imprimiendo");
        const fin = () => { el.classList.remove("imprimir"); document.body.classList.remove("imprimiendo"); removeEventListener("afterprint", fin); };
        addEventListener("afterprint", fin); print(); setTimeout(fin, 1000);
      }
    });
  }
});

/* ===================== Mapa de impactos ===================== */
registrar("mapa", {
  render: (b, ctx) => marco("mapa", b, ctx,
    (b.caso ? `<div class="mapa-caso">${icono("work", "sm")}<div>${md(b.caso)}</div></div>` : "") +
    `<div class="mapa">${b.columnas.map(c => `<section class="mapa-col" aria-labelledby="${fid(ctx, b, c.id)}"><h5 id="${fid(ctx, b, c.id)}">${esc(c.titulo)}</h5><p class="mapa-ayuda">${esc(c.ayuda || "")}</p>` +
      `<ul class="mapa-items" data-col="${esc(c.id)}"></ul>` +
      `<form class="mapa-add" data-col="${esc(c.id)}"><label class="sr-only" for="${fid(ctx, b, c.id + "-in")}">Agregar en ${esc(c.titulo)}</label><input class="field" id="${fid(ctx, b, c.id + "-in")}" autocomplete="off" placeholder="Escribí y agregá">` +
      `<button class="icon-btn tonal" type="submit" aria-label="Agregar en ${esc(c.titulo)}">${icono("add")}</button></form>` +
      `<div class="mapa-ideas" hidden><p>Ideas para comparar:</p><ul>${(b.ideas?.[c.id] || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></section>`).join("")}</div>` +
    acciones(boton("ideas", "Ver ideas para comparar", "btn-outlined", "lightbulb"), boton("guardar", "Guardar mapa", "btn-filled", "save"))),
  montar(el, b, ctx) {
    const datos = leer(ctx, b)?.respuesta || {};
    b.columnas.forEach(c => { datos[c.id] = datos[c.id] || []; });
    const guardarB = demorar(() => guardarParcial(ctx, b, datos));
    function pintar(col) {
      const ul = qs(`.mapa-items[data-col="${col}"]`, el);
      ul.innerHTML = datos[col].map((x, i) => `<li><span>${esc(x)}</span><button class="icon-btn" type="button" data-quita="${col}:${i}" aria-label="Quitar: ${esc(x)}">${icono("close")}</button></li>`).join("");
    }
    b.columnas.forEach(c => pintar(c.id));
    el.addEventListener("submit", e => {
      const f = e.target.closest(".mapa-add"); if (!f) return; e.preventDefault();
      const inp = qs("input", f), v = inp.value.trim(); if (!v) { inp.focus(); return; }
      datos[f.dataset.col].push(v); inp.value = ""; pintar(f.dataset.col); guardarB(); inp.focus(); aviso("Agregado");
    });
    el.addEventListener("click", e => {
      const q = e.target.closest("[data-quita]");
      if (q) { const [col, i] = q.dataset.quita.split(":"); datos[col].splice(+i, 1); pintar(col); guardarB(); qs(`#${CSS.escape(idDe(ctx, b))}-${col}-in`, el).focus(); aviso("Quitado"); return; }
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "ideas") { const btn = e.target.closest("[data-a]"); const ver = qs(".mapa-ideas", el).hidden; qsa(".mapa-ideas", el).forEach(x => { x.hidden = !ver; }); btn.lastChild.textContent = ver ? "Ocultar ideas" : "Ver ideas para comparar"; }
      if (a === "guardar") {
        const vacias = b.columnas.filter(c => !datos[c.id].length);
        guardarResultado(ctx, b, { resultado: vacias.length ? "parcial" : "hecho", respuesta: datos });
        mostrarFeedback(el, vacias.length ? "parcial" : "hecho", vacias.length ? "Mapa guardado, con columnas por completar" : "Mapa guardado",
          vacias.length ? `<p>Todavía no agregaste nada en: ${vacias.map(c => esc(c.titulo)).join(", ")}.</p>` : "<p>Compará tu mapa con las ideas sugeridas: no hay una única respuesta correcta.</p>");
      }
    });
  }
});
