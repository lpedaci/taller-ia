/* Taller - IA | Modo de diagnóstico de accesibilidad (?diagnostico=1)
   Carga axe-core desde un CDN con versión fija y muestra los problemas de la
   pantalla actual en español. También permite ver el sitio en anchos de mobile,
   tablet y desktop dentro de un marco. No se carga para el resto de las personas. */
import { esc } from "./util.js";

const AXE = "https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js";
const AXE_ES = "https://cdn.jsdelivr.net/npm/axe-core@4.10.2/locales/es.json";
const GRAVEDAD = { critical: "Crítico", serious: "Grave", moderate: "Moderado", minor: "Menor" };
const ORDEN = ["critical", "serious", "moderate", "minor"];

const estilos = `
.diag{position:fixed;right:16px;bottom:96px;z-index:80;width:min(400px,calc(100vw - 32px));max-height:min(70vh,640px);display:flex;flex-direction:column;background:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-on-surface);border-radius:var(--md-sys-shape-corner-extra-large);box-shadow:var(--md-sys-elevation-level3);overflow:hidden}
.diag.min .diag-body{display:none}
.diag-head{display:flex;align-items:center;gap:8px;padding:12px 8px 12px 20px;border-bottom:1px solid var(--md-sys-color-outline-variant)}
.diag-head h2{font:var(--md-sys-typescale-title-medium);flex:1}
.diag-body{overflow:auto;padding:12px 20px 20px;display:grid;gap:12px;font:var(--md-sys-typescale-body-medium)}
.diag-body ol{margin:0;padding-left:1.2em;display:grid;gap:10px}
.diag-body code{font-size:12px;overflow-wrap:anywhere;color:var(--md-sys-color-on-surface-variant)}
.diag-frames{position:fixed;inset:0;z-index:90;background:var(--app-color-background);display:flex;flex-direction:column}
.diag-frames .bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 16px;background:var(--app-color-chrome)}
.diag-frames .wrap{flex:1;overflow:auto;display:flex;justify-content:center;padding:16px}
.diag-frames iframe{border:1px solid var(--md-sys-color-outline-variant);border-radius:var(--md-sys-shape-corner-medium);background:var(--md-sys-color-surface);height:100%;min-height:600px}
@media (min-width:600px){.diag{bottom:16px}}`;

const cargarScript = src => new Promise((ok, mal) => { const s = document.createElement("script"); s.src = src; s.crossOrigin = "anonymous"; s.onload = ok; s.onerror = () => mal(new Error("No se pudo cargar " + src)); document.head.appendChild(s); });

export async function iniciar() {
  const st = document.createElement("style"); st.textContent = estilos; document.head.appendChild(st);
  const panel = document.createElement("section");
  panel.className = "diag"; panel.setAttribute("aria-labelledby", "diagT");
  panel.innerHTML = `<div class="diag-head"><h2 id="diagT">Diagnóstico de accesibilidad</h2>` +
    `<button class="icon-btn" type="button" data-d="analizar" aria-label="Volver a analizar esta pantalla" data-tip="Volver a analizar"><span class="ms" aria-hidden="true">refresh</span></button>` +
    `<button class="icon-btn" type="button" data-d="marcos" aria-label="Ver en mobile, tablet y desktop" data-tip="Ver en otros anchos"><span class="ms" aria-hidden="true">devices</span></button>` +
    `<button class="icon-btn" type="button" data-d="min" aria-expanded="true" aria-controls="diagB" aria-label="Minimizar el panel" data-tip="Minimizar"><span class="ms" aria-hidden="true">expand_more</span></button></div>` +
    `<div class="diag-body" id="diagB" aria-live="polite"><p>Cargando axe-core para revisar esta pantalla.</p></div>`;
  document.body.appendChild(panel);
  const cuerpo = panel.querySelector("#diagB");

  try {
    await cargarScript(AXE);
    try { const es = await (await fetch(AXE_ES)).json(); window.axe.configure({ locale: es }); } catch { /* sigue en inglés */ }
  } catch (e) { cuerpo.innerHTML = `<p>No se pudo cargar axe-core. Revisá la conexión e intentá de nuevo.</p>`; return; }

  async function analizar() {
    cuerpo.setAttribute("aria-busy", "true");
    cuerpo.innerHTML = "<p>Analizando esta pantalla.</p>";
    await new Promise(r => setTimeout(r, 300));
    const r = await window.axe.run(document, { exclude: [[".diag"]], runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] });
    const v = r.violations.sort((a, b) => ORDEN.indexOf(a.impact) - ORDEN.indexOf(b.impact));
    cuerpo.innerHTML = (v.length
      ? `<p><b>${v.length} ${v.length === 1 ? "problema" : "problemas"}</b> en ${esc(location.hash || "esta pantalla")}.</p><ol>` +
        v.map(x => `<li><b>${GRAVEDAD[x.impact] || x.impact}:</b> ${esc(x.help)}<br><code>${x.nodes.slice(0, 2).map(n => esc(n.target.join(" "))).join(" | ")}</code></li>`).join("") + `</ol>`
      : `<p><b>Sin problemas automáticos</b> en ${esc(location.hash || "esta pantalla")}.</p>`) +
      `<p class="muted">Las pruebas automáticas detectan solo una parte de los problemas. Probá también con teclado y con un lector de pantalla (NVDA, VoiceOver o TalkBack).</p>`;
    cuerpo.setAttribute("aria-busy", "false");
  }

  function marcos() {
    const capa = document.createElement("div");
    capa.className = "diag-frames"; capa.setAttribute("role", "dialog"); capa.setAttribute("aria-modal", "true"); capa.setAttribute("aria-label", "Vista en otros anchos");
    const url = location.pathname + location.hash;
    capa.innerHTML = `<div class="bar"><div class="connected" role="group" aria-label="Ancho">${[[360, "Mobile 360"], [768, "Tablet 768"], [1280, "Desktop 1280"]].map(([w, t], i) => `<button type="button" data-w="${w}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>` +
      `<span style="flex:1"></span><button class="btn btn-outlined" type="button" data-cerrar>Cerrar</button></div><div class="wrap"><iframe title="Vista previa del taller" src="${esc(url)}" style="width:360px"></iframe></div>`;
    document.body.appendChild(capa);
    const ifr = capa.querySelector("iframe");
    capa.addEventListener("click", e => {
      const b = e.target.closest("[data-w]");
      if (b) { ifr.style.width = b.dataset.w + "px"; capa.querySelectorAll("[data-w]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); }
      if (e.target.closest("[data-cerrar]")) { capa.remove(); panel.querySelector('[data-d="marcos"]').focus(); }
    });
    capa.addEventListener("keydown", e => { if (e.key === "Escape") { capa.remove(); panel.querySelector('[data-d="marcos"]').focus(); } });
    capa.querySelector("[data-w]").focus();
  }

  panel.addEventListener("click", e => {
    const b = e.target.closest("[data-d]"); if (!b) return;
    if (b.dataset.d === "analizar") analizar();
    if (b.dataset.d === "marcos") marcos();
    if (b.dataset.d === "min") {
      const min = panel.classList.toggle("min");
      b.setAttribute("aria-expanded", String(!min));
      b.setAttribute("aria-label", min ? "Mostrar el panel" : "Minimizar el panel");
      b.querySelector(".ms").textContent = min ? "expand_less" : "expand_more";
    }
  });
  addEventListener("hashchange", () => setTimeout(analizar, 200));
  analizar();
}
