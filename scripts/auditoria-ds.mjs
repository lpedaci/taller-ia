/* Taller - IA | Auditoría contra el design system (D-043)
   Revisa lo que se ve en la página contra las reglas de referencia/design-system/README.md
   ("Reglas verificables"). Se usa desde scripts/verificar.mjs y desde scripts/auditar-ds.mjs.

   Cada regla devuelve { regla, elemento, detalle }. Una excepción se documenta en DECISIONES.md y se marca
   en el HTML con data-excepcion-ds="regla" en el elemento o en un contenedor. */

/** Reglas y su explicación, para el reporte */
export const REGLAS = {
  "campo": "Campos de texto: clase .field, 56 px de alto, esquina extra-small (4 px) y texto body-large (16 px).",
  "desplegable": "Desplegables: campo .field dentro de .sel, sin la flecha nativa, con el ícono arrow_drop_down a 12 px del borde.",
  "icono-campo": "Ícono final de un campo: 24 px, a 12 px del borde derecho.",
  "boton": "Botones comunes: 40 px (S) o 56 px (M) de alto, forma de píldora, etiqueta label-large (14 px, 500) e ícono de 20 px en el tamaño S.",
  "boton-icono": "Botones de ícono: 40 o 48 px, con ícono de 24 px.",
  "acciones-orden": "Fila de acciones: un solo botón relleno, ubicado último (a la derecha); antes, las acciones de menor prioridad.",
  "acciones-alineacion": "Fila de acciones: alineada al final del contenedor (salvo la navegación anterior y siguiente).",
  "tipografia": "Tipografía: solo tamaños y pesos de la escala tipográfica de M3.",
  "tipografia-rem": "Tamaños de texto en rem, para que sigan el tamaño de letra elegido en el navegador (los íconos quedan en px).",
  "forma": "Forma: radios de esquina de la escala (0, 4, 8, 12, 16, 20, 28 px o completa).",
  "espaciado": "Espaciado: márgenes, rellenos y separaciones en múltiplos de 4 px (se aceptan 2 y 6 px para ajustes ópticos documentados).",
  "icono": "Íconos: Material Symbols Rounded en 16, 18, 20, 24, 32, 40 o 48 px.",
  "color-texto": "Color de texto: siempre un color de los tokens (nunca un valor suelto)."
};

/** Se ejecuta dentro de la página (page.evaluate). No puede usar nada de afuera. */
export function auditar() {
  const out = [];
  const raiz = getComputedStyle(document.documentElement);
  const visible = el => {
    if (el.closest("[hidden], dialog:not([open]), .sr-only, .skip, template, noscript")) return false;
    if (el.closest("details:not([open])") && !el.closest("summary")) return false;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none";
  };
  const exceptuado = (el, regla) => { const c = el.closest("[data-excepcion-ds]"); return !!c && c.dataset.excepcionDs.split(/\s+/).includes(regla); };
  const nombre = el => {
    const t = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
    const cl = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cl}${t ? ` "${t}"` : ""}`;
  };
  const px = v => parseFloat(v) || 0;
  const cerca = (a, b, tol = 1) => Math.abs(a - b) <= tol;
  const falla = (regla, el, detalle) => { if (!exceptuado(el, regla)) out.push({ regla, elemento: nombre(el), detalle }); };

  // Escalas desde los tokens: así la auditoría sigue al design system si los tokens cambian
  const props = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch { return []; } })
    .filter(r => r.selectorText && /(^|,)\s*:root\b/.test(r.selectorText)).flatMap(r => [...r.style]).filter(p => p.startsWith("--"));
  const unicos = [...new Set(props)];
  // Tamaños y pesos: los de la escala de M3 (--md-sys-typescale-*) y los propios del taller (--app-typescale-*)
  const tamTipo = new Set(), pesoTipo = new Set();
  const base = px(raiz.fontSize) || 16; // 1rem en esta página
  unicos.filter(p => /^--(md-sys|app)-typescale-/.test(p)).forEach(p => {
    const v = raiz.getPropertyValue(p).trim();
    if (/-weight$/.test(p)) { if (+v) pesoTipo.add(+v); return; }
    if (/-(tracking|line-height|font|size)$/.test(p)) return;
    const m = v.match(/^(\d{3})?\s*(\d+(?:\.\d+)?)(px|rem)/);
    if (m) { tamTipo.add(Math.round((m[3] === "rem" ? +m[2] * base : +m[2]) * 10) / 10); if (m[1]) pesoTipo.add(+m[1]); }
  });
  const radios = new Set([0]);
  unicos.filter(p => p.startsWith("--md-sys-shape-corner-")).forEach(p => { const v = px(raiz.getPropertyValue(p)); if (v < 1000) radios.add(v); });
  const lienzo = document.createElement("canvas").getContext("2d");
  const norm = c => { lienzo.fillStyle = "#000"; lienzo.fillStyle = c; return lienzo.fillStyle; };
  const coloresTokens = new Set();
  unicos.filter(p => /^--(md-sys-color|app-color|app-chart|app-event|app-level|app-heat)/.test(p)).forEach(p => {
    const v = raiz.getPropertyValue(p).trim(); if (v && !v.startsWith("var(")) coloresTokens.add(norm(v));
  });
  // Los colores que resultan de color-mix() entre tokens se aceptan si vienen de un estilo que usa tokens:
  // se registran leyendo el color de los elementos que lo declaran en CSS (ver más abajo, "color-texto").

  /* ---- Campos ---- */
  for (const el of document.querySelectorAll("input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]):not([type=file]), select, textarea")) {
    if (!visible(el) || el.closest(".search, .topbar, .anim, [role=search]")) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (!el.classList.contains("field")) { falla("campo", el, "no usa la clase .field"); continue; }
    if (el.tagName !== "TEXTAREA" && !cerca(r.height, 56)) falla("campo", el, `mide ${Math.round(r.height)} px de alto`);
    if (!cerca(px(cs.borderTopLeftRadius), 4)) falla("campo", el, `esquina de ${cs.borderTopLeftRadius}`);
    if (!cerca(px(cs.fontSize), 16)) falla("campo", el, `texto de ${cs.fontSize}`);
    if (el.tagName === "SELECT") {
      const wrap = el.parentElement, ic = el.nextElementSibling;
      if (!wrap?.classList.contains("sel")) falla("desplegable", el, "no está dentro de .sel");
      else if (!ic?.classList.contains("tf-ic") || ic.textContent.trim() !== "arrow_drop_down") falla("desplegable", el, "falta el ícono arrow_drop_down");
      if (cs.appearance !== "none" && cs.webkitAppearance !== "none") falla("desplegable", el, "muestra la flecha nativa");
    }
  }
  for (const ic of document.querySelectorAll(".tf-ic")) {
    if (!visible(ic)) continue;
    const campo = ic.parentElement.querySelector(".field"); if (!campo) continue;
    const a = campo.getBoundingClientRect(), b = ic.getBoundingClientRect();
    if (!cerca(a.right - b.right, 12)) falla("icono-campo", ic, `está a ${Math.round(a.right - b.right)} px del borde`);
    if (!cerca(b.width, 24)) falla("icono-campo", ic, `mide ${Math.round(b.width)} px`);
  }

  /* ---- Botones ---- */
  for (const el of document.querySelectorAll(".btn")) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (!cerca(r.height, 40) && !cerca(r.height, 56)) falla("boton", el, `mide ${Math.round(r.height)} px de alto`);
    if (px(cs.borderTopLeftRadius) < r.height / 2 - 1) falla("boton", el, `esquina de ${cs.borderTopLeftRadius}, no es píldora`);
    if (!cerca(px(cs.fontSize), cerca(r.height, 56) ? 16 : 14) || +cs.fontWeight !== 500) falla("boton", el, `etiqueta de ${cs.fontSize} y peso ${cs.fontWeight}`);
    const ms = el.querySelector(":scope > .ms");
    const soloIcono = r.width <= 56; // en mobile algunos botones muestran solo el ícono: ahí lleva 24 px, como un botón de ícono
    if (ms && cerca(r.height, 40) && !soloIcono && !cerca(px(getComputedStyle(ms).fontSize), 20)) falla("boton", el, `ícono de ${getComputedStyle(ms).fontSize}`);
  }
  for (const el of document.querySelectorAll(".icon-btn")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect(), ms = el.querySelector(".ms");
    if (!(cerca(r.width, 40) || cerca(r.width, 48)) || !(cerca(r.height, 40) || cerca(r.height, 48))) falla("boton-icono", el, `mide ${Math.round(r.width)} x ${Math.round(r.height)} px`);
    if (ms && !cerca(px(getComputedStyle(ms).fontSize), 24)) falla("boton-icono", el, `ícono de ${getComputedStyle(ms).fontSize}`);
  }

  /* ---- Filas de acciones: orden y alineación ---- */
  const filas = new Set();
  document.querySelectorAll(".btn").forEach(b => { if (visible(b)) filas.add(b.parentElement); });
  for (const fila of filas) {
    const bts = [...fila.children].filter(c => c.matches(".btn") && visible(c));
    if (bts.length < 2) continue;
    if (fila.closest(".lesson-bar, .mod-nav, .dlg-steps, .connected, .toc")) continue; // navegación: anterior a la izquierda, siguiente a la derecha
    const llenos = bts.filter(b => b.classList.contains("btn-filled"));
    if (llenos.length > 1) falla("acciones-orden", fila, `${llenos.length} botones rellenos en la misma fila`);
    // El orden visual cuenta en la fila de abajo: si hay salto de línea, se mira la última línea
    const porX = bts.slice().sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return Math.abs(ra.top - rb.top) > 8 ? ra.top - rb.top : ra.left - rb.left; });
    if (llenos.length === 1 && porX[porX.length - 1] !== llenos[0]) falla("acciones-orden", fila, `el botón relleno "${llenos[0].textContent.trim()}" no está último`);
    const cs = getComputedStyle(fila);
    if (cs.display.includes("flex") && cs.flexDirection.startsWith("row")) {
      const ultimo = porX[porX.length - 1].getBoundingClientRect(), fr = fila.getBoundingClientRect();
      const finFila = fr.right - px(cs.paddingRight);
      const anchoCompleto = bts.some(b => b.getBoundingClientRect().width >= fr.width - px(cs.paddingLeft) - px(cs.paddingRight) - 1);
      if (!anchoCompleto && !cerca(ultimo.right, finFila, 2) && cs.justifyContent !== "space-between") falla("acciones-alineacion", fila, "las acciones no están alineadas al final");
    }
  }

  /* ---- Tipografía, forma, espaciado, íconos y color, recorriendo los elementos visibles ---- */
  // Tamaños de texto en rem: se revisan las reglas de las hojas de estilo; los íconos (Material Symbols) quedan en px
  for (const r of document.styleSheets ? [...document.styleSheets].flatMap(h => { try { return [...h.cssRules].flatMap(x => x instanceof CSSStyleRule ? [x] : x.cssRules ? [...x.cssRules] : []); } catch { return []; } }) : []) {
    if (!r.style || !/^\d+(\.\d+)?px$/.test((r.style.fontSize || "").trim())) continue; // min(0.75rem, 12px) es un tope documentado
    const icono = /\.ms\b|\.chk\b|-ic\b|::after|::before/.test(r.selectorText || "") || /Material Symbols/.test(r.style.fontFamily || "");
    if (!icono) out.push({ regla: "tipografia-rem", elemento: r.selectorText, detalle: `font-size de ${r.style.fontSize}` });
  }
  const multiplo = v => { const n = Math.abs(px(v)); return n === 0 || n % 4 === 0 || n === 2 || n === 6 || n === 1; };
  for (const el of document.body.querySelectorAll("*")) {
    if (el.closest("svg, .anim, .chart, .heat-wrap, .sr-only, script, style") || !visible(el)) continue;
    const cs = getComputedStyle(el);
    // Tipografía: solo en elementos con texto propio
    const texto = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (el.classList.contains("ms")) {
      if (!/Material Symbols/.test(cs.fontFamily)) falla("icono", el, "no usa Material Symbols");
      else if (![16, 18, 20, 24, 32, 40, 48].includes(Math.round(px(cs.fontSize)))) falla("icono", el, `mide ${cs.fontSize}`);
    } else if (texto) {
      const t = Math.round(px(cs.fontSize) * 10) / 10;
      if (!tamTipo.has(t)) falla("tipografia", el, `texto de ${cs.fontSize}`);
      if (!pesoTipo.has(+cs.fontWeight)) falla("tipografia", el, `peso ${cs.fontWeight}`);
      const c = norm(cs.color);
      if (!coloresTokens.has(c)) falla("color-texto", el, `color ${cs.color}`);
    }
    // Forma: solo superficies con fondo o borde
    const conFondo = cs.backgroundColor !== "rgba(0, 0, 0, 0)" || px(cs.borderTopWidth) > 0;
    const rad = px(cs.borderTopLeftRadius);
    if (conFondo && rad && !radios.has(Math.round(rad)) && !cs.borderTopLeftRadius.includes("%")) {
      const r = el.getBoundingClientRect();
      if (rad < Math.min(r.width, r.height) / 2 - 1) falla("forma", el, `esquina de ${cs.borderTopLeftRadius}`);
    }
    // Espaciado (las casillas y botones de opción nativos se centran con márgenes de 3 px en su lugar de 24 px)
    if (el.matches("input[type=checkbox], input[type=radio]")) continue;
    for (const p of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginBottom", "rowGap", "columnGap"]) {
      const v = cs[p]; if (v && v !== "normal" && !multiplo(v)) { falla("espaciado", el, `${p} de ${v}`); break; }
    }
  }
  return out;
}

/** Arma la sección del reporte a partir de { regla, elemento, detalle, casos } */
export function seccionAuditoria(hallazgos) {
  const lista = [...hallazgos.values()];
  if (!lista.length) return "Todo lo revisado cumple las reglas del design system.\n\nReglas revisadas:\n\n" + Object.values(REGLAS).map(r => `- ${r}`).join("\n");
  const porRegla = new Map();
  lista.forEach(h => { if (!porRegla.has(h.regla)) porRegla.set(h.regla, []); porRegla.get(h.regla).push(h); });
  return [...porRegla].map(([regla, hs]) => `### ${regla} (${hs.length})\n\n${REGLAS[regla] || ""}\n\n` +
    hs.slice(0, 25).map(h => `- \`${h.elemento}\`: ${h.detalle}. En: ${[...new Set(h.casos)].slice(0, 3).join("; ")}${h.casos.length > 3 ? ` y ${h.casos.length - 3} más` : ""}.`).join("\n") +
    (hs.length > 25 ? `\n- Y ${hs.length - 25} más.` : "")).join("\n\n");
}
