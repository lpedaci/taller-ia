/* Taller - IA | Revisión automática de los textos del taller (solo desarrollo)
   Uso: npm run textos
   Recorre los textos visibles de content/*.json y busca:
   - rayas largas (—) y puntos medios (·), que el brief no admite;
   - texto en inglés sin traducir fuera de las referencias, los títulos de obras y los originales de las citas;
   - citas traducidas sin el original, sin idioma o sin etiqueta;
   - palabras repetidas ("de de"), signos de apertura sin cierre (¿ ?, ¡ !) y comillas o paréntesis sin cerrar;
   - espacios dobles y espacios antes de un signo de puntuación;
   - menciones a niñas, niños o menores (el taller es para personas adultas);
   - ortografía que se puede revisar con reglas: interrogativos y "más" sin tilde, tildes que no corresponden,
     homófonos frecuentes (haber/a ver, hecho/echo), "de el" y "a el", y minúscula después de punto (D-074).
   Resultado: verificacion/textos.md. Termina con error si encuentra algo. */
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Claves que no son texto para leer, o que pueden estar en inglés a propósito
const OMITIR = new Set(["id", "url", "ref", "guion", "ic", "tipo", "apa", "original", "lang", "archivo", "categoria", "subtitulos", "competencia", "objetivo", "momento", "requiere", "q", "estado", "clase", "de", "a", "icono"]);
// Las letras con tilde no cuentan para \b: los límites de palabra se arman con \p{L}
const ORTOGRAFIA = [
  ["Interrogativo sin tilde", /¿(que|como|cual|cuales|cuando|donde|quien|quienes|cuanto|cuanta|cuantos|cuantas|por que)(?!\p{L})/iu],
  ["\"Más\" sin tilde", /(?<!\p{L})mas(?!\p{L})/iu],
  ["Tilde que no corresponde", /(?<!\p{L})(fué|fuí|dió|vió|tí|guión)(?!\p{L})/iu],
  ["\"Sé\" sin tilde", /(?<!\p{L})(no|yo|ya) se (si|qué|cómo|cuál|cuándo|dónde)(?!\p{L})/iu],
  ["Homófono o forma incorrecta", /(?<!\p{L})(haber si|a echo|ha echo|valla|halla|a sido|ha ver|ahi|osea|aveces|enserio|talvez|apesar|sobretodo)(?!\p{L})/iu],
  ["Contracción (del, al)", /(?<!\p{L})(de el|a el)(?!\p{L})/u],
  ["Minúscula después de punto", /(?<![0-9])[.!?] [a-záéíóúñ]/u]
];
const INGLES = /\b(the|and|with|your|you|for|this|that|from|are|is|of|to|how|what|why)\b/gi;
const PERMITIDO_EN = /(AI Fluency|Building effective agents|What is ChatGPT doing|Prompt engineering|Prompting best practices|Model Context Protocol|Content Authenticity|Weapons of math|AI snake oil|Co-intelligence|AI engineering|Artificial intelligence: a guide|Energy and AI|Copyright and|Making AI less|Chain-of-thought|ReAct|Retrieval-augmented|Get started|Tips to write|Get help|Large language model|Human-in-the-loop|Few-shot|Content Credentials|Voice mode|Application programming|Use voice mode|How Claude remembers|Creating a GitHub|Intro to large|OpenAI Academy|AI competency framework|AI Act|OECD AI Principles|Elements of AI|Guidance for|chain of thought|vibe coding|deep learning|machine learning)/i;
const hallazgos = [];
const textos = [];
function recorrer(v, ruta, archivo) {
  if (typeof v === "string") { textos.push({ t: v, ruta, archivo }); return; }
  if (Array.isArray(v)) { v.forEach((x, i) => recorrer(x, `${ruta}[${i}]`, archivo)); return; }
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { if (!OMITIR.has(k)) recorrer(x, ruta ? `${ruta}.${k}` : k, archivo); }
}
for (const f of (await readdir(join(RAIZ, "content"))).filter(x => x.endsWith(".json"))) recorrer(JSON.parse(await readFile(join(RAIZ, "content", f), "utf8")), "", f);
for (const f of (await readdir(join(RAIZ, "content", "animaciones"))).filter(x => x.endsWith(".json"))) recorrer(JSON.parse(await readFile(join(RAIZ, "content", "animaciones", f), "utf8")), "", "animaciones/" + f);

const agregar = (tipo, x, detalle) => hallazgos.push(`- **${tipo}** en \`${x.archivo}\` (${x.ruta}): ${detalle}`);
for (const x of textos) {
  const t = x.t;
  if (/[—·]/.test(t)) agregar("Raya o punto medio", x, `«${t.slice(0, 80)}»`);
  const sinMarcas = t.replace(/\*[^*]+\*/g, "").replace(/`[^`]+`/g, "").replace(/\[[^\]]+\]\([^)]+\)/g, "");
  const en = (sinMarcas.match(INGLES) || []).filter(w => !/^(a)$/i.test(w));
  if (en.length >= 3 && !PERMITIDO_EN.test(t) && !/^nota$|^_nota$/.test(x.ruta)) agregar("Posible texto en inglés", x, `«${t.slice(0, 90)}»`);
  // Palabras repetidas: con \p{L}, porque \b no reconoce las letras con tilde como parte de una palabra
  const rep = t.match(/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu);
  if (rep && !/^(no|sí)$/i.test(rep[1])) agregar("Palabra repetida", x, `«${rep[0]}»`);
  if ((t.match(/¿/g) || []).length !== (t.match(/\?/g) || []).length) agregar("Signos de pregunta sin par", x, `«${t.slice(0, 90)}»`);
  if ((t.match(/¡/g) || []).length !== (t.match(/!/g) || []).length) agregar("Signos de exclamación sin par", x, `«${t.slice(0, 90)}»`);
  if ((t.match(/«/g) || []).length !== (t.match(/»/g) || []).length) agregar("Comillas sin cerrar", x, `«${t.slice(0, 90)}»`);
  if ((t.match(/"/g) || []).length % 2) agregar("Comillas sin cerrar", x, `«${t.slice(0, 90)}»`);
  // Paréntesis: no cuentan las enumeraciones ("1)") ni los textos partidos en segmentos
  const sinEnum = t.replace(/(^|[:,;.]\s+)[1-9]\)(?=\s)/g, " ");
  if (!/segmentos/.test(x.ruta) && (sinEnum.match(/\(/g) || []).length !== (sinEnum.match(/\)/g) || []).length) agregar("Paréntesis sin cerrar", x, `«${t.slice(0, 90)}»`);
  if (!/codigo/.test(x.ruta) && / {2,}\S/.test(t.replace(/^ +/gm, ""))) agregar("Espacio doble", x, `«${t.slice(0, 60)}»`);
  if (/ [,.;:!?)]/.test(t)) agregar("Espacio antes de un signo", x, `«${t.match(/.{0,20} [,.;:!?)].{0,10}/)[0]}»`);
  if (/\b(niñ[oa]s?|menores de edad|chic[oa]s de primaria|escuela primaria)\b/i.test(t)) agregar("Mención a menores", x, `«${t.slice(0, 90)}»`);
  // Ortografía que se puede revisar con reglas (D-074). No se revisan el código, los tokens ni las plantillas con {variables}
  if (!/codigo|tokens|plantilla/.test(x.ruta)) for (const [tipo, re] of ORTOGRAFIA) { const m = t.match(re); if (m) agregar(tipo, x, `«${t.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30)}»`); }
}
// Citas traducidas: original, idioma y tipo de traducción
for (const f of (await readdir(join(RAIZ, "content"))).filter(x => /^modulo-.*\.json$/.test(x))) {
  const d = JSON.parse(await readFile(join(RAIZ, "content", f), "utf8"));
  d.pasos.forEach((p, i) => p.bloques.filter(b => b.tipo === "cita").forEach(b => {
    if (!b.original || !(b.lang || true) || !b.traduccion && !b.idioma) hallazgos.push(`- **Cita incompleta** en \`${f}\`, paso ${i + 1}: falta el original o el tipo de traducción.`);
  }));
}
await mkdir(join(RAIZ, "verificacion"), { recursive: true });
await writeFile(join(RAIZ, "verificacion", "textos.md"), `# Revisión de textos | Taller - IA\n\n${textos.length} textos revisados con \`npm run textos\`.\n\n${hallazgos.length ? hallazgos.join("\n") : "No se encontraron problemas."}\n`, "utf8");
console.log(`${textos.length} textos revisados: ${hallazgos.length ? hallazgos.length + " hallazgos" : "sin hallazgos"}.`);
hallazgos.slice(0, 40).forEach(h => console.log(h));
process.exitCode = hallazgos.length ? 1 : 0;
