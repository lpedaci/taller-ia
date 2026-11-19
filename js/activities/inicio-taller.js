/* Taller - IA | Actividades de arranque y de comprensión
   - perfil: nombre (opcional) y ruta.
   - objetivos: de 1 a 3 objetivos personales.
   - autodiagnostico: preguntas de escala, de opción y de selección múltiple; se guarda para comparar al cierre.
   - diagrama: círculos concéntricos (IA, aprendizaje automático, aprendizaje profundo, IA generativa).
   - predictor: un predictor de palabras de juguete, con datos fijos (no es un modelo real). */
import { esc, qs, qsa } from "../util.js";
import { icono } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar } from "../lesson/bloques.js";
import { datos, perfil, setNombre, rutaActual, setRuta, objetivosPersonales, setObjetivos, guardarAutodiagnostico, autodiagnostico } from "../state.js";
import { marco, idDe, esPrueba, guardarResultado, mostrarFeedback, acciones, boton } from "./comun.js";
import { pintarPersona } from "../shell.js";
import { graficoHTML, montarGrafico } from "../charts.js";

const fid = (ctx, b, x) => esc(`${idDe(ctx, b)}-${x}`);

/* ===================== Perfil: nombre y ruta ===================== */
registrar("perfil", {
  render: (b, ctx) => marco("perfil", b, ctx,
    `<div class="tf"><label for="${fid(ctx, b, "n")}">¿Cómo te llamás? <span class="opc">(opcional)</span></label><input class="field" id="${fid(ctx, b, "n")}" autocomplete="given-name" value="${esc(perfil().nombreCompleto)}" aria-describedby="${fid(ctx, b, "nh")}">` +
      `<span class="tf-help" id="${fid(ctx, b, "nh")}">Lo usamos para saludarte y para tu certificado. No sale de este navegador.</span></div>` +
    `<fieldset class="route-opts"><legend class="act-sub">¿Qué recorrido querés hacer?</legend>${datos.rutas.map(r => `<label class="route-opt"><input type="radio" name="${fid(ctx, b, "r")}" value="${r.id}"${r.id === rutaActual().id ? " checked" : ""}><span class="ro-txt"><b>${esc(r.titulo)}</b><small>${esc(r.descripcion)}</small></span></label>`).join("")}</fieldset>` +
    `<p class="act-ayuda">${icono("info", "sm")}Podés cambiar la ruta cuando quieras desde Mi recorrido. Ningún módulo se bloquea.</p>` +
    acciones(boton("guardar", "Guardar", "btn-filled", "check"))),
  montar(el, b, ctx) {
    el.addEventListener("click", e => {
      if (e.target.closest("[data-a]")?.dataset.a !== "guardar") return;
      const ruta = qs("input[type=radio]:checked", el)?.value;
      if (!esPrueba(ctx)) { setNombre(qs("input.field", el).value); if (ruta) setRuta(ruta); pintarPersona(); }
      guardarResultado(ctx, b, { resultado: "hecho", respuesta: { ruta } });
      const n = perfil().nombre, r = datos.rutas.find(x => x.id === ruta);
      mostrarFeedback(el, "hecho", n ? `Listo, ${n}` : "Listo", `<p>Elegiste ${esc(r ? r.titulo.toLowerCase() : "una ruta")}. La ves marcada en Mi recorrido.</p>`);
    });
  }
});

/* ===================== Objetivos personales ===================== */
registrar("objetivos-personales", {
  render: (b, ctx) => marco("objetivos", b, ctx,
    [0, 1, 2].map(i => `<div class="tf"><label for="${fid(ctx, b, "o" + i)}">Objetivo ${i + 1}${i ? ' <span class="opc">(opcional)</span>' : ""}</label><input class="field" id="${fid(ctx, b, "o" + i)}" data-obj="${i}" autocomplete="off"></div>`).join("") +
    (b.ideas?.length ? `<div class="obj-ideas"><p class="act-sub">Ideas, por si te sirven:</p><div class="filter-chips">${b.ideas.map(t => `<button type="button" class="filter-chip" data-idea="${esc(t)}">${icono("add", "chk")}${esc(t)}</button>`).join("")}</div></div>` : "") +
    acciones(boton("guardar", "Guardar mis objetivos", "btn-filled", "flag"))),
  montar(el, b, ctx) {
    const campos = qsa("[data-obj]", el);
    objetivosPersonales().forEach((o, i) => { if (campos[i]) campos[i].value = o.titulo; });
    el.addEventListener("click", e => {
      const idea = e.target.closest("[data-idea]");
      if (idea) { const libre = campos.find(c => !c.value.trim()); if (libre) { libre.value = idea.dataset.idea; libre.focus(); } else mostrarFeedback(el, "info", "Ya tenés tres objetivos", "<p>Borrá uno si querés cambiarlo.</p>"); return; }
      if (e.target.closest("[data-a]")?.dataset.a !== "guardar") return;
      const lista = campos.map(c => c.value.trim()).filter(Boolean);
      if (!lista.length) { mostrarFeedback(el, "info", "Escribí al menos un objetivo", "<p>Uno solo alcanza. Pensá en algo concreto de tu trabajo.</p>"); campos[0].focus(); return; }
      if (!esPrueba(ctx)) setObjetivos(lista);
      guardarResultado(ctx, b, { resultado: "hecho", respuesta: lista });
      mostrarFeedback(el, "hecho", lista.length === 1 ? "Guardamos tu objetivo" : `Guardamos tus ${lista.length} objetivos`, "<p>Los vas a ver en Mi aprendizaje y los revisás al cerrar cada bloque.</p>");
    });
  }
});

/* ===================== Autodiagnóstico ===================== */
function itemHTML(it, i, nombre) {
  const n = `${nombre}-${i}`;
  if (it.tipo === "escala") {
    const et = it.etiquetas || ["Nada", "Poco", "Algo", "Bastante", "Mucho"];
    return `<fieldset class="q ad-q" data-i="${i}"><legend><span class="q-n">${i + 1}.</span> ${esc(it.texto)}</legend><div class="ad-escala">` +
      et.map((t, k) => `<label class="opt opt-sm ad-op"><input type="radio" name="${n}" value="${k + 1}"><span><b>${k + 1}</b> ${esc(t)}</span></label>`).join("") + `</div></fieldset>`;
  }
  const tipo = it.tipo === "multiple" ? "checkbox" : "radio";
  return `<fieldset class="q ad-q" data-i="${i}"><legend><span class="q-n">${i + 1}.</span> ${esc(it.texto)}${it.tipo === "multiple" ? ' <span class="opc">(podés marcar varias)</span>' : ""}</legend><div class="opts">` +
    it.opciones.map((o, k) => `<label class="opt"><input type="${tipo}" name="${n}" value="${k}"><span>${esc(o)}</span></label>`).join("") + `</div></fieldset>`;
}
registrar("autodiagnostico", {
  render: (b, ctx) => marco("autodiagnostico", b, ctx,
    `<p class="act-ayuda">${icono("lock", "sm")}No hay respuestas correctas: es tu punto de partida. Se guarda solo en este navegador.</p>` +
    b.preguntas.map((it, i) => itemHTML(it, i, idDe(ctx, b))).join("") +
    `<div class="ad-resultado"></div>` + acciones(boton("guardar", b.momento === "final" ? "Guardar y comparar" : "Guardar mi punto de partida", "btn-filled", "check"))),
  montar(el, b, ctx) {
    const previo = autodiagnostico()[b.momento]?.respuestas;
    if (previo && !esPrueba(ctx)) previo.forEach((v, i) => [].concat(v).forEach(x => { const r = qs(`[data-i="${i}"] input[value="${x}"]`, el); if (r) r.checked = true; }));
    el.addEventListener("click", e => {
      if (e.target.closest("[data-a]")?.dataset.a !== "guardar") return;
      const resp = b.preguntas.map((it, i) => it.tipo === "multiple" ? qsa(`[data-i="${i}"] input:checked`, el).map(x => +x.value) : (qs(`[data-i="${i}"] input:checked`, el) ? +qs(`[data-i="${i}"] input:checked`, el).value : null));
      const falta = resp.findIndex((v, i) => v === null && b.preguntas[i].tipo !== "multiple");
      if (falta > -1) { mostrarFeedback(el, "info", `Te falta responder la pregunta ${falta + 1}`); qs(`[data-i="${falta}"] input`, el).focus(); return; }
      if (!esPrueba(ctx)) guardarAutodiagnostico(b.momento || "inicial", resp, b.preguntas.map(it => it.tipo === "escala" ? (it.corto || it.texto) : null));
      guardarResultado(ctx, b, { resultado: "hecho", respuesta: resp });
      const escalas = b.preguntas.map((it, i) => ({ it, i })).filter(x => x.it.tipo === "escala");
      const ini = b.momento === "final" ? autodiagnostico().inicial?.respuestas : null;
      if (ini) {
        const cfg = { forma: "mancuernas", titulo: "Tu confianza: al empezar y ahora", unidad: "de 1 (nada) a 5 (mucho)", min: 1, max: 5, ejeCategorias: "Pregunta",
          categorias: escalas.map(x => x.it.corto || x.it.texto), series: [{ nombre: "Al empezar", valores: escalas.map(x => ini[x.i] || 1) }, { nombre: "Ahora", valores: escalas.map(x => resp[x.i]) }] };
        qs(".ad-resultado", el).innerHTML = graficoHTML(cfg, idDe(ctx, b) + "-g", 5);
        montarGrafico(qs(".ad-resultado .chart", el), cfg);
      }
      mostrarFeedback(el, "hecho", b.momento === "final" ? "Guardamos tu autodiagnóstico final" : "Guardamos tu punto de partida",
        b.momento === "final" ? "<p>Arriba ves cómo cambió tu confianza en cada tema.</p>" : "<p>Al terminar el taller vas a responder las mismas preguntas y ver cómo cambió tu confianza.</p>");
    });
  }
});

/* ===================== Diagrama de círculos concéntricos ===================== */
registrar("diagrama", {
  render: b => {
    const n = b.capas.length, R = 200, paso = 40;
    /* la etiqueta baja hasta donde la cuerda del círculo mide al menos 190 px, así no se sale del borde */
    const prof = r => r > 110 ? Math.max(30, r - Math.sqrt(r * r - 95 * 95) + 8) : 30;
    const circ = b.capas.map((c, i) => { const r = R - i * paso; return `<g class="dg-capa" data-c="${i}"><circle cx="230" cy="${230 + i * 22}" r="${r}" class="dg-c dg-c${i}"/><text x="230" y="${230 + i * 22 - r + prof(r)}" text-anchor="middle" class="dg-t dg-t${i}">${esc(c.nombre)}</text></g>`; }).join("");
    return `<figure class="diagrama"><div class="dg-svg"><svg viewBox="0 0 460 470" role="img" aria-label="${esc(b.resumen || b.titulo)}">${circ}</svg></div>` +
      `<figcaption><h4>${esc(b.titulo)}</h4><dl class="dg-lista">${b.capas.map((c, i) => `<div class="dg-item" data-c="${i}" tabindex="0"><dt><i class="dg-dot dg-c${i}" aria-hidden="true"></i>${esc(c.nombre)}</dt><dd>${md(c.definicion).replace(/^<p>|<\/p>$/g, "")}</dd></div>`).join("")}</dl></figcaption></figure>`;
  },
  montar(el) {
    // Al pasar o enfocar una definición, se resalta su círculo (y al revés)
    const marcar = i => qsa(".dg-capa, .dg-item", el).forEach(x => x.classList.toggle("is-on", x.dataset.c === i));
    el.addEventListener("pointerover", e => { const t = e.target.closest("[data-c]"); if (t) marcar(t.dataset.c); });
    el.addEventListener("focusin", e => { const t = e.target.closest("[data-c]"); if (t) marcar(t.dataset.c); });
    el.addEventListener("pointerleave", () => marcar(null));
  }
});

/* ===================== Predictor de palabras de juguete ===================== */
registrar("predictor", {
  render: (b, ctx) => marco("predictor", b, ctx,
    `<p class="act-ayuda">${icono("science", "sm")}Es una simulación con datos fijos, escritos para el taller. Muestra la idea, no los números de un modelo real.</p>` +
    `<div class="connected pr-inicios" role="group" aria-label="Frase para empezar">${b.frases.map((f, i) => `<button type="button" data-fr="${i}" aria-pressed="${i === 0}">${esc(f.etiqueta)}</button>`).join("")}</div>` +
    `<div class="pr-frase" aria-live="polite"></div><div class="pr-cands"></div>` +
    `<div class="switch-row pr-temp"><label for="${fid(ctx, b, "t")}">Más sorpresa: le da más chances a las palabras menos probables</label><input class="switch" type="checkbox" role="switch" id="${fid(ctx, b, "t")}"></div>` +
    acciones(boton("reiniciar", "Empezar de nuevo", "btn-text", "replay"), boton("azar", "Que elija el modelo", "btn-tonal", "casino"))),
  montar(el, b, ctx) {
    let f = 0, texto = "", hecho = false;
    const temp = qs(".switch", el);
    const cands = () => (b.frases[f].siguientes[texto] || []);
    // Con "más sorpresa", la distribución se aplana (como subir la temperatura)
    const probs = lista => { const exp = temp.checked ? 0.45 : 1, w = lista.map(c => c.p ** exp), s = w.reduce((a, x) => a + x, 0); return lista.map((c, i) => ({ ...c, q: Math.round(w[i] / s * 100) })); };
    function pintar(foco) {
      const lista = probs(cands());
      qs(".pr-frase", el).innerHTML = `<p><span class="pr-base">${esc(b.frases[f].inicio)}</span>${esc(texto)}${lista.length ? '<span class="pr-hueco" aria-hidden="true"></span>' : ""}</p>`;
      qs(".pr-cands", el).innerHTML = lista.length
        ? `<p class="act-sub">¿Qué palabra sigue? Elegí una:</p><ul class="pr-lista">${lista.map((c, i) => `<li><button type="button" class="pr-op" data-c="${i}"><span class="pr-t">${esc(c.t.trim())}</span><span class="pr-bar" aria-hidden="true"><i style="width:${c.q}%"></i></span><span class="pr-q">${c.q} %</span></button></li>`).join("")}</ul>`
        : `<div class="status status-success">${icono("check_circle", "fill")}<div><b>Frase terminada</b><p>${esc(b.frases[f].cierre || "Cada palabra salió de elegir entre opciones probables.")}</p></div></div>`;
      qs('[data-a="azar"]', el).disabled = !lista.length;
      if (!lista.length && !hecho) { hecho = true; guardarResultado(ctx, b, { resultado: "hecho" }); }
      if (foco) qs(foco, el)?.focus();
    }
    function agregar(c) { texto += c.t; pintar(".pr-op") || (!cands().length && qs('[data-a="reiniciar"]', el).focus()); }
    el.addEventListener("click", e => {
      const fr = e.target.closest("[data-fr]");
      if (fr) { f = +fr.dataset.fr; texto = ""; qsa("[data-fr]", el).forEach(x => x.setAttribute("aria-pressed", String(x === fr))); pintar(); return; }
      const op = e.target.closest(".pr-op");
      if (op) { agregar(cands()[+op.dataset.c]); if (!cands().length) qs('[data-a="reiniciar"]', el).focus(); return; }
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "reiniciar") { texto = ""; pintar(".pr-op"); }
      if (a === "azar") {
        const lista = probs(cands()); let r = Math.random() * 100, elegido = lista[lista.length - 1];
        for (const c of lista) { if ((r -= c.q) <= 0) { elegido = c; break; } }
        agregar(elegido);
        if (cands().length) qs('[data-a="azar"]', el).focus(); else qs('[data-a="reiniciar"]', el).focus();
      }
    });
    temp.addEventListener("change", () => pintar());
    pintar();
  }
});
