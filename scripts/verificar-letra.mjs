import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";
import { crearServidor } from "./servidor.mjs";
import { PANTALLAS } from "./pantallas.mjs";
/* Taller - IA | Letra agrandada en el navegador (solo desarrollo, D-072)
   Uso: npm run letra
   Simula que la persona eligió en el navegador una letra al doble del tamaño predeterminado (32 px en vez de 16),
   como en Chrome: Configuración > Apariencia > Tamaño de fuente. El texto del taller está en rem, así que debe crecer.
   Recorre todas las pantallas en Compact (360), Medium (768), Expanded (1024) y Large (1280) y revisa:
   - que el texto haya crecido;
   - que no haya scroll horizontal;
   - que ningún texto quede cortado o se salga de su caja.
   Guarda capturas en verificacion/letra/ para revisarlas a mano. */

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(RAIZ, "verificacion", "letra");
await mkdir(DIR, { recursive: true });
const CAPTURAS = new Set(["inicio-ejemplo", "recorrido", "aprendizaje", "leccion", "m4-marco4d", "m6-subir-nivel", "anim-agente", "m20-proyecto", "glosario", "biblioteca", "graficos", "act-clasificar"]);
const s = crearServidor(); await new Promise(r => s.listen(0, r));
const B = `http://localhost:${s.address().port}/`;
const b = await chromium.launch();
const problemas = new Map(), cortes = new Map(); let n = 0;
const anotar = (k, v) => problemas.set(k, (problemas.get(k) || []).concat(v));

for (const w of [360, 768, 1024, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 600, hasTouch: w < 600 });
  const p = await ctx.newPage();
  // Lo mismo que cambiar el tamaño de fuente en la configuración del navegador
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Page.enable");
  await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
  for (const pt of PANTALLAS) {
    await p.goto(B + pt.url, { waitUntil: "networkidle" }); await p.waitForTimeout(300);
    if (pt.clic) { await p.click(pt.clic).catch(() => {}); await p.waitForTimeout(300); }
    n++;
    const r = await p.evaluate(() => {
      const out = { base: parseFloat(getComputedStyle(document.documentElement).fontSize), scroll: document.documentElement.scrollWidth - innerWidth, cortes: [] };
      const visible = el => { const c = getComputedStyle(el); const q = el.getBoundingClientRect(); return q.width && q.height && c.visibility !== "hidden" && !el.closest("[hidden], dialog:not([open]), .sr-only, .skip, svg, canvas, .anim-escena"); };
      for (const el of document.body.querySelectorAll("*")) {
        if (!visible(el)) continue;
        const texto = [...el.childNodes].some(x => x.nodeType === 3 && x.textContent.trim());
        if (!texto || el.classList.contains("ms")) continue;
        const c = getComputedStyle(el);
        // Se saltean el texto oculto a propósito (solo para lectores de pantalla), las zonas con scroll propio
        // y los títulos que se acortan con "…" a propósito (el título completo está en el contenido)
        const q = el.getBoundingClientRect();
        if (q.width <= 1 || q.height <= 1 || (c.clip && c.clip !== "auto") || c.textOverflow === "ellipsis") continue;
        if (/auto|scroll/.test(c.overflowX + c.overflowY) || el.matches("textarea, input, select, pre, code")) continue;
        const alto = el.scrollHeight - el.clientHeight, ancho = el.scrollWidth - el.clientWidth;
        if (el.clientHeight && (alto > 2 || ancho > 2)) out.cortes.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : ""} "${el.textContent.trim().slice(0, 30)}" (${alto > 2 ? `+${alto}px alto` : ""}${ancho > 2 ? ` +${ancho}px ancho` : ""})`);
      }
      return out;
    });
    if (r.base < 31) anotar("el texto no creció", `${pt.id} ${w}: 1rem = ${r.base}px`);
    if (r.scroll > 1) anotar("scroll horizontal", `${pt.id} ${w}: +${r.scroll}px`);
    r.cortes.forEach(c => { const k = c.split(" \"")[0]; const e = cortes.get(k) || { n: 0, anchos: new Set(), ej: `${pt.id} ${w}: ${c}` }; e.n++; e.anchos.add(w); cortes.set(k, e); });
    if (CAPTURAS.has(pt.id)) await p.screenshot({ path: join(DIR, `${pt.id}-${w}.png`) });
  }
  await ctx.close();
}
await b.close(); s.close();
// Los cortes se agrupan por componente: así cada línea es una corrección
[...cortes].sort((x, y) => y[1].n - x[1].n).forEach(([k, e]) => anotar("texto cortado o fuera de su caja", `${k}: ${e.n} veces, en ${[...e.anchos].join(", ")} px. Ej.: ${e.ej}`));
console.log(`Letra al 200 %: ${n} pantallas revisadas (${PANTALLAS.length} pantallas en 360, 768, 1024 y 1280 px). Capturas: verificacion/letra/`);
console.log(problemas.size ? [...problemas].map(([k, v]) => `${k}: ${v.length} casos\n  ${v.slice(0, 80).join("\n  ")}`).join("\n") : "Sin problemas: el texto crece, sin scroll horizontal ni texto cortado.");
process.exitCode = problemas.size ? 1 : 0;
