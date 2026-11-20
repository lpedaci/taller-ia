/* Taller - IA | Bloque 3 (ética y datos): debate, "Anonimizá este texto" y marco legal por país
   - debate: tres posiciones sobre un tema abierto; la persona elige una y la argumenta en su diario.
   - anonimizar: un texto con datos personales inventados; la persona marca lo que hay que quitar o reemplazar.
   - marco-legal: tarjetas con las leyes de protección de datos de otros países de la región, desde
     content/marco-legal.json (solo las que tienen la fuente verificada). */
import { esc, qs, qsa } from "../util.js";
import { icono } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar } from "../lesson/bloques.js";
import { guardarDiario, leerJSON } from "../state.js";
import { marco, idDe, leer, esPrueba, guardarResultado, guardarParcial, mostrarFeedback, limpiarFeedback, acciones, boton, demorar } from "./comun.js";

const fid = (ctx, b, x) => esc(`${idDe(ctx, b)}-${x}`);

/* ===================== Debate: elegir una posición y argumentarla ===================== */
registrar("debate", {
  render: (b, ctx) => marco("debate", b, ctx,
    `<div class="deb-tema">${md(b.tema)}</div>` +
    `<fieldset class="deb-pos"><legend class="act-sub">¿Con qué posición estás más de acuerdo?</legend>` +
    b.posiciones.map((p, i) => `<label class="deb-op"><input type="radio" name="${fid(ctx, b, "p")}" value="${i}"><span class="deb-txt"><b>${esc(p.titulo)}</b>${md(p.argumento)}</span></label>`).join("") + `</fieldset>` +
    `<div class="tf"><label for="${fid(ctx, b, "a")}">${esc(b.pregunta || "¿Por qué? Argumentá tu posición y respondé a la objeción más fuerte de las otras dos.")}</label>` +
    `<textarea class="field" id="${fid(ctx, b, "a")}" rows="5" aria-describedby="${fid(ctx, b, "ah")}"></textarea>` +
    `<span class="tf-help" id="${fid(ctx, b, "ah")}">No hay una respuesta correcta: se valora que el argumento sea claro. Se guarda en tu diario.</span></div>` +
    acciones(boton("guardar", "Guardar en mi diario", "btn-filled", "bookmark"))),
  montar(el, b, ctx) {
    const ta = qs("textarea", el), previo = leer(ctx, b)?.respuesta || {};
    ta.value = previo.texto || "";
    if (previo.posicion != null) { const r = qs(`input[value="${previo.posicion}"]`, el); if (r) r.checked = true; }
    const elegida = () => qs("input[type=radio]:checked", el)?.value;
    const guardarB = demorar(() => guardarParcial(ctx, b, { posicion: elegida() ?? null, texto: ta.value }));
    el.addEventListener("input", guardarB);
    el.addEventListener("click", e => {
      if (e.target.closest("[data-a]")?.dataset.a !== "guardar") return;
      const p = elegida();
      if (p == null) { mostrarFeedback(el, "info", "Elegí una posición", "<p>Marcá la que más te convence, aunque no estés de acuerdo del todo.</p>"); qs("input[type=radio]", el).focus(); return; }
      const t = ta.value.trim();
      if (t.length < 40) { mostrarFeedback(el, "info", "Escribí un poco más", "<p>Con tres o cuatro oraciones alcanza: tu posición, por qué, y qué le responderías a quien piensa distinto.</p>"); ta.focus(); return; }
      const pos = b.posiciones[+p];
      if (!esPrueba(ctx)) guardarDiario(idDe(ctx, b), ctx.meta.id, `Debate: ${b.titulo}. Mi posición: ${pos.titulo}`, t);
      guardarResultado(ctx, b, { resultado: "hecho", respuesta: { posicion: +p, texto: t } });
      mostrarFeedback(el, "hecho", esPrueba(ctx) ? "Listo (en la lección de prueba no se guarda en el diario)" : "Guardado en tu diario",
        `<p>Para pensar: ${esc(pos.objecion || "¿qué argumento de las otras posiciones te costó más responder?")}</p>`);
    });
  }
});

/* ===================== Anonimizá este texto ===================== */
/* segmentos: texto suelto o { t, dato: "Nombre", reemplazo: "[Persona 1]" }. Los que no tienen "dato" no son personales. */
registrar("anonimizar", {
  render: (b, ctx) => marco("anonimizar", b, ctx,
    `<p class="act-ayuda">${icono("info", "sm")}Tocá cada parte que identifica a una persona o la expone. Volvé a tocarla para desmarcarla.</p>` +
    `<div class="err-texto an-texto">${b.segmentos.map((s, i) => typeof s === "string" ? esc(s) : `<span class="seg" role="button" tabindex="0" data-s="${i}" aria-pressed="false">${esc(s.t)}</span>`).join("")}</div>` +
    `<p class="ck-cuenta an-cuenta" aria-live="polite"></p>` +
    `<div class="an-resultado" hidden><h5>Así queda para pegar en la IA</h5><pre class="sn-texto an-limpio"></pre></div>` +
    acciones(boton("reintentar", "Reintentar", "btn-outlined", "replay"), boton("comprobar", "Comprobar", "btn-filled", "check"))),
  montar(el, b, ctx) {
    const marcadas = new Set(leer(ctx, b)?.respuesta || []);
    const reintentar = qs('[data-a="reintentar"]', el); reintentar.hidden = true;
    const datos = b.segmentos.map((s, i) => (typeof s === "object" && s.dato) ? i : -1).filter(i => i > -1);
    const contar = () => { qs(".an-cuenta", el).textContent = `${marcadas.size} ${marcadas.size === 1 ? "parte marcada" : "partes marcadas"}`; };
    const pintar = () => { qsa(".seg", el).forEach(s => s.setAttribute("aria-pressed", String(marcadas.has(+s.dataset.s)))); contar(); };
    pintar();
    // Las partes marcables son texto en línea (no botones) para que se corten con la oración; responden a Enter y Espacio
    el.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches(".seg")) { e.preventDefault(); e.target.click(); } });
    el.addEventListener("click", e => {
      const s = e.target.closest(".seg");
      if (s && !el.classList.contains("is-checked")) { const i = +s.dataset.s; marcadas.has(i) ? marcadas.delete(i) : marcadas.add(i); pintar(); guardarParcial(ctx, b, [...marcadas]); return; }
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "comprobar") {
        if (!marcadas.size) { mostrarFeedback(el, "info", "Marcá al menos una parte del texto para comprobar."); qs(".seg", el).focus(); return; }
        const encontrados = datos.filter(i => marcadas.has(i)), faltan = datos.filter(i => !marcadas.has(i));
        const demas = [...marcadas].filter(i => !datos.includes(i));
        datos.forEach(i => qs(`.seg[data-s="${i}"]`, el).classList.add(marcadas.has(i) ? "is-ok" : "is-missed"));
        demas.forEach(i => qs(`.seg[data-s="${i}"]`, el).classList.add("is-bad"));
        el.classList.add("is-checked"); qsa(".seg", el).forEach(x => { x.setAttribute("aria-disabled", "true"); x.tabIndex = -1; });
        // Versión anonimizada: siempre con todos los reemplazos, para mostrar el resultado esperado
        qs(".an-limpio", el).textContent = b.segmentos.map(s => typeof s === "string" ? s : (s.dato ? s.reemplazo : s.t)).join("");
        qs(".an-resultado", el).hidden = false;
        const res = !faltan.length && !demas.length ? "correcto" : encontrados.length ? "parcial" : "incorrecto";
        guardarResultado(ctx, b, { resultado: res, puntaje: encontrados.length, total: datos.length, respuesta: [...marcadas] });
        mostrarFeedback(el, res, `Encontraste ${encontrados.length} de ${datos.length} datos para quitar o reemplazar`,
          (faltan.length ? `<p>Te ${faltan.length === 1 ? "faltó" : "faltaron"}:</p><ul>${faltan.map(i => `<li><b>${esc(b.segmentos[i].dato)}:</b> «${esc(b.segmentos[i].t)}». ${esc(b.segmentos[i].porque || "")}</li>`).join("")}</ul>` : "") +
          (demas.length ? `<p>${demas.length === 1 ? "Una parte marcada no hacía falta quitarla" : `${demas.length} partes marcadas no hacía falta quitarlas`}:</p><ul>${demas.map(i => `<li>«${esc(b.segmentos[i].t)}». ${esc(b.segmentos[i].nota || "La tarea la necesita y no identifica a nadie.")}</li>`).join("")}</ul>` : "") +
          (b.cierre ? md(b.cierre) : ""));
        qs('[data-a="comprobar"]', el).hidden = true; reintentar.hidden = false; reintentar.focus();
      }
      if (a === "reintentar") {
        marcadas.clear(); el.classList.remove("is-checked"); qs(".an-resultado", el).hidden = true;
        qsa(".seg", el).forEach(x => { x.removeAttribute("aria-disabled"); x.tabIndex = 0; x.classList.remove("is-ok", "is-bad", "is-missed"); });
        pintar(); limpiarFeedback(el); reintentar.hidden = true; qs('[data-a="comprobar"]', el).hidden = false; qs(".seg", el).focus();
      }
    });
  }
});

/* ===================== Marco legal en la región ===================== */
registrar("marco-legal", {
  render: b => `<section class="ml" aria-labelledby="ml-t"><h4 id="ml-t">${esc(b.titulo || "Otros países de la región")}</h4><div class="ml-lista" aria-busy="true"><p class="muted">Cargando…</p></div></section>`,
  async montar(el, b) {
    const box = qs(".ml-lista", el);
    try {
      const d = await leerJSON("content/marco-legal.json");
      const paises = d.paises.filter(p => p.verificado);
      box.innerHTML = `<ul class="ml-cards">${paises.map(p => `<li class="ml-card"><p class="ml-pais">${esc(p.pais)}</p><p class="ml-ley"><b>${esc(p.norma)}</b> (${esc(String(p.anio))})</p>${md(p.resumen)}` +
        (p.url ? `<a class="ml-link" href="${esc(p.url)}" target="_blank" rel="noopener">${icono("open_in_new", "sm")}Texto oficial<span class="sr-only"> de la norma de ${esc(p.pais)} (se abre en otra pestaña)</span></a>` : "") + `</li>`).join("")}</ul>` +
        `<p class="ml-fecha">${icono("event", "sm")}Información revisada el ${esc(d.revisado)}. Las leyes cambian: antes de usarla para una decisión, consultá la fuente oficial de cada país.</p>`;
    } catch {
      box.innerHTML = `<p class="muted">No se pudo cargar la información por país. Revisá tu conexión y volvé a abrir este paso.</p>`;
    }
    box.removeAttribute("aria-busy");
  }
});
