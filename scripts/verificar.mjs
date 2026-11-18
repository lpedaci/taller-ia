/* Taller - IA | Verificación automática (solo desarrollo)
   Uso: npm run verificar           (todas las pantallas, 6 anchos, claro y oscuro)
        npm run verificar:rapido    (3 anchos)
   Hace: capturas, axe-core, scroll horizontal, áreas táctiles en mobile,
   errores de consola, movimiento reducido y búsqueda de rayas largas y puntos medios.
   Resultado: verificacion/capturas/*.png y verificacion/reporte-accesibilidad.md */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";
import { crearServidor } from "./servidor.mjs";

const require = createRequire(import.meta.url);
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = join(RAIZ, "verificacion");
const CAPTURAS = join(SALIDA, "capturas");
const rapido = process.argv.includes("--rapido");

const ANCHOS = rapido ? [360, 768, 1280] : [360, 412, 768, 1024, 1280, 1920];
const MODOS = ["light", "dark"];
const PANTALLAS = [
  { id: "inicio", url: "index.html#/inicio" },
  { id: "inicio-ejemplo", url: "index.html?demo=1#/inicio" },
  { id: "agenda-vacia", url: "index.html#/agenda" },
  { id: "estado-error", url: "index.html?simular=error#/inicio" },
  { id: "estado-error-leccion", url: "index.html?simular=error-leccion#/modulo/prueba/paso/2" },
  { id: "estado-sin-conexion", url: "index.html?simular=sin-conexion#/modulo/prueba/paso/4", clic: ".video-play" },
  { id: "leccion", url: "index.html#/modulo/prueba/paso/3" },
  { id: "video", url: "index.html#/modulo/prueba/paso/4" },
  { id: "act-chequeo", url: "index.html#/modulo/prueba/paso/5" },
  { id: "act-clasificar", url: "index.html#/modulo/prueba/paso/6" },
  { id: "act-escenario", url: "index.html#/modulo/prueba/paso/7" },
  { id: "act-constructor", url: "index.html#/modulo/prueba/paso/8" },
  { id: "act-comparar", url: "index.html#/modulo/prueba/paso/9" },
  { id: "act-disenar", url: "index.html#/modulo/prueba/paso/10" },
  { id: "act-reflexion", url: "index.html#/modulo/prueba/paso/11" },
  { id: "leccion-fin", url: "index.html#/modulo/prueba/completado" },
  { id: "recorrido", url: "index.html#/recorrido" },
  { id: "agenda-semana", url: "index.html#/agenda/semana" },
  { id: "agenda-mes", url: "index.html#/agenda/mes" },
  { id: "agenda-dia", url: "index.html#/agenda/dia" },
  { id: "aprendizaje", url: "index.html#/aprendizaje" },
  { id: "modulo-sin-leccion", url: "index.html#/modulo/6" },
  { id: "biblioteca", url: "index.html#/biblioteca" },
  { id: "glosario", url: "index.html#/glosario" },
  { id: "facilitadores", url: "index.html#/facilitadores" },
  { id: "ayuda", url: "index.html#/ayuda" },
  { id: "ajustes", url: "index.html#/ajustes" },
  { id: "estilos", url: "estilos.html" }
];

const IMPACTO = { critical: "Crítico", serious: "Grave", moderate: "Moderado", minor: "Menor" };
const ORDEN = ["critical", "serious", "moderate", "minor"];

/* axe-core en español */
const axeBase = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
let axeEs = "";
try { axeEs = await readFile(join(dirname(require.resolve("axe-core/axe.min.js")), "locales", "es.json"), "utf8"); } catch { /* sin traducción */ }
const axeSource = axeBase + (axeEs ? `\n;axe.configure({locale:${axeEs}});` : "");

await rm(CAPTURAS, { recursive: true, force: true });
await mkdir(CAPTURAS, { recursive: true });

const servidor = crearServidor();
await new Promise(r => servidor.listen(0, r));
const BASE = `http://localhost:${servidor.address().port}/`;
const navegador = await chromium.launch();

const problemasAxe = new Map();   // id de regla -> { regla, impacto, ayuda, url, casos: Set }
const excepciones = new Set();
const scroll = [], tactiles = [], consola = [], textos = [], movimiento = [];
let capturas = 0, corridasAxe = 0;

async function abrir(contexto, url) {
  const page = await contexto.newPage();
  const errores = [];
  page.on("console", m => { if (m.type() === "error") errores.push(m.text()); });
  page.on("pageerror", e => errores.push(e.message));
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForFunction(() => document.querySelector("#contenido")?.getAttribute("aria-busy") !== "true" || !document.querySelector("#contenido"), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(250);
  return { page, errores };
}

for (const modo of MODOS) {
  for (const ancho of ANCHOS) {
    const alto = ancho < 600 ? 800 : ancho < 1200 ? 1000 : 1000;
    const contexto = await navegador.newContext({ viewport: { width: ancho, height: alto }, colorScheme: modo, locale: "es-AR", hasTouch: ancho < 600, isMobile: ancho < 600, deviceScaleFactor: 1 });
    for (const p of PANTALLAS) {
      const { page, errores } = await abrir(contexto, p.url);
      const caso = `${p.id} | ${ancho} px | ${modo === "light" ? "claro" : "oscuro"}`;
      if (p.clic) { await page.click(p.clic); await page.waitForTimeout(300); }

      // Captura de página completa
      await page.screenshot({ path: join(CAPTURAS, `${p.id}-${ancho}-${modo === "light" ? "claro" : "oscuro"}.png`), fullPage: true });
      capturas++;

      // Scroll horizontal
      const sw = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth }));
      if (sw.sw > sw.w + 1) scroll.push(`${caso}: el contenido mide ${sw.sw} px en una ventana de ${sw.w} px`);
      // Elementos que se salen de la ventana por la derecha (quedan cortados aunque no haya scroll)
      const cortados = await page.evaluate(() => [...document.querySelectorAll("body *")].filter(el => {
        if (el.closest("[hidden], dialog:not([open]), .sheet, .sr-only, .skip, .tooltip, .snackbar, svg, .heat-wrap, .rail")) return false;
        const r = el.getBoundingClientRect(); return r.width && r.height && r.right > innerWidth + 1 && r.left < innerWidth;
      }).slice(0, 3).map(el => (el.id ? "#" + el.id : el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.split(" ")[0] : ""))));
      if (cortados.length) scroll.push(`${caso}: elementos cortados a la derecha: ${cortados.join(", ")}`);

      // Áreas táctiles en mobile: 48 px, medidas como zona que responde al toque
      if (ancho < 600) {
        const chicos = await page.evaluate(() => {
          const sel = 'a[href], button, input:not([type=hidden]), select, textarea, [role="button"], [role="menuitem"], [tabindex="0"]';
          const out = [];
          for (const el of document.querySelectorAll(sel)) {
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height || getComputedStyle(el).visibility === "hidden") continue;
            if (el.closest("[hidden], dialog:not([open]), .sheet:not(.open), .menu[hidden], .sr-only, .skip")) continue;
            if (el.closest("details:not([open])") && !el.closest("summary")) continue; // dentro de una sección plegada
            if (el.matches("input[type=checkbox], input[type=radio]") && el.labels && el.labels[0]) {
              const lr = el.labels[0].getBoundingClientRect(); if (lr.height >= 24) continue;
            }
            // Excepción de WCAG 2.5.8: enlaces dentro de un texto corrido
            if (getComputedStyle(el).display === "inline" && el.closest("p, li, .next-step, .lead, .status")) continue;
            el.scrollIntoView({ block: "center", inline: "center" });
            const r2 = el.getBoundingClientRect();
            const toca = (x, y) => { const t = document.elementFromPoint(x, y); return t && (t === el || el.contains(t)); };
            const cx = r2.left + r2.width / 2, cy = r2.top + r2.height / 2;
            const altoOk = r2.height >= 48 || (toca(cx, cy - 23) && toca(cx, cy + 23));
            const anchoOk = r2.width >= 48 || (toca(cx - 23, cy) && toca(cx + 23, cy));
            if (altoOk && anchoOk) continue;
            if (el.dataset.excepcionTactil && r2.width >= 44 && r2.height >= 44) { out.push("EXC|" + el.dataset.excepcionTactil); continue; }
            const nombre = (el.getAttribute("aria-label") || el.textContent || el.id || el.tagName).trim().replace(/\s+/g, " ").slice(0, 50);
            out.push(`${nombre} (${Math.round(r.width)} x ${Math.round(r.height)} px)`);
          }
          scrollTo(0, 0);
          return [...new Set(out)];
        });
        chicos.forEach(c => c.startsWith("EXC|") ? excepciones.add(c.slice(4)) : tactiles.push(`${caso}: ${c}`));
      }

      // Rayas largas y puntos medios en el texto visible
      const malos = await page.evaluate(() => {
        const t = document.body.innerText; const out = [];
        for (const ch of [String.fromCharCode(0x2014), String.fromCharCode(0xb7)]) { const i = t.indexOf(ch); if (i > -1) out.push(`"${ch}" en: ...${t.slice(Math.max(0, i - 30), i + 30).replace(/\s+/g, " ")}...`); }
        return out;
      });
      malos.forEach(m => textos.push(`${caso}: ${m}`));

      // axe-core. La barra flotante de la lección se fija en su lugar para medir el tamaño real de los objetivos:
      // si no, axe cuenta como "tapado" lo que queda debajo de ella en el borde de la ventana.
      await page.addStyleTag({ content: ".lesson-bar{position:static!important}" });
      const res = await new AxeBuilder({ page, axeSource }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      corridasAxe++;
      for (const v of res.violations) {
        const k = v.id;
        if (!problemasAxe.has(k)) problemasAxe.set(k, { regla: v.id, impacto: v.impact, ayuda: v.help, descripcion: v.description, url: v.helpUrl, casos: new Set(), nodos: new Set() });
        const e = problemasAxe.get(k);
        e.casos.add(caso);
        v.nodes.slice(0, 3).forEach(n => e.nodos.add(n.target.join(" ") + (n.failureSummary ? " | " + n.failureSummary.split("\n").slice(1, 2).join(" ").trim() : "")));
      }

      errores.forEach(e => consola.push(`${caso}: ${e}`));
      await page.close();
    }
    await contexto.close();
  }
}

/* Movimiento reducido: no debe quedar ninguna transición ni animación de más de 20 ms */
{
  const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  for (const p of PANTALLAS.slice(0, 3).concat(PANTALLAS.find(x => x.id === "estilos"))) {
    const { page } = await abrir(contexto, p.url);
    const largos = await page.evaluate(() => {
      const out = new Set();
      for (const el of document.querySelectorAll("*")) {
        for (const pseudo of [null, "::before", "::after"]) {
          const cs = getComputedStyle(el, pseudo);
          const ms = v => Math.max(...v.split(",").map(s => s.trim().endsWith("ms") ? parseFloat(s) : parseFloat(s) * 1000));
          if (ms(cs.transitionDuration) > 20 || (cs.animationName !== "none" && ms(cs.animationDuration) > 20)) out.add((el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : el.tagName) + (pseudo || ""));
        }
      }
      return [...out].slice(0, 10);
    });
    largos.forEach(l => movimiento.push(`${p.id}: ${l}`));
    await page.close();
  }
  await contexto.close();
}

await navegador.close();
servidor.close();

/* ---------- Reporte en español ---------- */
const lista = (arr, vacio) => arr.length ? arr.map(x => `- ${x}`).join("\n") : `- ${vacio}`;
const porImpacto = ORDEN.map(imp => {
  const items = [...problemasAxe.values()].filter(p => p.impacto === imp);
  if (!items.length) return `### ${IMPACTO[imp]}\n\nSin problemas.`;
  return `### ${IMPACTO[imp]}\n\n` + items.map(p => `**${p.ayuda}** (regla \`${p.regla}\`)\n\n${p.descripcion}\n\n- Dónde: ${p.casos.size} combinaciones de pantalla, ancho y modo. Por ejemplo: ${[...p.casos].slice(0, 4).join("; ")}.\n- Elementos: ${[...p.nodos].slice(0, 4).map(n => "`" + n + "`").join(", ")}\n- Más información: ${p.url}`).join("\n\n");
}).join("\n\n");
const criticos = [...problemasAxe.values()].filter(p => p.impacto === "critical" || p.impacto === "serious").length;
const fecha = new Date().toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" });

const md = `# Reporte de verificación | Taller - IA

Generado el ${fecha} con \`npm run verificar${rapido ? ":rapido" : ""}\`.

## Resumen

| Chequeo | Resultado |
|---|---|
| Capturas | ${capturas} (${PANTALLAS.length} pantallas, anchos ${ANCHOS.join(", ")} px, modo claro y oscuro) |
| axe-core | ${corridasAxe} análisis; ${problemasAxe.size} reglas con problemas; ${criticos} críticas o graves |
| Scroll horizontal | ${scroll.length ? scroll.length + " casos" : "Sin scroll horizontal"} |
| Áreas táctiles de 48 px en mobile | ${tactiles.length ? tactiles.length + " elementos por debajo" : "Todas cumplen"} |
| Errores de consola | ${consola.length ? consola.length : "Ninguno"} |
| Movimiento reducido | ${movimiento.length ? movimiento.length + " elementos con movimiento" : "Sin transiciones ni animaciones"} |
| Rayas largas y puntos medios en el texto | ${textos.length ? textos.length + " casos" : "Ninguno"} |

## Accesibilidad automática (axe-core), por gravedad

${porImpacto}

## Scroll horizontal

${lista(scroll, "Ninguna pantalla tiene scroll horizontal.")}

## Áreas táctiles en mobile (menos de 48 px)

${lista(tactiles.slice(0, 60), "Todos los elementos interactivos tienen un área táctil de 48 px o más.")}${tactiles.length > 60 ? `\n- Y ${tactiles.length - 60} más.` : ""}

Excepciones aceptadas y documentadas en DECISIONES.md:

${lista([...excepciones], "Ninguna.")}

## Errores de consola

${lista(consola, "No hubo errores de consola.")}

## Movimiento reducido

${lista(movimiento, "Con \"reducir movimiento\" activado no quedan transiciones ni animaciones.")}

## Texto: rayas largas y puntos medios

${lista(textos, "No se encontraron.")}

Nota: durante el análisis de axe-core, la barra flotante de las lecciones se fija en su lugar, para que no cuente como "tapado" el contenido que queda debajo de ella en el borde de la ventana. Para el teclado, el sitio usa \`scroll-padding\`: el elemento con foco siempre queda visible por encima de la barra.

## Qué se revisa a mano

Las herramientas automáticas detectan solo una parte de los problemas de accesibilidad. En cada etapa se revisa además, a mano:

- Las capturas, una por una: jerarquía, alineación, espacios, cortes de texto, superposiciones y consistencia con M3.
- El recorrido con teclado: Tab, Shift+Tab, Enter, Espacio, flechas y Escape en diálogos y menús, el orden del foco y que el foco se vea.
- La estructura semántica: encabezados en orden, regiones (*landmarks*), nombres accesibles y alternativas en tabla de los gráficos.

Conviene probar, cuando haya oportunidad, con personas usuarias reales y con un lector de pantalla: NVDA en Windows, VoiceOver en iOS o TalkBack en Android.
`;
await writeFile(join(SALIDA, "reporte-accesibilidad.md"), md, "utf8");

console.log(`Capturas: ${capturas} | axe: ${problemasAxe.size} reglas con problemas (${criticos} críticas o graves) | scroll: ${scroll.length} | táctiles: ${tactiles.length} | consola: ${consola.length} | movimiento: ${movimiento.length} | texto: ${textos.length}`);
console.log("Reporte: verificacion/reporte-accesibilidad.md");
process.exitCode = (criticos || scroll.length || consola.length) ? 1 : 0;
