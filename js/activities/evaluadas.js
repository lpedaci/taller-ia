/* Taller - IA | Actividades evaluadas: opción múltiple, verdadero o falso, clasificador,
   marcar errores y escenario ramificado. Todas se completan solo con teclado y tienen reintento. */
import { esc, qs, qsa } from "../util.js";
import { icono } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar } from "../lesson/bloques.js";
import { marco, idDe, leer, guardarResultado, mostrarFeedback, limpiarFeedback, marcaItem, acciones, boton } from "./comun.js";

const enLinea = t => md(t).replace(/^<p>|<\/p>$/g, "");
const resultadoDe = (bien, total) => bien === total ? "correcto" : bien > 0 ? "parcial" : "incorrecto";

/* ===================== Opción múltiple ===================== */
registrar("quiz", {
  render: (b, ctx) => marco("quiz", b, ctx,
    b.preguntas.map((q, i) => `<fieldset class="q" data-q="${i}"><legend><span class="q-n">${i + 1}.</span> ${enLinea(q.texto)}</legend><div class="opts">` +
      q.opciones.map((o, j) => `<label class="opt"><input type="radio" name="${esc(idDe(ctx, b))}-q${i}" value="${j}"><span>${enLinea(o.texto)}</span></label>`).join("") +
      `</div><div class="q-fb"></div></fieldset>`).join("") +
    acciones(boton("comprobar", "Comprobar", "btn-filled", "check"), boton("reintentar", "Reintentar", "btn-outlined", "replay"))),
  montar(el, b, ctx) {
    const reintentar = qs('[data-a="reintentar"]', el); reintentar.hidden = true;
    const previo = leer(ctx, b);
    if (previo?.respuesta) previo.respuesta.forEach((v, i) => { const r = qs(`[data-q="${i}"] input[value="${v}"]`, el); if (r) r.checked = true; });
    function comprobar() {
      const resp = b.preguntas.map((_, i) => { const r = qs(`[data-q="${i}"] input:checked`, el); return r ? +r.value : null; });
      const falta = resp.findIndex(v => v === null);
      if (falta > -1) { mostrarFeedback(el, "info", `Respondé las ${b.preguntas.length} preguntas para comprobar.`); qs(`[data-q="${falta}"] input`, el).focus(); return; }
      let bien = 0;
      b.preguntas.forEach((q, i) => {
        const o = q.opciones[resp[i]], ok = !!o.correcta; if (ok) bien++;
        qs(`[data-q="${i}"] .q-fb`, el).innerHTML = marcaItem(ok, o.feedback || q.explicacion || "");
        qsa(`[data-q="${i}"] input`, el).forEach(r => { r.disabled = true; });
        qs(`[data-q="${i}"]`, el).classList.add(ok ? "is-ok" : "is-bad");
      });
      const res = resultadoDe(bien, b.preguntas.length);
      guardarResultado(ctx, b, { resultado: res, puntaje: bien, total: b.preguntas.length, respuesta: resp });
      mostrarFeedback(el, res, `${bien} de ${b.preguntas.length} respuestas correctas`, res === "correcto" ? "<p>Leé igual las explicaciones: dicen por qué cada respuesta es la adecuada.</p>" : "<p>Leé la explicación de cada pregunta y probá de nuevo.</p>");
      qs('[data-a="comprobar"]', el).hidden = true; reintentar.hidden = false; reintentar.focus();
    }
    el.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "comprobar") comprobar();
      if (a === "reintentar") {
        qsa("input", el).forEach(r => { r.checked = false; r.disabled = false; });
        qsa(".q-fb", el).forEach(f => { f.innerHTML = ""; }); qsa(".q", el).forEach(f => f.classList.remove("is-ok", "is-bad"));
        limpiarFeedback(el); reintentar.hidden = true; qs('[data-a="comprobar"]', el).hidden = false; qs("input", el).focus();
      }
    });
  }
});

/* ===================== Verdadero o falso con justificación ===================== */
registrar("vf", {
  render: (b, ctx) => marco("vf", b, ctx,
    b.afirmaciones.map((a, i) => { const n = `${idDe(ctx, b)}-a${i}`;
      return `<fieldset class="q vf" data-q="${i}"><legend><span class="q-n">${i + 1}.</span> ${enLinea(a.texto)}</legend>` +
        `<div class="vf-opts"><label class="opt opt-sm"><input type="radio" name="${esc(n)}" value="v"><span>Verdadero</span></label><label class="opt opt-sm"><input type="radio" name="${esc(n)}" value="f"><span>Falso</span></label></div>` +
        `<div class="tf vf-just"><label for="${esc(n)}-j">¿Por qué? Justificá en una oración</label><textarea class="field" id="${esc(n)}-j" rows="2"></textarea></div><div class="q-fb"></div></fieldset>`; }).join("") +
    acciones(boton("comprobar", "Comprobar", "btn-filled", "check"), boton("reintentar", "Reintentar", "btn-outlined", "replay"))),
  montar(el, b, ctx) {
    const reintentar = qs('[data-a="reintentar"]', el); reintentar.hidden = true;
    const previo = leer(ctx, b);
    previo?.respuesta?.forEach((r, i) => { if (r.v) { const x = qs(`[data-q="${i}"] input[value="${r.v}"]`, el); if (x) x.checked = true; } qs(`[data-q="${i}"] textarea`, el).value = r.j || ""; });
    el.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "comprobar") {
        const resp = b.afirmaciones.map((_, i) => ({ v: qs(`[data-q="${i}"] input:checked`, el)?.value || null, j: qs(`[data-q="${i}"] textarea`, el).value.trim() }));
        const falta = resp.findIndex(r => !r.v);
        if (falta > -1) { mostrarFeedback(el, "info", "Elegí verdadero o falso en cada afirmación para comprobar."); qs(`[data-q="${falta}"] input`, el).focus(); return; }
        let bien = 0;
        b.afirmaciones.forEach((af, i) => {
          const ok = (resp[i].v === "v") === !!af.verdadero; if (ok) bien++;
          qs(`[data-q="${i}"] .q-fb`, el).innerHTML = marcaItem(ok, `Es ${af.verdadero ? "verdadero" : "falso"}. ${af.explicacion}`);
          qs(`[data-q="${i}"]`, el).classList.add(ok ? "is-ok" : "is-bad");
        });
        const sinJust = resp.filter(r => !r.j).length;
        const res = resultadoDe(bien, b.afirmaciones.length);
        guardarResultado(ctx, b, { resultado: res, puntaje: bien, total: b.afirmaciones.length, respuesta: resp });
        mostrarFeedback(el, res, `${bien} de ${b.afirmaciones.length} afirmaciones bien clasificadas`,
          `<p>Compará tu justificación con la explicación de cada afirmación.${sinJust ? ` Te ${sinJust === 1 ? "faltó justificar una" : `faltaron justificar ${sinJust}`}: escribir el porqué ayuda a fijar el criterio.` : ""}</p>`);
        qs('[data-a="comprobar"]', el).hidden = true; reintentar.hidden = false; reintentar.focus();
      }
      if (a === "reintentar") {
        qsa("input", el).forEach(r => { r.checked = false; }); qsa(".q-fb", el).forEach(f => { f.innerHTML = ""; });
        qsa(".q", el).forEach(f => f.classList.remove("is-ok", "is-bad"));
        limpiarFeedback(el); reintentar.hidden = true; qs('[data-a="comprobar"]', el).hidden = false; qs("input", el).focus();
      }
    });
  }
});

/* ===================== Clasificador (arrastrar o "Mover a") ===================== */
registrar("clasificador", {
  render: (b, ctx) => {
    const id = idDe(ctx, b);
    const opciones = sel => `<option value="">Sin clasificar</option>` + b.categorias.map(c => `<option value="${esc(c.id)}"${sel === c.id ? " selected" : ""}>${esc(c.titulo)}</option>`).join("");
    const item = (it, i) => `<li class="cls-item" data-i="${i}" draggable="true"><span class="cls-txt" id="${esc(id)}-i${i}">${enLinea(it.texto)}</span>` +
      `<label class="sr-only" for="${esc(id)}-s${i}">Mover a</label><select class="cls-sel" id="${esc(id)}-s${i}" data-i="${i}" aria-describedby="${esc(id)}-i${i}">${opciones("")}</select><div class="q-fb"></div></li>`;
    return marco("clasificador", b, ctx,
      `<p class="act-ayuda">${icono("info", "sm")}Arrastrá cada tarjeta a su columna, o elegí la columna en "Mover a".</p>` +
      `<div class="cls-zonas" style="--cols:${b.categorias.length}"><section class="cls-zona cls-pool" data-cat="" aria-labelledby="${esc(id)}-z0"><h5 id="${esc(id)}-z0">Por clasificar <span class="cls-n"></span></h5><ul class="cls-list">${b.items.map(item).join("")}</ul></section>` +
      b.categorias.map((c, k) => `<section class="cls-zona" data-cat="${esc(c.id)}" aria-labelledby="${esc(id)}-z${k + 1}"><h5 id="${esc(id)}-z${k + 1}">${esc(c.titulo)} <span class="cls-n"></span></h5>${c.descripcion ? `<p class="cls-desc">${esc(c.descripcion)}</p>` : ""}<ul class="cls-list"></ul></section>`).join("") +
      `</div>` + acciones(boton("comprobar", "Comprobar", "btn-filled", "check"), boton("reintentar", "Reintentar", "btn-outlined", "replay")));
  },
  montar(el, b, ctx) {
    const reintentar = qs('[data-a="reintentar"]', el); reintentar.hidden = true;
    const zona = cat => qs(`.cls-zona[data-cat="${cat}"] .cls-list`, el);
    const contar = () => qsa(".cls-zona", el).forEach(z => { const n = qsa(".cls-item", z).length; qs(".cls-n", z).textContent = `(${n})`; });
    function mover(i, cat, enfocar) {
      const li = qs(`.cls-item[data-i="${i}"]`, el); zona(cat).appendChild(li);
      qs("select", li).value = cat; contar();
      if (enfocar) qs("select", li).focus();
    }
    const previo = leer(ctx, b);
    previo?.respuesta?.forEach((cat, i) => { if (cat) mover(i, cat); });
    contar();
    el.addEventListener("change", e => { const s = e.target.closest(".cls-sel"); if (s) mover(+s.dataset.i, s.value, true); });
    // Arrastrar y soltar con mouse (alternativa siempre disponible: "Mover a")
    let arrastrado = null;
    el.addEventListener("dragstart", e => { const li = e.target.closest(".cls-item"); if (!li || el.classList.contains("is-checked")) { e.preventDefault(); return; } arrastrado = li.dataset.i; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", arrastrado); li.classList.add("is-drag"); });
    el.addEventListener("dragend", e => { e.target.closest(".cls-item")?.classList.remove("is-drag"); qsa(".cls-zona", el).forEach(z => z.classList.remove("is-over")); });
    el.addEventListener("dragover", e => { const z = e.target.closest(".cls-zona"); if (z && arrastrado !== null) { e.preventDefault(); qsa(".cls-zona", el).forEach(x => x.classList.toggle("is-over", x === z)); } });
    el.addEventListener("drop", e => { const z = e.target.closest(".cls-zona"); if (!z || arrastrado === null) return; e.preventDefault(); mover(+arrastrado, z.dataset.cat); arrastrado = null; z.classList.remove("is-over"); });
    el.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "comprobar") {
        const resp = b.items.map((_, i) => qs(`.cls-item[data-i="${i}"] select`, el).value);
        const falta = resp.findIndex(v => !v);
        if (falta > -1) { mostrarFeedback(el, "info", `Te faltan ${resp.filter(v => !v).length} tarjetas por clasificar.`); qs(`.cls-item[data-i="${falta}"] select`, el).focus(); return; }
        let bien = 0;
        b.items.forEach((it, i) => {
          const ok = resp[i] === it.categoria; if (ok) bien++;
          const cat = b.categorias.find(c => c.id === it.categoria);
          const li = qs(`.cls-item[data-i="${i}"]`, el);
          qs(".q-fb", li).innerHTML = marcaItem(ok, (ok ? "" : `Va en "${cat.titulo}". `) + (it.feedback || ""));
          li.classList.add(ok ? "is-ok" : "is-bad"); qs("select", li).disabled = true; li.draggable = false;
        });
        el.classList.add("is-checked");
        const res = resultadoDe(bien, b.items.length);
        guardarResultado(ctx, b, { resultado: res, puntaje: bien, total: b.items.length, respuesta: resp });
        mostrarFeedback(el, res, `${bien} de ${b.items.length} tarjetas en su lugar`, "<p>Cada tarjeta explica por qué va en su columna.</p>");
        qs('[data-a="comprobar"]', el).hidden = true; reintentar.hidden = false; reintentar.focus();
      }
      if (a === "reintentar") {
        el.classList.remove("is-checked");
        b.items.forEach((_, i) => { const li = qs(`.cls-item[data-i="${i}"]`, el); li.classList.remove("is-ok", "is-bad"); qs(".q-fb", li).innerHTML = ""; qs("select", li).disabled = false; li.draggable = true; mover(i, ""); });
        limpiarFeedback(el); reintentar.hidden = true; qs('[data-a="comprobar"]', el).hidden = false; qs(".cls-sel", el).focus();
      }
    });
  }
});

/* ===================== Marcar errores en un texto ===================== */
registrar("errores", {
  render: (b, ctx) => marco("errores", b, ctx,
    `<p class="act-ayuda">${icono("info", "sm")}Tocá cada parte del texto que tenga un error. Las partes marcadas aparecen abajo para que expliques el problema.</p>` +
    `<div class="err-texto">${b.segmentos.map((s, i) => `<button type="button" class="seg" data-s="${i}" aria-pressed="false">${esc(s.t)}</button>`).join(" ")}</div>` +
    `<div class="err-marcas" aria-live="polite"></div>` +
    acciones(boton("comprobar", "Comprobar", "btn-filled", "check"), boton("reintentar", "Reintentar", "btn-outlined", "replay"))),
  montar(el, b, ctx) {
    const reintentar = qs('[data-a="reintentar"]', el); reintentar.hidden = true;
    const marcadas = new Map(); // índice -> justificación
    const previo = leer(ctx, b);
    previo?.respuesta?.forEach(r => marcadas.set(r.i, r.j || ""));
    function pintarMarcas() {
      qsa(".seg", el).forEach(s => s.setAttribute("aria-pressed", String(marcadas.has(+s.dataset.s))));
      const box = qs(".err-marcas", el), lista = [...marcadas.keys()].sort((a, c) => a - c);
      box.innerHTML = lista.length ? `<h5>Partes marcadas (${lista.length})</h5>` + lista.map(i => `<div class="err-item" data-m="${i}"><p class="err-cita">"${esc(b.segmentos[i].t)}"</p>` +
        `<div class="tf"><label for="${esc(idDe(ctx, b))}-j${i}">¿Qué error tiene?</label><input class="field" id="${esc(idDe(ctx, b))}-j${i}" data-j="${i}" value="${esc(marcadas.get(i))}" autocomplete="off"></div><div class="q-fb"></div></div>`).join("") : "";
    }
    pintarMarcas();
    el.addEventListener("input", e => { const j = e.target.closest("[data-j]"); if (j) marcadas.set(+j.dataset.j, j.value); });
    el.addEventListener("click", e => {
      const s = e.target.closest(".seg");
      if (s && !el.classList.contains("is-checked")) { const i = +s.dataset.s; marcadas.has(i) ? marcadas.delete(i) : marcadas.set(i, ""); pintarMarcas(); qs(`.seg[data-s="${i}"]`, el).focus(); return; }
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "comprobar") {
        if (!marcadas.size) { mostrarFeedback(el, "info", "Marcá al menos una parte del texto para comprobar."); qs(".seg", el).focus(); return; }
        const errores = b.segmentos.map((s, i) => s.error ? i : -1).filter(i => i > -1);
        let encontrados = 0, falsos = 0;
        marcadas.forEach((_, i) => {
          const s = b.segmentos[i], ok = !!s.error; ok ? encontrados++ : falsos++;
          qs(`.err-item[data-m="${i}"] .q-fb`, el).innerHTML = marcaItem(ok, ok ? `**${s.error.tipo}.** ${s.error.explicacion}` : (s.nota || "Esta parte no tiene un error."));
          qs(`.seg[data-s="${i}"]`, el).classList.add(ok ? "is-ok" : "is-bad");
        });
        const faltan = errores.filter(i => !marcadas.has(i));
        faltan.forEach(i => qs(`.seg[data-s="${i}"]`, el).classList.add("is-missed"));
        el.classList.add("is-checked"); qsa(".seg", el).forEach(x => { x.disabled = true; });
        const res = encontrados === errores.length && !falsos ? "correcto" : encontrados ? "parcial" : "incorrecto";
        guardarResultado(ctx, b, { resultado: res, puntaje: encontrados, total: errores.length, respuesta: [...marcadas].map(([i, j]) => ({ i, j })) });
        mostrarFeedback(el, res, `Encontraste ${encontrados} de ${errores.length} errores`,
          (faltan.length ? `<p>Te ${faltan.length === 1 ? "faltó" : "faltaron"}:</p><ul>${faltan.map(i => `<li><b>${esc(b.segmentos[i].error.tipo)}:</b> "${esc(b.segmentos[i].t)}". ${esc(b.segmentos[i].error.explicacion)}</li>`).join("")}</ul>` : "") +
          (falsos ? `<p>${falsos === 1 ? "Una parte marcada estaba bien" : `${falsos} partes marcadas estaban bien`}: revisá la explicación de cada una.</p>` : ""));
        qs('[data-a="comprobar"]', el).hidden = true; reintentar.hidden = false; reintentar.focus();
      }
      if (a === "reintentar") {
        marcadas.clear(); el.classList.remove("is-checked");
        qsa(".seg", el).forEach(x => { x.disabled = false; x.classList.remove("is-ok", "is-bad", "is-missed"); });
        pintarMarcas(); limpiarFeedback(el); reintentar.hidden = true; qs('[data-a="comprobar"]', el).hidden = false; qs(".seg", el).focus();
      }
    });
  }
});

/* ===================== Escenario ramificado ===================== */
const TONO = { positivo: ["status-success", "check_circle"], atencion: ["status-warning", "warning"], negativo: ["status-error", "error"], neutro: ["status-info", "info"] };
registrar("escenario", {
  render: (b, ctx) => marco("escenario", b, ctx, `<div class="esc-camino" role="group" aria-label="Tus decisiones"></div><div class="esc-nodo"></div>`),
  montar(el, b, ctx) {
    let camino = [];
    const nodoEl = qs(".esc-nodo", el), caminoEl = qs(".esc-camino", el);
    function pintarCamino() {
      caminoEl.innerHTML = camino.length ? `<ol>${camino.map(c => `<li>${icono("subdirectory_arrow_right", "sm")}${esc(c)}</li>`).join("")}</ol>` : "";
    }
    function mostrar(id, enfocar) {
      const n = b.nodos[id]; if (!n) return;
      if (n.final) {
        const [cls, ic] = TONO[n.tono || "neutro"];
        nodoEl.innerHTML = `<div class="status ${cls}">${icono(ic, "fill")}<div><b id="${esc(idDe(ctx, b))}-fin" tabindex="-1">${esc(n.titulo || "Final")}</b>${md(n.texto)}</div></div>` +
          acciones(boton("reiniciar", "Volver a empezar", "btn-outlined", "replay"));
        guardarResultado(ctx, b, { resultado: "hecho", final: id, tono: n.tono || "neutro", respuesta: camino });
        if (enfocar) qs(`#${CSS.escape(idDe(ctx, b))}-fin`, el).focus();
        return;
      }
      nodoEl.innerHTML = `<div class="esc-texto" tabindex="-1">${md(n.texto)}</div><p class="esc-preg">${esc(n.pregunta || "¿Qué hacés?")}</p>` +
        `<div class="esc-ops">${n.opciones.map((o, i) => `<button class="esc-op" type="button" data-op="${i}">${icono("arrow_forward", "sm")}<span>${esc(o.texto)}</span></button>`).join("")}</div>`;
      if (enfocar) qs(".esc-texto", nodoEl).focus();
      nodoEl.dataset.nodo = id;
    }
    el.addEventListener("click", e => {
      const op = e.target.closest("[data-op]");
      if (op) {
        const n = b.nodos[nodoEl.dataset.nodo], o = n.opciones[+op.dataset.op];
        camino.push(o.texto); pintarCamino();
        const [cls, ic] = TONO[o.tono || "neutro"];
        nodoEl.innerHTML = `<div class="status ${cls}">${icono(ic, "fill")}<div><b id="${esc(idDe(ctx, b))}-cons" tabindex="-1">Qué pasa</b>${md(o.consecuencia)}</div></div>` +
          acciones(boton("seguir", "Continuar", "btn-filled", "arrow_forward"));
        nodoEl.dataset.destino = o.destino;
        qs(`#${CSS.escape(idDe(ctx, b))}-cons`, el).focus();
        return;
      }
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "seguir") mostrar(nodoEl.dataset.destino, true);
      if (a === "reiniciar") { camino = []; pintarCamino(); mostrar(b.inicio, true); }
    });
    mostrar(b.inicio, false);
  }
});
