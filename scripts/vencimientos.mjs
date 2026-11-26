/* Taller - IA | Qué datos verificables están vencidos (solo desarrollo y workflow de verificación)
   Uso: node scripts/vencimientos.mjs
        node scripts/vencimientos.mjs --hoy 2027-01-15                  (simula otra fecha, para probar)
        node scripts/vencimientos.mjs --verificaciones ultima.json      (fechas de la última verificación)

   No agrega fechas a mano en ningún archivo. Cada dato tiene dos fechas, y las dos salen de registros automáticos:
   - Fecha de cambio: el último commit que tocó las líneas del dato (git blame). Necesita el historial completo:
     en GitHub Actions, actions/checkout con fetch-depth: 0.
   - Fecha de verificación: la del último Issue de verificación que revisó el dato. El workflow la lee del Issue
     y se la pasa a este script con --verificaciones (un JSON { "id del dato": "AAAA-MM-DD" }). Sin ese archivo,
     solo cuenta la fecha de cambio.

   Un dato vence cuando pasaron más días que su regla desde la más reciente de esas dos fechas.
   Los datos "a-verificar" van siempre al informe, sin importar la fecha. También los que no tienen una fuente
   que los respalde por sí sola (sin URL, o con la portada de un sitio): para esos, el paso con IA busca una
   fuente específica que proponer.

   Alcance del piloto: Módulo 11 (herramientas.json, funciones de los asistentes) y Módulo 10 (marco-legal.json).
   Resultado: verificacion/vencimientos.md (para leer) y verificacion/vencimientos.json (para el paso con IA). */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIA = 86400000;

// Cada cuántos días se vuelve a verificar cada tipo de dato. Lo decide Lourdes (tarea 7 del plan).
const REGLAS = {
  herramienta: { dias: 30, motivo: "Las funciones de los asistentes cambian seguido." },
  ley: { dias: 180, motivo: "La normativa cambia poco, pero cambia." }
};

const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const hoy = arg("--hoy") ? new Date(arg("--hoy") + "T12:00:00") : new Date();
let verificaciones = {};
if (arg("--verificaciones")) verificaciones = JSON.parse(await readFile(arg("--verificaciones"), "utf8"));

/* Fecha del último commit de cada línea de un archivo, con git blame. */
function fechasPorLinea(archivo) {
  let salida;
  try { salida = execFileSync("git", ["blame", "--line-porcelain", archivo], { cwd: RAIZ, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }); }
  catch { throw new Error(`No se pudo leer el historial de ${archivo}. ¿El repo tiene el historial completo (fetch-depth: 0)?`); }
  const fechas = [];
  for (const l of salida.split("\n")) if (l.startsWith("author-time ")) fechas.push(Number(l.slice(12)) * 1000);
  return fechas;   // fechas[0] es la línea 1
}

/* Recorre el JSON como texto y devuelve, para cada dato, el rango de líneas que ocupa.
   Usa la indentación de 2 espacios con la que se guardan los archivos del taller. */
function rangos(texto, inicio, fin) {
  const lineas = texto.split("\n"), salida = [];
  let actual = null;
  lineas.forEach((l, i) => {
    const abre = l.match(inicio);
    if (abre) actual = { clave: abre[1], desde: i, contexto: actual?.contexto };
    if (actual && fin.test(l) && i > actual.desde) { salida.push({ ...actual, hasta: i }); actual = null; }
  });
  return salida;
}

const datos = [];

/* Módulo 11: cada función de cada asistente es un dato */
{
  const archivo = "content/herramientas.json";
  const texto = await readFile(join(RAIZ, archivo), "utf8");
  const json = JSON.parse(texto);
  const fechas = fechasPorLinea(archivo);
  const lineas = texto.split("\n");
  let herramienta = null;
  lineas.forEach((l, i) => {
    const id = l.match(/^ {6}"id": "([^"]+)"/); if (id) herramienta = id[1];
    const f = l.match(/^ {8}"([a-z]+)": \{$/);
    if (!f || !herramienta) return;
    let j = i; while (!/^ {8}\}/.test(lineas[j])) j++;
    const h = json.herramientas.find(x => x.id === herramienta);
    const v = h?.funciones?.[f[1]]; if (!v) return;
    datos.push({
      id: `herramientas/${herramienta}/${f[1]}`, tipo: "herramienta", modulo: 11,
      que: `${h.nombre}: ${json.funciones[f[1]] || f[1]}`, estado: v.estado, afirma: v.detalle, url: v.url,
      cambio: Math.max(...fechas.slice(i, j + 1)), archivo, lineas: `${i + 1}-${j + 1}`
    });
  });
}

/* Módulo 10: cada ley de la región es un dato */
{
  const archivo = "content/marco-legal.json";
  const texto = await readFile(join(RAIZ, archivo), "utf8");
  const json = JSON.parse(texto);
  const fechas = fechasPorLinea(archivo);
  for (const r of rangos(texto, /^ {6}"pais": "([^"]+)"/, /^ {4}\}/)) {
    const p = json.paises.find(x => x.pais === r.clave); if (!p) continue;
    datos.push({
      id: `marco-legal/${p.pais.toLowerCase()}`, tipo: "ley", modulo: 10,
      que: `${p.pais}: ${p.norma}`, estado: p.verificado ? "verificado" : "a-verificar", afirma: p.resumen, url: p.url,
      cambio: Math.max(...fechas.slice(r.desde - 1, r.hasta + 1)), archivo, lineas: `${r.desde}-${r.hasta + 1}`
    });
  }
}

/* Aplicar la regla */
const fecha = ms => new Date(ms).toISOString().slice(0, 10);
for (const d of datos) {
  const verif = verificaciones[d.id] ? new Date(verificaciones[d.id] + "T12:00:00").getTime() : null;
  const base = Math.max(d.cambio, verif || 0);
  d.fechaCambio = fecha(d.cambio);
  d.fechaVerificacion = verif ? fecha(verif) : null;
  d.vence = fecha(base + REGLAS[d.tipo].dias * DIA);
  d.diasRestantes = Math.floor((base + REGLAS[d.tipo].dias * DIA - hoy.getTime()) / DIA);
  // Fuente que no respalda el dato por sí sola: sin URL, o la portada de un sitio en lugar de la página que lo dice
  let general = !d.url; try { if (d.url) general = ["", "/"].includes(new URL(d.url).pathname); } catch { general = true; }
  d.fuenteGeneral = general;
  d.motivo = d.estado === "a-verificar" ? "Marcado \"a verificar\""
    : d.diasRestantes < 0 ? `Vencido hace ${-d.diasRestantes} ${d.diasRestantes === -1 ? "día" : "días"}`
    : general ? (d.url ? "Fuente demasiado general: portada del sitio" : "Sin fuente") : null;
  delete d.cambio;
}
const revisar = datos.filter(d => d.motivo);
const proximos = datos.filter(d => !d.motivo && d.diasRestantes <= 7);

/* Salida */
const fila = d => `| ${d.que} | ${d.fechaCambio} | ${d.fechaVerificacion || "sin registro"} | ${d.vence} | ${d.motivo || `vence en ${d.diasRestantes} ${d.diasRestantes === 1 ? "día" : "días"}`} |`;
const tabla = lista => lista.length ? `| Dato | Último cambio | Última verificación | Vence | Situación |\n|---|---|---|---|---|\n${lista.map(fila).join("\n")}` : "Ninguno.";
await mkdir(join(RAIZ, "verificacion"), { recursive: true });
await writeFile(join(RAIZ, "verificacion", "vencimientos.json"), JSON.stringify({ hoy: fecha(hoy.getTime()), reglas: REGLAS, revisar, proximos, total: datos.length }, null, 2) + "\n", "utf8");
await writeFile(join(RAIZ, "verificacion", "vencimientos.md"), `# Datos para verificar | Taller - IA\n\nCalculado el ${fecha(hoy.getTime())} sobre ${datos.length} datos de los Módulos 10 y 11.\n\nReglas: ${Object.entries(REGLAS).map(([k, r]) => `${k}, cada ${r.dias} días`).join("; ")}.\n\n## Para revisar ahora (${revisar.length})\n\n${tabla(revisar)}\n\n## Vencen en los próximos 7 días (${proximos.length})\n\n${tabla(proximos)}\n`, "utf8");
console.log(`${datos.length} datos: ${revisar.length} para revisar ahora, ${proximos.length} vencen en 7 días.`);
revisar.forEach(d => console.log(`- ${d.que} (${d.motivo})`));
