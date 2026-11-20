/* Taller - IA | Bloque 2 (criterio): marco 4D, "Subí de nivel" y checklist descargable
   - marco4d: el diagrama del marco 4D, propio del taller. Se usa completo en el Módulo 4 y, con una
     dimensión destacada, al empezar los módulos que trabajan cada una.
   - subir-nivel: un prompt básico que se mejora en rondas, una técnica por ronda.
   - checklist: lista para revisar un trabajo, que se puede descargar o imprimir. */
import { esc, qs, qsa } from "../util.js";
import { icono, aviso, descargar } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar } from "../lesson/bloques.js";
import { guardarPrompt } from "../state.js";
import { marco, idDe, leer, esPrueba, guardarResultado, guardarParcial, mostrarFeedback, acciones, boton, demorar, copiar } from "./comun.js";

const fid = (ctx, b, x) => esc(`${idDe(ctx, b)}-${x}`);

/* ===================== Marco 4D ===================== */
export const DIMENSIONES = [
  { id: "delegacion", n: "Delegación", ic: "assignment_ind", s: 1, corto: "Decidir qué hacer vos, qué hacer con IA y qué delegar.",
    partes: ["Entender el problema", "Conocer la herramienta", "Repartir el trabajo"] },
  { id: "descripcion", n: "Descripción", ic: "edit_note", s: 2, corto: "Explicar con claridad qué querés, cómo y con qué tono.",
    partes: ["Describir el resultado", "Describir el proceso", "Describir el comportamiento"] },
  { id: "discernimiento", n: "Discernimiento", ic: "fact_check", s: 3, corto: "Evaluar lo que devuelve: si es correcto, cómo llegó y si respondió a lo pedido.",
    partes: ["Evaluar el resultado", "Evaluar el proceso", "Evaluar el comportamiento"] },
  { id: "diligencia", n: "Diligencia", ic: "verified_user", s: 4, corto: "Hacerte responsable de lo que creás, declarás y compartís.",
    partes: ["Al crear", "Al declarar el uso", "Al publicar o compartir"] }
];
const D = Object.fromEntries(DIMENSIONES.map(d => [d.id, d]));

/* Dos dibujos del mismo diagrama: horizontal (desde 560 px de contenedor) y vertical.
   Diligencia es el marco que envuelve todo; Delegación abre el trabajo; Descripción y
   Discernimiento forman un ciclo que se repite hasta que el resultado sirve. */
function nodo(d, x, y, w, h) {
  return `<g class="m4-nodo m4-s${d.s}" data-d="${d.id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20"/>` +
    `<circle cx="${x + w / 2}" cy="${y + 34}" r="20" class="m4-ic-bg"/><text x="${x + w / 2}" y="${y + 42}" text-anchor="middle" class="m4-ic" aria-hidden="true">${d.ic}</text>` +
    `<text x="${x + w / 2}" y="${y + h - 22}" text-anchor="middle" class="m4-t">${d.n}</text></g>`;
}
function svgH(titulo) {
  return `<svg class="m4-h" viewBox="0 0 640 360" role="img" aria-label="${esc(titulo)}">` +
    `<defs><marker id="m4fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="m4-punta"/></marker></defs>` +
    `<g class="m4-nodo m4-marco m4-s4" data-d="diligencia"><rect x="6" y="6" width="628" height="348" rx="28"/>` +
    `<text x="32" y="44" class="m4-ic" aria-hidden="true">verified_user</text><text x="62" y="40" class="m4-t">Diligencia</text><text x="62" y="60" class="m4-sub">envuelve todo el trabajo</text></g>` +
    nodo(D.delegacion, 40, 110, 150, 150) +
    `<path d="M196 185 H 246" class="m4-flecha" marker-end="url(#m4fl)"/>` +
    nodo(D.descripcion, 252, 110, 150, 150) + nodo(D.discernimiento, 452, 110, 150, 150) +
    `<path d="M352 104 C 380 70, 474 70, 502 104" class="m4-flecha" marker-end="url(#m4fl)"/>` +
    `<path d="M502 266 C 474 300, 380 300, 352 266" class="m4-flecha" marker-end="url(#m4fl)"/>` +
    `<text x="427" y="326" text-anchor="middle" class="m4-sub">se repite hasta que sirve</text></svg>`;
}
function svgV(titulo) {
  return `<svg class="m4-v" viewBox="0 0 360 520" role="img" aria-label="${esc(titulo)}">` +
    `<defs><marker id="m4flv" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="m4-punta"/></marker></defs>` +
    `<g class="m4-nodo m4-marco m4-s4" data-d="diligencia"><rect x="6" y="6" width="348" height="508" rx="28"/>` +
    `<text x="28" y="44" class="m4-ic" aria-hidden="true">verified_user</text><text x="58" y="40" class="m4-t">Diligencia</text><text x="58" y="60" class="m4-sub">envuelve todo el trabajo</text></g>` +
    nodo(D.delegacion, 105, 84, 150, 140) +
    `<path d="M180 230 V 268" class="m4-flecha" marker-end="url(#m4flv)"/>` +
    nodo(D.descripcion, 26, 274, 146, 140) + nodo(D.discernimiento, 188, 274, 146, 140) +
    `<path d="M120 420 C 140 462, 220 462, 240 420" class="m4-flecha" marker-start="url(#m4flv)" marker-end="url(#m4flv)"/>` +
    `<text x="180" y="490" text-anchor="middle" class="m4-sub">se repite hasta que sirve</text></svg>`;
}
registrar("marco4d", {
  render: b => {
    const titulo = b.titulo || "El marco 4D";
    const resumen = b.resumen || "Diagrama del marco 4D. Diligencia envuelve todo el trabajo. Adentro, Delegación lleva a un ciclo entre Descripción y Discernimiento, que se repite hasta que el resultado sirve.";
    const dest = b.destacar ? D[b.destacar] : null;
    return `<figure class="m4${dest ? " m4-destaca" : ""}"${dest ? ` data-destacar="${dest.id}"` : ""}>` +
      `<div class="m4-svg">${svgH(resumen)}${svgV(resumen)}</div>` +
      `<figcaption>${b.compacto && dest
        ? `<p class="m4-en">${icono(dest.ic)}<span>Este módulo trabaja <b>${dest.n}</b>: ${esc(dest.corto.charAt(0).toLowerCase() + dest.corto.slice(1))}</span></p>`
        : `<h4>${esc(titulo)}</h4><dl class="m4-lista">${DIMENSIONES.map(d => `<div class="m4-item m4-s${d.s}" data-d="${d.id}" tabindex="0"><dt><span class="m4-dot" aria-hidden="true">${icono(d.ic)}</span>${d.n}</dt>` +
          `<dd><p>${esc(d.corto)}</p><ul>${d.partes.map(p => `<li>${esc(p)}</li>`).join("")}</ul></dd></div>`).join("")}</dl>`}` +
      `${b.fuente ? `<p class="m4-fuente">${md(b.fuente).replace(/^<p>|<\/p>$/g, "")}</p>` : ""}</figcaption></figure>`;
  },
  montar(el, b) {
    if (b.destacar) return;
    const marcar = id => qsa(".m4-nodo, .m4-item", el).forEach(x => x.classList.toggle("is-on", x.dataset.d === id));
    el.addEventListener("pointerover", e => { const t = e.target.closest("[data-d]"); if (t) marcar(t.dataset.d); });
    el.addEventListener("focusin", e => { const t = e.target.closest("[data-d]"); if (t) marcar(t.dataset.d); });
    el.addEventListener("pointerleave", () => marcar(null));
    el.addEventListener("focusout", e => { if (!el.contains(e.relatedTarget)) marcar(null); });
  }
});

/* ===================== Diferencias entre dos textos, por palabras ===================== */
/** Devuelve HTML del texto nuevo con lo agregado marcado en <ins>. Para textos cortos (prompts). */
export function diffHTML(antes, despues) {
  const a = (antes || "").split(/(\s+)/), c = (despues || "").split(/(\s+)/);
  const n = a.length, m = c.length;
  if (n * m > 400000) return esc(despues);
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === c[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0, out = "", nuevo = "";
  const cerrar = () => { if (nuevo) { out += /\S/.test(nuevo) ? `<ins>${esc(nuevo)}</ins>` : esc(nuevo); nuevo = ""; } };
  while (j < m) {
    if (i < n && a[i] === c[j]) { cerrar(); out += esc(c[j]); i++; j++; }
    else if (i < n && L[i + 1][j] >= L[i][j + 1]) i++;
    else { nuevo += c[j]; j++; }
  }
  cerrar();
  return out;
}
const palabras = t => (t || "").split(/\s+/).filter(Boolean).length;

/* ===================== Subí de nivel: un prompt, varias rondas ===================== */
registrar("subir-nivel", {
  render: (b, ctx) => marco("subir-nivel", b, ctx,
    `<ol class="sn-pasos" aria-label="Rondas">${b.rondas.map((r, i) => `<li data-r="${i}"><span class="sn-num">${i + 1}</span><span class="sn-tec">${esc(r.tecnica)}</span></li>`).join("")}<li data-r="${b.rondas.length}"><span class="sn-num">${icono("flag", "sm")}</span><span class="sn-tec">Resultado</span></li></ol>` +
    `<div class="sn-ronda"></div>`),
  montar(el, b, ctx) {
    const R = b.rondas.length;
    const prev = leer(ctx, b)?.respuesta;
    // textos[0] es el prompt inicial; textos[k] es el prompt después de la ronda k
    let textos = prev?.textos?.length ? prev.textos.slice() : [b.inicial];
    let ronda = Math.min(prev?.ronda ?? 0, R);
    const box = qs(".sn-ronda", el);
    const guardarB = demorar(() => guardarParcial(ctx, b, { ronda, textos }));
    function marcarPasos() {
      qsa(".sn-pasos li", el).forEach(li => {
        const r = +li.dataset.r; li.classList.toggle("is-done", r < ronda); li.classList.toggle("is-on", r === ronda);
        if (r === ronda) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
    }
    function pintar(enfocar) {
      marcarPasos(); limpiarFb();
      if (ronda >= R) return pintarFinal(enfocar);
      const r = b.rondas[ronda], actual = textos[ronda + 1] ?? textos[ronda];
      box.innerHTML = `<div class="sn-tecnica"><p class="sn-k">Ronda ${ronda + 1} de ${R}</p><h5 tabindex="-1">${esc(r.tecnica)}</h5>${md(r.explicacion)}</div>` +
        `<div class="tf"><label for="${fid(ctx, b, "t")}">Tu prompt${ronda ? ", como quedó en la ronda anterior" : ""}. Mejoralo con esta técnica</label>` +
        `<textarea class="field" id="${fid(ctx, b, "t")}" rows="7" aria-describedby="${fid(ctx, b, "th")}">${esc(actual)}</textarea>` +
        `<span class="tf-help" id="${fid(ctx, b, "th")}">${esc(r.pista || "")}</span></div>` +
        `<div class="sn-ref" hidden><h5>Una versión posible</h5><p class="sn-nota">Lo resaltado es lo que se agregó en esta ronda.</p><pre class="sn-texto">${diffHTML(ronda ? b.rondas[ronda - 1].referencia : b.inicial, r.referencia)}</pre>` +
        `<h5>Qué cambió y por qué</h5><ul class="sn-porque">${r.porque.map(p => `<li>${md(p).replace(/^<p>|<\/p>$/g, "")}</li>`).join("")}</ul></div>` +
        acciones((ronda ? boton("atras", "Ronda anterior", "btn-text", "arrow_back") : "") + boton("ver", "Ver una versión posible", "btn-outlined", "visibility") +
          boton("usar", "Usar esa versión", "btn-text", "content_paste") + boton("seguir", ronda === R - 1 ? "Ver el resultado" : "Siguiente ronda", "btn-filled", "arrow_forward"));
      qs('[data-a="usar"]', el).hidden = true;
      if (enfocar) qs(".sn-tecnica h5", el).focus();
    }
    function pintarFinal(enfocar) {
      const ini = textos[0], fin = textos[R] ?? textos[textos.length - 1];
      box.innerHTML = `<div class="sn-tecnica"><p class="sn-k">Resultado</p><h5 tabindex="-1">De ${palabras(ini)} a ${palabras(fin)} palabras</h5><p>Lo resaltado es todo lo que sumaste en las ${R} rondas. Más largo no siempre es mejor: cada agregado tendría que responder a una técnica.</p></div>` +
        `<div class="sn-comp"><div><h5>El prompt inicial</h5><pre class="sn-texto">${esc(ini)}</pre></div><div><h5>Tu prompt final</h5><pre class="sn-texto">${diffHTML(ini, fin)}</pre></div></div>` +
        `<details class="con-guardar"><summary>${icono("bookmark_add", "sm")}Guardar en Mis prompts</summary><div class="con-guardar-in">` +
        `<div class="tf"><label for="${fid(ctx, b, "nom")}">Nombre</label><input class="field" id="${fid(ctx, b, "nom")}" autocomplete="off" value="${esc(b.nombre || b.titulo || "")}"></div>` +
        `<div class="tf"><label for="${fid(ctx, b, "tags")}">Etiquetas <span class="opc">(separadas por coma)</span></label><input class="field" id="${fid(ctx, b, "tags")}" autocomplete="off" value="${esc((b.etiquetas || []).join(", "))}"></div>` +
        boton("guardar", "Guardar", "btn-tonal", "bookmark") + `</div></details>` +
        acciones(boton("reiniciar", "Empezar de nuevo", "btn-text", "replay") + boton("atras", "Ronda anterior", "btn-text", "arrow_back") + boton("copiar", "Copiar", "btn-filled", "content_copy"));
      if (enfocar) { guardarResultado(ctx, b, { resultado: "hecho", respuesta: { ronda, textos } }); qs(".sn-tecnica h5", el).focus(); }
    }
    function limpiarFb() { qs(".act-fb", el).innerHTML = ""; }
    function leerTexto() { const t = qs(`#${CSS.escape(idDe(ctx, b))}-t`, el); if (t) textos[ronda + 1] = t.value; }
    el.addEventListener("input", e => { if (e.target.id === `${idDe(ctx, b)}-t`) { leerTexto(); guardarB(); } });
    el.addEventListener("click", async e => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
      if (a === "ver") {
        const ref = qs(".sn-ref", el); ref.hidden = false; e.target.closest("[data-a]").hidden = true;
        const u = qs('[data-a="usar"]', el); u.hidden = false; ref.querySelector("h5").setAttribute("tabindex", "-1"); ref.querySelector("h5").focus();
      }
      if (a === "usar") { const t = qs(`#${CSS.escape(idDe(ctx, b))}-t`, el); t.value = b.rondas[ronda].referencia; leerTexto(); guardarB(); t.focus(); aviso("Pegamos la versión posible en tu prompt. Podés ajustarla."); }
      if (a === "seguir") {
        leerTexto();
        const base = textos[ronda], nuevo = (textos[ronda + 1] ?? "").trim();
        if (!nuevo || nuevo === base.trim()) { mostrarFeedback(el, "info", "Todavía no cambiaste el prompt", `<p>Aplicá la técnica de esta ronda. Si no se te ocurre cómo, mirá una versión posible.</p>`); qs(`#${CSS.escape(idDe(ctx, b))}-t`, el).focus(); return; }
        ronda++; textos = textos.slice(0, ronda + 1); guardarParcial(ctx, b, { ronda, textos }); pintar(true);
      }
      if (a === "atras") { ronda = Math.max(0, ronda - 1); guardarParcial(ctx, b, { ronda, textos }); pintar(true); }
      if (a === "reiniciar") { ronda = 0; textos = [b.inicial]; guardarParcial(ctx, b, { ronda, textos }); pintar(true); }
      if (a === "copiar") aviso(await copiar(textos[R]) ? "Copiado al portapapeles" : "No se pudo copiar. Seleccioná el texto y copialo a mano.");
      if (a === "guardar") {
        const nombre = qs(`#${CSS.escape(idDe(ctx, b))}-nom`, el).value.trim() || b.titulo || "Prompt sin nombre";
        const etiquetas = qs(`#${CSS.escape(idDe(ctx, b))}-tags`, el).value.split(",").map(x => x.trim()).filter(Boolean);
        if (!esPrueba(ctx)) guardarPrompt({ id: "p-" + idDe(ctx, b), nombre, etiquetas, texto: textos[R], modulo: ctx.meta.id, origen: "prompt" });
        mostrarFeedback(el, "hecho", esPrueba(ctx) ? "Listo (en la lección de prueba no se guarda)" : `Guardado en Mis prompts como "${nombre}"`, `<p>Lo encontrás en <a href="#/prompts">Mis prompts</a>.</p>`);
      }
    });
    pintar(false);
  }
});

/* ===================== Checklist descargable ===================== */
registrar("checklist", {
  render: (b, ctx) => {
    let k = 0;
    return marco("checklist", b, ctx,
      b.grupos.map((g, gi) => `<fieldset class="ck-grupo"><legend>${esc(g.titulo)}</legend>${g.items.map(it => { const i = k++; return `<label class="ck-item"><input type="checkbox" data-i="${i}"><span><b>${esc(it.texto)}</b>${it.ayuda ? `<small>${esc(it.ayuda)}</small>` : ""}</span></label>`; }).join("")}</fieldset>`).join("") +
      `<p class="ck-cuenta" aria-live="polite"></p>` +
      acciones(boton("vaciar", "Desmarcar todo", "btn-text", "backspace") + boton("imprimir", "Imprimir", "btn-outlined", "print") + boton("descargar", "Descargar (.md)", "btn-filled", "download")));
  },
  montar(el, b, ctx) {
    const total = b.grupos.reduce((s, g) => s + g.items.length, 0);
    const marcados = new Set(leer(ctx, b)?.respuesta || []);
    const cajas = qsa("input[data-i]", el);
    const contar = () => { qs(".ck-cuenta", el).textContent = `${marcados.size} de ${total} revisados`; };
    cajas.forEach(c => { c.checked = marcados.has(+c.dataset.i); });
    contar();
    el.addEventListener("change", e => {
      const c = e.target.closest("input[data-i]"); if (!c) return;
      c.checked ? marcados.add(+c.dataset.i) : marcados.delete(+c.dataset.i); contar(); guardarParcial(ctx, b, [...marcados]);
    });
    el.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
      if (a === "vaciar") { marcados.clear(); cajas.forEach(c => { c.checked = false; }); contar(); guardarParcial(ctx, b, []); cajas[0].focus(); }
      if (a === "imprimir") window.print();
      if (a === "descargar") {
        let k = 0;
        const txt = `# ${b.titulo}\n\n${b.intro ? b.intro + "\n\n" : ""}` + b.grupos.map(g => `## ${g.titulo}\n\n` + g.items.map(it => `- [${marcados.has(k++) ? "x" : " "}] ${it.texto}${it.ayuda ? `\n  ${it.ayuda}` : ""}`).join("\n")).join("\n\n") + `\n\n---\nTaller - IA | Lourdes Pedaci\n`;
        descargar(`${b.archivo || "checklist"}.md`, txt, "text/markdown");
        guardarResultado(ctx, b, { resultado: "hecho", respuesta: [...marcados] });
        mostrarFeedback(el, "hecho", "Checklist descargado", `<p>Es un archivo de texto (Markdown): se abre con cualquier editor y se puede pegar en un documento.</p>`);
      }
    });
  }
});
