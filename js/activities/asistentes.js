/* Taller - IA | Bloque 4 (asistentes): fichas de herramientas, prompt para probar y kit de prompts de trabajo
   - herramientas: fichas por asistente desde content/herramientas.json, con fecha y enlace a la ayuda oficial.
     "claves" elige qué funciones mostrar. Lo que no está confirmado dice "Consultá la ayuda oficial".
   - prompt-fijo: un prompt para probar tal cual, con "Copiar" y "Abrir en".
   - kit: la persona elige su área, ajusta tres prompts modelo y arma su kit (Mis prompts y descarga). */
import { esc, qs, qsa } from "../util.js";
import { icono, aviso, descargar } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar } from "../lesson/bloques.js";
import { guardarPrompt, leerJSON } from "../state.js";
import { marco, idDe, leer, esPrueba, guardarResultado, guardarParcial, mostrarFeedback, acciones, boton, demorar, copiar } from "./comun.js";

const fid = (ctx, b, x) => esc(`${idDe(ctx, b)}-${x}`);
const ASISTENTES = [
  { n: "Claude", url: "https://claude.ai/new" },
  { n: "ChatGPT", url: "https://chatgpt.com/" },
  { n: "Gemini", url: "https://gemini.google.com/app" },
  { n: "Copilot", url: "https://copilot.microsoft.com/" }
];

/* ===================== Fichas de herramientas ===================== */
let cache = null;
const datosHerramientas = () => (cache ||= leerJSON("content/herramientas.json"));
registrar("herramientas", {
  render: b => `<section class="hr" aria-labelledby="hr-${esc(b.id || "t")}"><h4 id="hr-${esc(b.id || "t")}">${esc(b.titulo || "Los cuatro asistentes")}</h4>` +
    `<div class="hr-lista" aria-busy="true"><p class="muted">Cargando…</p></div></section>`,
  async montar(el, b) {
    const box = qs(".hr-lista", el);
    try {
      const d = await datosHerramientas();
      const claves = b.claves || Object.keys(d.funciones);
      box.innerHTML = `<ul class="hr-cards">${d.herramientas.map(h => `<li class="hr-card"><article aria-labelledby="hr-${esc(b.id || "t")}-${h.id}">` +
        `<header class="hr-head"><h5 id="hr-${esc(b.id || "t")}-${h.id}">${esc(h.nombre)}</h5><p class="hr-emp">${esc(h.empresa)}</p></header>` +
        (b.ecosistema !== false ? `<p class="hr-eco">${esc(h.ecosistema)}</p>` : "") +
        `<dl class="hr-funcs">${claves.map(k => { const f = h.funciones[k] || { estado: "a-verificar" }, okf = f.estado === "si";
          return `<div class="hr-f${okf ? "" : " is-pend"}"><dt>${icono(okf ? "check_circle" : "help", okf ? "fill" : "")}${esc(d.funciones[k])}</dt>` +
            `<dd>${okf ? esc(f.detalle) + (f.url ? ` <a href="${esc(f.url)}" target="_blank" rel="noopener">Fuente<span class="sr-only"> sobre ${esc(d.funciones[k].toLowerCase())} en ${esc(h.nombre)} (se abre en otra pestaña)</span></a>` : "") : "Consultá la ayuda oficial."}</dd></div>`; }).join("")}</dl>` +
        `<a class="btn btn-text hr-ayuda" href="${esc(h.ayuda)}" target="_blank" rel="noopener">${icono("help")}Ayuda oficial<span class="sr-only"> de ${esc(h.nombre)} (se abre en otra pestaña)</span></a>` +
        `</article></li>`).join("")}</ul>` +
        `<p class="ml-fecha">${icono("event", "sm")}Actualizado a: ${esc(d.actualizado)}. Estas herramientas cambian seguido: ante la duda, lo que vale es la ayuda oficial.</p>`;
    } catch {
      box.innerHTML = `<p class="muted">No se pudo cargar la información de las herramientas. Revisá tu conexión y volvé a abrir este paso.</p>`;
    }
    box.removeAttribute("aria-busy");
  }
});

/* ===================== Un prompt para probar tal cual ===================== */
registrar("prompt-fijo", {
  render: (b, ctx) => `<section class="pf" aria-labelledby="${fid(ctx, b, "t")}"><h4 id="${fid(ctx, b, "t")}">${esc(b.titulo || "La consigna")}</h4>` +
    `<pre class="con-texto pf-texto" tabindex="0" aria-labelledby="${fid(ctx, b, "t")}">${esc(b.texto)}</pre>` +
    `<div class="act-actions"><div class="con-abrir" role="group" aria-label="Copiar y abrir en un asistente">${ASISTENTES.map(a => `<a class="btn btn-outlined" href="${a.url}" target="_blank" rel="noopener" data-abrir>${a.n}<span class="sr-only"> (copia la consigna y se abre en otra pestaña)</span>${icono("open_in_new")}</a>`).join("")}</div>` +
    `<button class="btn btn-filled" type="button" data-copiar-fijo>${icono("content_copy")}Copiar</button></div></section>`,
  montar(el, b) {
    el.addEventListener("click", async e => {
      if (e.target.closest("[data-abrir]")) { await copiar(b.texto); aviso("Copiamos la consigna: pegala en el chat que se abrió."); return; }
      if (e.target.closest("[data-copiar-fijo]")) aviso(await copiar(b.texto) ? "Copiado al portapapeles" : "No se pudo copiar. Seleccioná el texto y copialo a mano.");
    });
  }
});

/* ===================== Kit de prompts de trabajo ===================== */
registrar("kit", {
  render: (b, ctx) => marco("kit", b, ctx,
    `<fieldset class="deb-pos kit-areas"><legend class="act-sub">¿En qué área trabajás?</legend>` +
    b.areas.map(a => `<label class="deb-op"><input type="radio" name="${fid(ctx, b, "a")}" value="${esc(a.id)}"><span class="deb-txt"><b>${esc(a.titulo)}</b><span>${esc(a.descripcion || "")}</span></span></label>`).join("") + `</fieldset>` +
    `<div class="kit-casos" aria-live="polite"></div>`),
  montar(el, b, ctx) {
    const prev = leer(ctx, b)?.respuesta || {};
    let area = prev.area || null;
    const textos = { ...(prev.textos || {}) }, fuera = new Set(prev.fuera || []);
    const box = qs(".kit-casos", el);
    const guardarB = demorar(() => guardarParcial(ctx, b, { area, textos, fuera: [...fuera] }));
    const clave = (a, i) => `${a}-${i}`;
    const casos = () => b.areas.find(a => a.id === area)?.casos || [];
    function pintar(enfocar) {
      const ar = b.areas.find(a => a.id === area);
      if (!ar) { box.innerHTML = ""; return; }
      box.innerHTML = `<h5 class="kit-t" tabindex="-1">Tres casos de ${esc(ar.titulo.toLowerCase())}</h5><p class="act-ayuda">${icono("info", "sm")}Ajustá cada prompt a tu trabajo: lo que está entre corchetes se reemplaza. Destildá el que no quieras en tu kit.</p>` +
        ar.casos.map((c, i) => { const k = clave(area, i); return `<section class="kit-caso" aria-labelledby="${fid(ctx, b, "c" + i)}"><h6 id="${fid(ctx, b, "c" + i)}">${esc(c.titulo)}</h6><div class="kit-sit">${md(c.situacion)}</div>` +
          `<div class="tf"><label for="${fid(ctx, b, "p" + i)}">Prompt modelo</label><textarea class="field" id="${fid(ctx, b, "p" + i)}" data-k="${k}" rows="7">${esc(textos[k] ?? c.prompt)}</textarea></div>` +
          `<label class="ck-item kit-incluir"><input type="checkbox" data-incluir="${k}"${fuera.has(k) ? "" : " checked"}><span><b>Incluir en mi kit</b></span></label></section>`; }).join("") +
        acciones(boton("descargar", "Descargar mi kit (.md)", "btn-outlined", "download") + boton("guardar", "Guardar en Mis prompts", "btn-filled", "bookmark_add"));
      if (enfocar) qs(".kit-t", el).focus();
    }
    if (area) { const r = qs(`input[value="${CSS.escape(area)}"]`, el); if (r) r.checked = true; }
    pintar(false);
    el.addEventListener("change", e => {
      if (e.target.matches("input[type=radio]")) { area = e.target.value; pintar(false); guardarB(); return; }
      const inc = e.target.closest("[data-incluir]"); if (inc) { inc.checked ? fuera.delete(inc.dataset.incluir) : fuera.add(inc.dataset.incluir); guardarB(); }
    });
    el.addEventListener("input", e => { const t = e.target.closest("[data-k]"); if (t) { textos[t.dataset.k] = t.value; guardarB(); } });
    el.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a || !area) return;
      const ar = b.areas.find(x => x.id === area);
      const elegidos = casos().map((c, i) => ({ c, k: clave(area, i) })).filter(x => !fuera.has(x.k)).map(x => ({ titulo: x.c.titulo, texto: (textos[x.k] ?? x.c.prompt).trim() }));
      if (!elegidos.length) { mostrarFeedback(el, "info", "Tu kit está vacío", "<p>Tildá al menos un caso para incluirlo.</p>"); return; }
      if (a === "descargar") {
        descargar(`kit-de-prompts-${area}.md`, `# Mi kit de prompts: ${ar.titulo}\n\nTaller - IA. Reemplazá lo que está entre corchetes antes de usar cada prompt.\n\n` + elegidos.map(x => `## ${x.titulo}\n\n${"`".repeat(3)}\n${x.texto}\n${"`".repeat(3)}`).join("\n\n") + "\n", "text/markdown");
        aviso("Descargamos tu kit");
      }
      if (a === "guardar") {
        if (!esPrueba(ctx)) elegidos.forEach((x, i) => guardarPrompt({ id: `p-${idDe(ctx, b)}-${area}-${i}`, nombre: x.titulo, etiquetas: ["kit", ar.titulo.toLowerCase()], texto: x.texto, modulo: ctx.meta.id, origen: "kit" }));
        guardarResultado(ctx, b, { resultado: "hecho", respuesta: { area, textos, fuera: [...fuera] } });
        mostrarFeedback(el, "hecho", esPrueba(ctx) ? "Listo (en la lección de prueba no se guarda)" : `Guardamos ${elegidos.length === 1 ? "1 prompt" : elegidos.length + " prompts"} en Mis prompts`, `<p>Los encontrás en <a href="#/prompts">Mis prompts</a> con la etiqueta "kit".</p>`);
      }
    });
  }
});
