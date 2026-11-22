import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { crearServidor } from "./servidor.mjs";
import { auditar } from "./auditoria-ds.mjs";
import { PANTALLAS } from "./pantallas.mjs";
/* Taller - IA | Contraste alto y persistencia del progreso (solo desarrollo)
   Uso: npm run contraste
   - Recorre todas las pantallas con "contraste alto", en claro y oscuro, en 390 y 1280 px, con axe-core y la auditoría del design system.
   - Comprueba que el progreso se mantiene al cerrar y volver a abrir el navegador.
   La verificación completa (npm run verificar) usa el contraste estándar; esta la complementa. */
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rm } from "node:fs/promises";
const s = crearServidor(); await new Promise(r => s.listen(0, r));
const B = `http://localhost:${s.address().port}/`;
const b = await chromium.launch(); const problemas = new Map(); let n = 0;
for (const modo of ["light", "dark"]) for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: modo, isMobile: w < 600, hasTouch: w < 600 });
  await ctx.addInitScript(() => { try { localStorage.setItem("tia.contraste", JSON.stringify("high")); } catch {} });
  const p = await ctx.newPage();
  for (const pt of PANTALLAS) {
    await p.goto(B + pt.url, { waitUntil: "networkidle" }); await p.waitForTimeout(250);
    if (pt.clic) { await p.click(pt.clic).catch(() => {}); await p.waitForTimeout(250); }
    const alto = await p.evaluate(() => document.documentElement.getAttribute("data-contrast"));
    if (alto !== "high") problemas.set("sin contraste alto", (problemas.get("sin contraste alto") || []).concat(pt.id));
    await p.addStyleTag({ content: ".lesson-bar{position:static!important}" });
    const r = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze(); n++;
    r.violations.forEach(v => { const k = `axe ${v.id}`; problemas.set(k, (problemas.get(k) || []).concat(`${pt.id} ${w} ${modo} ${v.nodes[0].target}`)); });
    (await p.evaluate(auditar)).forEach(f => { const k = `ds ${f.regla}`; problemas.set(k, (problemas.get(k) || []).concat(`${pt.id} ${w} ${modo} ${f.elemento} ${f.detalle}`)); });
  }
  await ctx.close();
}
// El progreso se mantiene al cerrar y volver a abrir el navegador (mismo perfil persistente)
const perfil = join(tmpdir(), "taller-ia-perfil-persistente"); await rm(perfil, { recursive: true, force: true });
let c1 = await chromium.launchPersistentContext(perfil, { viewport: { width: 1280, height: 900 } });
let p1 = c1.pages()[0] || await c1.newPage();
await p1.goto(B + "index.html#/modulo/1/paso/1", { waitUntil: "networkidle" }); await p1.waitForTimeout(300);
await p1.click(".lb-next"); await p1.waitForTimeout(300);
await c1.close();
c1 = await chromium.launchPersistentContext(perfil, { viewport: { width: 1280, height: 900 } });
p1 = c1.pages()[0] || await c1.newPage();
await p1.goto(B + "index.html#/recorrido", { waitUntil: "networkidle" }); await p1.waitForTimeout(300);
const persiste = await p1.evaluate(() => { try { return JSON.parse(localStorage.getItem("tia.estado") || "{}").progreso?.["1"]?.vistos?.length || 0; } catch { return -1; } });
await c1.close();
await b.close(); s.close();
console.log(`Contraste alto: ${n} análisis (${PANTALLAS.length} pantallas, 390 y 1280 px, claro y oscuro).`);
console.log(problemas.size ? [...problemas].map(([k, v]) => `${k}: ${v.length} casos. Ej.: ${v.slice(0, 3).join(" | ")}`).join("\n") : "Sin problemas de axe-core ni de design system.");
console.log(persiste >= 1 ? "Progreso: se mantiene al cerrar y volver a abrir el navegador." : "FALLA: el progreso no se mantuvo al volver a abrir el navegador.");
// Se aceptan como conocidos los objetivos tapados por la barra superior fija después de un salto con scroll (ver D-070)
const reales = [...problemas].filter(([k]) => k !== "axe target-size");
process.exitCode = reales.length || persiste < 1 ? 1 : 0;
