/* Taller - IA | Bloque 5 (crear con IA): catálogo de herramientas, "Leé el agente", guion para voz y guía plegable
   - catalogo: herramientas de creación de un tipo (programar, imagen, audio, video, procedencia) desde content/herramientas.json.
   - agente: una conversación simulada con un agente de programación; la persona marca dónde revisaría o frenaría.
   - guion-voz: editor de un guion de 30 a 60 segundos, con marcas de pausa y énfasis y duración estimada.
   - guia: pasos opcionales dentro de un bloque plegable. */
import { esc, qs, qsa } from "../util.js";
import { icono, aviso, descargar } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar } from "../lesson/bloques.js";
import { leerJSON } from "../state.js";
import { marco, idDe, leer, guardarResultado, guardarParcial, mostrarFeedback, limpiarFeedback, acciones, boton, demorar, copiar } from "./comun.js";

const fid = (ctx, b, x) => esc(`${idDe(ctx, b)}-${x}`);

/* ===================== Catálogo de herramientas de creación ===================== */
registrar("catalogo", {
  render: b => `<section class="hr" aria-labelledby="cat-${esc(b.categoria)}"><h4 id="cat-${esc(b.categoria)}">${esc(b.titulo || "Algunas herramientas")}</h4><div class="hr-lista" aria-busy="true"><p class="muted">Cargando…</p></div></section>`,
  async montar(el, b) {
    const box = qs(".hr-lista", el);
    try {
      const d = await leerJSON("content/herramientas.json");
      const lista = d.creacion?.[b.categoria] || [];
      box.innerHTML = `<ul class="cat-lista">${lista.map(h => `<li class="cat-item${h.estado === "si" ? "" : " is-pend"}"><div class="cat-txt"><p class="cat-nom"><b>${esc(h.nombre)}</b> <span class="hr-emp">${esc(h.empresa)}</span></p>` +
        `<p class="cat-tipo">${esc(h.tipo)}</p><p class="cat-det">${h.estado === "si" ? esc(h.detalle) : "No pudimos confirmar su página oficial: buscala en el sitio de la empresa."}</p></div>` +
        (h.estado === "si" ? `<a class="btn btn-text" href="${esc(h.url)}" target="_blank" rel="noopener">${icono("open_in_new")}Sitio oficial<span class="sr-only"> de ${esc(h.nombre)} (se abre en otra pestaña)</span></a>` : "") + `</li>`).join("")}</ul>` +
        `<p class="ml-fecha">${icono("event", "sm")}Actualizado a: ${esc(d.actualizado)}. Son ejemplos: aparecen herramientas nuevas todo el tiempo y lo que importa es el proceso, que sirve con cualquiera.</p>`;
    } catch {
      box.innerHTML = `<p class="muted">No se pudo cargar la lista de herramientas. Revisá tu conexión y volvé a abrir este paso.</p>`;
    }
    box.removeAttribute("aria-busy");
  }
});

/* ===================== Leé el agente ===================== */
/* turnos: { quien: "persona" | "agente", t (markdown), codigo (opcional), frenar: true/false, porque } */
registrar("agente", {
  render: (b, ctx) => marco("agente", b, ctx,
    `<p class="act-ayuda">${icono("info", "sm")}En cada mensaje del agente, marcá "Revisaría o frenaría acá" si es un momento para leer con atención, pedir explicaciones o detenerlo.</p>` +
    `<ol class="ag-chat">${b.turnos.map((t, i) => `<li class="ag-turno ag-${t.quien}" data-t="${i}"><p class="ag-quien">${icono(t.quien === "agente" ? "smart_toy" : "person", "sm")}${t.quien === "agente" ? "Agente" : "Vos"}</p>` +
      `<div class="ag-msg">${md(t.t)}${t.codigo ? `<pre class="ag-cod">${esc(t.codigo)}</pre>` : ""}</div>` +
      (t.quien === "agente" ? `<button type="button" class="btn btn-outlined ag-marca" data-m="${i}" aria-pressed="false">${icono("pan_tool")}Revisaría o frenaría acá</button><div class="q-fb"></div>` : "") + `</li>`).join("")}</ol>` +
    acciones(boton("reintentar", "Reintentar", "btn-outlined", "replay"), boton("comprobar", "Comprobar", "btn-filled", "check"))),
  montar(el, b, ctx) {
    const marcadas = new Set(leer(ctx, b)?.respuesta || []);
    const reintentar = qs('[data-a="reintentar"]', el); reintentar.hidden = true;
    const pintar = () => qsa(".ag-marca", el).forEach(x => { const on = marcadas.has(+x.dataset.m); x.setAttribute("aria-pressed", String(on)); x.classList.toggle("btn-tonal", on); x.classList.toggle("btn-outlined", !on); });
    pintar();
    el.addEventListener("click", e => {
      const m = e.target.closest(".ag-marca");
      if (m && !el.classList.contains("is-checked")) { const i = +m.dataset.m; marcadas.has(i) ? marcadas.delete(i) : marcadas.add(i); pintar(); guardarParcial(ctx, b, [...marcadas]); return; }
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "comprobar") {
        const clave = b.turnos.map((t, i) => t.frenar ? i : -1).filter(i => i > -1);
        let bien = 0, demas = 0;
        b.turnos.forEach((t, i) => {
          if (t.quien !== "agente") return;
          const li = qs(`.ag-turno[data-t="${i}"]`, el), marcado = marcadas.has(i);
          const ok = marcado === !!t.frenar; if (t.frenar && marcado) bien++; if (!t.frenar && marcado) demas++;
          const cl = t.frenar ? (marcado ? "is-ok" : "is-missed") : (marcado ? "is-bad" : null); if (cl) li.classList.add(cl);
          qs(".q-fb", li).innerHTML = (t.frenar || marcado) ? `<div class="item-fb ${ok ? "is-ok" : "is-bad"}">${icono(ok ? "check_circle" : "error", "fill")}<span>${ok ? "" : t.frenar ? "<b>Este era un momento para frenar.</b> " : "<b>Acá se podía seguir.</b> "}${md(t.porque).replace(/^<p>|<\/p>$/g, "")}</span></div>` : "";
        });
        el.classList.add("is-checked"); qsa(".ag-marca", el).forEach(x => { x.disabled = true; });
        const res = bien === clave.length && !demas ? "correcto" : bien ? "parcial" : "incorrecto";
        guardarResultado(ctx, b, { resultado: res, puntaje: bien, total: clave.length, respuesta: [...marcadas] });
        mostrarFeedback(el, res, `Encontraste ${bien} de ${clave.length} momentos para revisar o frenar`, (demas ? `<p>${demas === 1 ? "Un mensaje marcado" : `${demas} mensajes marcados`} se podía${demas === 1 ? "" : "n"} dejar pasar: mirá la explicación de cada uno.</p>` : "") + (b.cierre ? md(b.cierre) : ""));
        qs('[data-a="comprobar"]', el).hidden = true; reintentar.hidden = false; reintentar.focus();
      }
      if (a === "reintentar") {
        marcadas.clear(); el.classList.remove("is-checked");
        qsa(".ag-turno", el).forEach(li => { li.classList.remove("is-ok", "is-bad", "is-missed"); const f = qs(".q-fb", li); if (f) f.innerHTML = ""; });
        qsa(".ag-marca", el).forEach(x => { x.disabled = false; });
        pintar(); limpiarFeedback(el); reintentar.hidden = true; qs('[data-a="comprobar"]', el).hidden = false; qs(".ag-marca", el).focus();
      }
    });
  }
});

/* ===================== Guion para voz ===================== */
/* Ritmo de lectura de referencia: unas 150 palabras por minuto. Las pausas suman un segundo cada una. */
const PPM = 150;
registrar("guion-voz", {
  render: (b, ctx) => marco("guion-voz", b, ctx,
    `<div class="gv-marcas" role="group" aria-label="Insertar marcas en el guion" data-excepcion-ds="acciones-alineacion">${boton("pausa", "Pausa", "btn-tonal", "pause")}${boton("enfasis", "Énfasis", "btn-tonal", "format_bold")}</div>` +
    `<div class="tf"><label for="${fid(ctx, b, "g")}">Tu guion</label><textarea class="field" id="${fid(ctx, b, "g")}" rows="9" aria-describedby="${fid(ctx, b, "gh")}"></textarea>` +
    `<span class="tf-help" id="${fid(ctx, b, "gh")}">[pausa] marca un silencio breve; *entre asteriscos* va lo que se dice con énfasis. Escribí los nombres propios como se pronuncian si hace falta, por ejemplo: Microsoft (se pronuncia "máicrosoft").</span></div>` +
    `<p class="gv-dur" aria-live="polite"></p>` +
    acciones(boton("ejemplo", "Ver un ejemplo", "btn-text", "auto_fix_high") + boton("copiar", "Copiar", "btn-outlined", "content_copy") + boton("descargar", "Descargar (.txt)", "btn-filled", "download"))),
  montar(el, b, ctx) {
    const ta = qs("textarea", el), dur = qs(".gv-dur", el);
    ta.value = leer(ctx, b)?.respuesta || "";
    const guardarB = demorar(() => guardarParcial(ctx, b, ta.value));
    const medir = () => {
      const texto = ta.value, pausas = (texto.match(/\[pausa\]/gi) || []).length;
      const palabras = texto.replace(/\[pausa\]/gi, " ").replace(/\*/g, "").split(/\s+/).filter(Boolean).length;
      const seg = Math.round(palabras / PPM * 60 + pausas);
      const estado = !palabras ? "" : seg < 30 ? " Le falta: el objetivo es de 30 a 60 segundos." : seg > 60 ? " Se pasa: recortá para que quede en 60 segundos o menos." : " Está dentro del objetivo.";
      dur.textContent = palabras ? `${palabras} palabras y ${pausas} ${pausas === 1 ? "pausa" : "pausas"}: unos ${seg} segundos leído a ritmo tranquilo.${estado}` : "Escribí tu guion: acá vas a ver cuánto dura.";
      return seg;
    };
    medir();
    const insertar = txt => { const i = ta.selectionStart, f = ta.selectionEnd, sel = ta.value.slice(i, f); const nuevo = txt === "*" ? `*${sel || "texto"}*` : " [pausa] "; ta.setRangeText(nuevo, i, f, "end"); ta.focus(); medir(); guardarB(); };
    ta.addEventListener("input", () => { medir(); guardarB(); });
    el.addEventListener("click", async e => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
      if (a === "pausa") insertar("pausa");
      if (a === "enfasis") insertar("*");
      if (a === "ejemplo") { mostrarFeedback(el, "info", "Un ejemplo de 40 segundos", `<pre class="sn-texto">${esc(b.ejemplo)}</pre><p>Fijate dónde van las pausas: después de la pregunta inicial y antes de la idea más importante.</p>`); }
      const t = ta.value.trim();
      if ((a === "copiar" || a === "descargar") && !t) { mostrarFeedback(el, "info", "Todavía no escribiste el guion."); ta.focus(); return; }
      if (a === "copiar") aviso(await copiar(t) ? "Copiado al portapapeles" : "No se pudo copiar. Seleccioná el texto y copialo a mano.");
      if (a === "descargar") {
        const seg = medir();
        descargar(`${b.archivo || "guion-para-voz"}.txt`, `${b.titulo || "Guion para voz"}\nDuración estimada: ${seg} segundos\n\n${t}\n`, "text/plain");
        guardarResultado(ctx, b, { resultado: "hecho", respuesta: t });
        mostrarFeedback(el, "hecho", "Guion descargado", "<p>Antes de grabarlo o pasarlo a una voz sintética, revisalo con la lista de calidad de abajo.</p>");
      }
    });
  }
});

/* ===================== Guía plegable ===================== */
registrar("guia", {
  render: b => `<details class="guia"><summary>${icono(b.icono || "menu_book", "sm")}<span>${esc(b.titulo)}</span></summary><div class="guia-cuerpo lesson-text">${md(b.md)}</div></details>`
});
