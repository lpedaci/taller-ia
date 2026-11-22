/* Taller - IA | Galería de capturas para revisar a mano (solo desarrollo)
   Uso: npm run galeria  (después de npm run verificar, que genera las capturas)
   Arma una hoja por clase de ventana de M3 (Compact, Medium, Expanded y Large), con las pantallas
   principales en modo claro y oscuro, lado a lado. Resultado: verificacion/galeria-<clase>.png */
import { chromium } from "playwright";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CAP = join(RAIZ, "verificacion", "capturas");
const CLASES = [["compact", 360, "Compact (360 px)"], ["medium", 768, "Medium (768 px)"], ["expanded", 1024, "Expanded (1024 px)"], ["large", 1280, "Large (1280 px)"]];
const PANTALLAS = [["inicio-ejemplo", "Inicio"], ["recorrido", "Mi recorrido"], ["agenda-semana", "Agenda"], ["aprendizaje", "Mi aprendizaje"],
  ["leccion", "Lección"], ["m4-marco4d", "Marco 4D"], ["m6-subir-nivel", "Subí de nivel"], ["anim-agente", "Animación"], ["m20-proyecto", "Proyecto final"],
  ["glosario", "Glosario"], ["biblioteca", "Biblioteca"], ["facilitadores", "Facilitadores"]];
const existe = f => access(f).then(() => true, () => false);
const b = await chromium.launch();
for (const [clase, ancho, titulo] of CLASES) {
  let html = `<body style="margin:0;padding:24px;background:#e8e8ec;font:16px system-ui"><h1 style="font-size:28px;margin:0 0 16px">Taller - IA | ${titulo}</h1><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px">`;
  for (const [id, nombre] of PANTALLAS) for (const modo of ["claro", "oscuro"]) {
    const f = join(CAP, `${id}-${ancho}-${modo}.png`);
    if (!(await existe(f))) continue;
    const src = "data:image/png;base64," + (await readFile(f)).toString("base64");
    html += `<figure style="margin:0"><figcaption style="margin-bottom:6px">${nombre} | ${modo}</figcaption><div style="height:${ancho < 600 ? 640 : 420}px;overflow:hidden;border:1px solid #bbb;border-radius:8px;background:#fff"><img src="${src}" style="width:100%;display:block"></div></figure>`;
  }
  html += `</div></body>`;
  const p = await b.newPage({ viewport: { width: 1800, height: 1000 } });
  await p.setContent(html); await p.waitForTimeout(300);
  await p.screenshot({ path: join(RAIZ, "verificacion", `galeria-${clase}.png`), fullPage: true });
  await p.close();
  console.log(`verificacion/galeria-${clase}.png`);
}
await b.close();
