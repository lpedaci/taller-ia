/* Taller - IA | Bloque 7 (aplicar): rúbrica, proyecto final y certificado
   - rubrica: los criterios del proyecto final con sus tres niveles, visible desde el inicio del módulo.
   - proyecto: elegir una de tres opciones, completar la plantilla guiada, autoevaluarse con la rúbrica
     y exportar un documento imprimible.
   - certificado: certificado de finalización generado en el navegador, con el nombre de la persona. */
import { esc, qs, qsa } from "../util.js";
import { icono, aviso } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar } from "../lesson/bloques.js";
import { perfil, setNombre, completados, datos, actividadGuardada } from "../state.js";
import { marco, idDe, leer, esPrueba, guardarResultado, guardarParcial, mostrarFeedback, acciones, boton, demorar } from "./comun.js";
import { procesoDeterminado } from "../estados.js";
import { pintarPersona } from "../shell.js";

const fid = (ctx, b, x) => esc(`${idDe(ctx, b)}-${x}`);
const NIVELES = ["Inicial", "En desarrollo", "Logrado"];

/** Imprime solo el nodo indicado (mismo mecanismo que el storyboard) */
function imprimir(nodo) {
  nodo.classList.add("imprimir"); document.body.classList.add("imprimiendo");
  const fin = () => { nodo.classList.remove("imprimir"); document.body.classList.remove("imprimiendo"); removeEventListener("afterprint", fin); };
  addEventListener("afterprint", fin); print(); setTimeout(fin, 1000);
}

/* ===================== Rúbrica ===================== */
export function rubricaHTML(r, id) {
  return `<div class="tbl-edit-wrap rub-wrap" role="region" tabindex="0" aria-label="${esc(r.titulo || "Rúbrica del proyecto final")} (se puede desplazar)"><table class="tbl rub"><caption class="sr-only">${esc(r.titulo || "Rúbrica del proyecto final")}</caption>` +
    `<thead><tr><th scope="col">Criterio</th>${NIVELES.map(n => `<th scope="col">${n}</th>`).join("")}</tr></thead><tbody>` +
    r.criterios.map(c => `<tr><th scope="row"><b>${esc(c.titulo)}</b><span>${esc(c.descripcion || "")}</span></th>${c.niveles.map((n, i) => `<td data-col="${NIVELES[i]}">${esc(n)}</td>`).join("")}</tr>`).join("") +
    `</tbody></table></div>`;
}
registrar("rubrica", {
  render: b => `<section class="rub-box" aria-labelledby="rub-${esc(b.id || "t")}"><h4 id="rub-${esc(b.id || "t")}">${esc(b.titulo || "Rúbrica")}</h4>${b.intro ? md(b.intro) : ""}${rubricaHTML(b, b.id)}</section>`
});

/* ===================== Proyecto final ===================== */
registrar("proyecto", {
  render: (b, ctx) => marco("proyecto", b, ctx,
    `<fieldset class="deb-pos"><legend class="act-sub">1. Elegí tu proyecto</legend>` +
    b.opciones.map(o => `<label class="deb-op"><input type="radio" name="${fid(ctx, b, "o")}" value="${esc(o.id)}"><span class="deb-txt"><b>${esc(o.titulo)}</b><span>${esc(o.descripcion)}</span></span></label>`).join("") + `</fieldset>` +
    `<div class="proy-campos"><p class="act-sub">2. Completá la plantilla</p>` +
    b.campos.map(c => `<div class="tf"><label for="${fid(ctx, b, c.id)}">${esc(c.etiqueta)}${c.obligatorio === false ? ' <span class="opc">(si corresponde)</span>' : ""}</label>` +
      `<textarea class="field" id="${fid(ctx, b, c.id)}" data-campo="${esc(c.id)}" rows="${c.filas || 3}" aria-describedby="${fid(ctx, b, c.id)}-h"></textarea><span class="tf-help" id="${fid(ctx, b, c.id)}-h">${esc(c.ayuda || "")}</span></div>`).join("") + `</div>` +
    `<fieldset class="proy-auto"><legend class="act-sub">3. Autoevaluate con la rúbrica</legend>` +
    b.rubrica.criterios.map((c, i) => `<fieldset class="proy-crit"><legend>${esc(c.titulo)}</legend><div class="proy-niv">${NIVELES.map((n, k) => `<label class="opt opt-sm"><input type="radio" name="${fid(ctx, b, "r" + i)}" value="${k}" data-crit="${i}"><span>${n}</span></label>`).join("")}</div></fieldset>`).join("") + `</fieldset>` +
    acciones(boton("imprimir", "Imprimir o guardar como PDF", "btn-outlined", "print") + boton("guardar", "Guardar mi proyecto", "btn-filled", "save")) +
    `<div class="doc-imp" aria-hidden="true"></div>`),
  montar(el, b, ctx) {
    const prev = leer(ctx, b)?.respuesta || {};
    const valores = { ...(prev.valores || {}) }, auto = { ...(prev.auto || {}) };
    let opcion = prev.opcion || null;
    if (opcion) { const r = qs(`input[value="${CSS.escape(opcion)}"]`, el); if (r) r.checked = true; }
    qsa("[data-campo]", el).forEach(t => { t.value = valores[t.dataset.campo] || ""; });
    Object.entries(auto).forEach(([i, k]) => { const r = qs(`input[data-crit="${i}"][value="${k}"]`, el); if (r) r.checked = true; });
    const estado = () => ({ opcion, valores, auto });
    const guardarB = demorar(() => guardarParcial(ctx, b, estado()));
    const ponerAyudas = () => {
      const op = b.opciones.find(o => o.id === opcion);
      b.campos.forEach(c => { const h = qs(`#${CSS.escape(idDe(ctx, b))}-${c.id}-h`, el); if (h) h.textContent = (c.ayuda || "") + (op?.ejemplos?.[c.id] ? ` Por ejemplo: ${op.ejemplos[c.id]}` : ""); });
    };
    ponerAyudas();
    el.addEventListener("change", e => {
      if (e.target.name === `${idDe(ctx, b)}-o`) { opcion = e.target.value; ponerAyudas(); guardarB(); }
      if (e.target.dataset.crit != null) { auto[e.target.dataset.crit] = +e.target.value; guardarB(); }
    });
    el.addEventListener("input", e => { const t = e.target.closest("[data-campo]"); if (t) { valores[t.dataset.campo] = t.value; guardarB(); } });
    const documento = () => {
      const op = b.opciones.find(o => o.id === opcion), p = perfil();
      return `<h2>Proyecto final | Taller - IA</h2><p class="doc-meta">${p.nombreCompleto ? esc(p.nombreCompleto) + " | " : ""}${new Date().toLocaleDateString("es-AR", { dateStyle: "long" })}</p>` +
        `<h3>${esc(op ? op.titulo : "Proyecto sin opción elegida")}</h3>` +
        b.campos.filter(c => (valores[c.id] || "").trim()).map(c => `<h4>${esc(c.etiqueta)}</h4><p class="doc-txt">${esc(valores[c.id].trim())}</p>`).join("") +
        `<h4>Autoevaluación</h4><ul>${b.rubrica.criterios.map((c, i) => `<li>${esc(c.titulo)}: ${auto[i] != null ? NIVELES[auto[i]] : "sin completar"}</li>`).join("")}</ul>`;
    };
    el.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
      if (a === "imprimir") { const d = qs(".doc-imp", el); d.innerHTML = documento(); imprimir(d); }
      if (a === "guardar") {
        const faltan = [];
        if (!opcion) faltan.push("elegir una de las tres opciones");
        b.campos.filter(c => c.obligatorio !== false && !(valores[c.id] || "").trim()).forEach(c => faltan.push(`"${c.etiqueta}"`));
        const sinAuto = b.rubrica.criterios.filter((c, i) => auto[i] == null).length;
        if (faltan.length) {
          mostrarFeedback(el, "info", "Te falta completar algunas partes", `<p>Para guardar tu proyecto: ${esc(faltan.join(", "))}. Lo que escribiste ya está guardado como borrador.</p>`);
          const f = !opcion ? qs("input[type=radio]", el) : qs(`[data-campo="${b.campos.find(c => c.obligatorio !== false && !(valores[c.id] || "").trim()).id}"]`, el); f?.focus(); return;
        }
        guardarResultado(ctx, b, { resultado: "hecho", respuesta: estado() });
        mostrarFeedback(el, "hecho", esPrueba(ctx) ? "Listo (en la lección de prueba no se guarda)" : "Guardamos tu proyecto final",
          `<p>${sinAuto ? `Te ${sinAuto === 1 ? "falta un criterio" : `faltan ${sinAuto} criterios`} de la autoevaluación: completalos cuando puedas. ` : ""}Podés imprimirlo o guardarlo como PDF para presentarlo. También quedó en tus evidencias.</p>`);
      }
    });
  }
});

/* ===================== Certificado de finalización ===================== */
registrar("certificado", {
  render: (b, ctx) => marco("certificado", b, ctx,
    `<div class="tf"><label for="${fid(ctx, b, "n")}">Tu nombre, como querés que aparezca</label><input class="field" id="${fid(ctx, b, "n")}" autocomplete="name" aria-describedby="${fid(ctx, b, "nh")}"><span class="tf-help" id="${fid(ctx, b, "nh")}">Se usa solo para el certificado y queda guardado en este navegador.</span></div>` +
    `<p class="cert-estado"></p>` +
    acciones(boton("generar", "Generar certificado", "btn-filled", "workspace_premium")) +
    `<div class="cert-vista" hidden></div>`),
  montar(el, b, ctx) {
    const inp = qs("input", el); inp.value = perfil().nombreCompleto;
    const proyectoListo = () => esPrueba(ctx) || actividadGuardada(b.requiere)?.resultado === "hecho";
    const total = datos.modulos.length, hechos = completados().length;
    qs(".cert-estado", el).innerHTML = `${icono(proyectoListo() ? "check_circle" : "info", proyectoListo() ? "fill" : "")}<span>${proyectoListo() ? "Tu proyecto final está guardado." : "Para generar el certificado, primero guardá tu proyecto final (paso 2 de este módulo)."} Completaste ${hechos} de ${total} módulos.</span>`;
    el.addEventListener("click", async e => {
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "imprimir-cert") { imprimir(qs(".cert", el)); return; }
      if (a !== "generar") return;
      const nombre = inp.value.trim();
      if (!nombre) { mostrarFeedback(el, "info", "Escribí tu nombre", "<p>Es lo que va a aparecer en el certificado.</p>"); inp.focus(); return; }
      if (!proyectoListo()) { mostrarFeedback(el, "info", "Todavía no guardaste tu proyecto final", `<p>Volvé al <a href="#/modulo/20/paso/2">paso 2</a>, completalo y guardalo. Después generá el certificado.</p>`); return; }
      if (!esPrueba(ctx)) { setNombre(nombre); pintarPersona(); }
      // Proceso con duración conocida: indicador determinado con el paso actual
      const pasos = ["revisando tu recorrido", "armando el certificado"];
      const p = procesoDeterminado("Generando tu certificado", pasos);
      for (let i = 0; i < pasos.length; i++) { p.paso(i); await new Promise(r => setTimeout(r, 450)); }
      p.paso(pasos.length); await new Promise(r => setTimeout(r, 250)); p.cerrar();
      const fecha = new Date().toLocaleDateString("es-AR", { dateStyle: "long" });
      const vista = qs(".cert-vista", el);
      vista.innerHTML = `<article class="cert" aria-labelledby="${fid(ctx, b, "ct")}"><p class="cert-k">Certificado de finalización</p>` +
        `<h5 id="${fid(ctx, b, "ct")}" class="cert-nombre">${esc(nombre)}</h5>` +
        `<p class="cert-txt">completó el taller <b>Taller - IA: usar la inteligencia artificial generativa con criterio</b>, ${hechos ? `con ${hechos} de ${total} módulos y ` : "con "}un proyecto final aplicado.</p>` +
        `<p class="cert-fecha">${esc(fecha)}</p>` +
        `<div class="cert-firma"><p class="cert-firma-n">Lourdes Pedaci</p><p>Experience Designer, autora del taller</p></div>` +
        `<p class="cert-aviso">Este es un certificado del taller, emitido por su autora. No es un certificado de Anthropic, Google, OpenAI ni Microsoft, ni de ninguna institución educativa.</p></article>` +
        acciones(boton("imprimir-cert", "Imprimir o guardar como PDF", "btn-filled", "print"));
      vista.hidden = false;
      guardarResultado(ctx, b, { resultado: "hecho", respuesta: { nombre, fecha } });
      qs('[data-a="generar"]', el).lastChild.textContent = "Volver a generar";
      qs(".cert", vista).setAttribute("tabindex", "-1"); qs(".cert", vista).focus();
      aviso("Certificado listo");
    });
  }
});
