/* Taller - IA | Auditoría rápida contra el design system (solo desarrollo)
   Uso: npm run auditar
   Recorre todas las pantallas de scripts/pantallas.mjs en 360, 412, 768, 1024 y 1280 px (modo claro y oscuro) y revisa
   las reglas de scripts/auditoria-ds.mjs. Tarda un par de minutos: conviene correrla cada vez que se crea o
   se cambia un componente, antes de la verificación completa.
   Resultado: verificacion/auditoria-design-system.md. Termina con error si algo no cumple. */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";
import { crearServidor } from "./servidor.mjs";
import { PANTALLAS } from "./pantallas.mjs";
import { auditar, seccionAuditoria } from "./auditoria-ds.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = join(RAIZ, "verificacion");
const ANCHOS = [360, 412, 768, 1024, 1280];
const servidor = crearServidor();
await new Promise(r => servidor.listen(0, r));
const BASE = `http://localhost:${servidor.address().port}/`;
const navegador = await chromium.launch();
const hallazgos = new Map();

for (const modo of ["light", "dark"]) for (const ancho of ANCHOS) {
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: ancho < 600 ? 800 : 1000 }, colorScheme: modo, hasTouch: ancho < 600, isMobile: ancho < 600, locale: "es-AR" });
  const page = await ctx.newPage();
  for (const p of PANTALLAS) {
    await page.goto(BASE + p.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(200);
    if (p.clic) { await page.click(p.clic).catch(() => {}); await page.waitForTimeout(300); }
    const caso = `${p.id} | ${ancho} px | ${modo === "light" ? "claro" : "oscuro"}`;
    for (const f of await page.evaluate(auditar)) {
      const k = `${f.regla}|${f.elemento}|${f.detalle}`;
      if (!hallazgos.has(k)) hallazgos.set(k, { ...f, casos: [] });
      hallazgos.get(k).casos.push(caso);
    }
  }
  await ctx.close();
}
await navegador.close(); servidor.close();

await mkdir(SALIDA, { recursive: true });
const fecha = new Date().toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" });
await writeFile(join(SALIDA, "auditoria-design-system.md"), `# Auditoría contra el design system | Taller - IA\n\nGenerada el ${fecha} con \`npm run auditar\`: ${PANTALLAS.length} pantallas, anchos ${ANCHOS.join(", ")} px, modo claro y oscuro.\n\n${seccionAuditoria(hallazgos)}\n`, "utf8");
const porRegla = {}; hallazgos.forEach(h => { porRegla[h.regla] = (porRegla[h.regla] || 0) + 1; });
console.log(hallazgos.size ? `Design system: ${hallazgos.size} elementos fuera de las reglas | ${Object.entries(porRegla).map(([r, n]) => `${r}: ${n}`).join(" | ")}` : "Design system: todo cumple");
console.log("Reporte: verificacion/auditoria-design-system.md");
process.exitCode = hallazgos.size ? 1 : 0;
