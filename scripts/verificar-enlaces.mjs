/* Taller - IA | Revisa los enlaces externos del contenido (solo desarrollo)
   Uso: npm run enlaces (algunos sitios mandan cabeceras muy grandes: el script se corre con --max-http-header-size)
   Junta las URL de content/*.json, js/ e index.html, pide cada una y clasifica el resultado:
   - funciona (2xx, o una redirección a la misma página con otra dirección);
   - redirige a otra página (2xx, pero la dirección final es otra página: otro artículo, otro documento). El enlace
     anda, pero la página original puede haberse reemplazado; conviene revisar si actualizar la URL (D-082);
   - bloquea la lectura automática (401, 403, 429 o 999, o un certificado sin la cadena completa, que el navegador sí
     completa): el sitio existe pero no se deja leer por programas; se revisa a mano;
   - roto (404, 410, error de conexión): hay que corregirlo.
   Resultado: verificacion/enlaces.md. Termina con error si hay enlaces rotos. */
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const archivos = [];
async function juntar(dir, ext) { for (const f of await readdir(join(RAIZ, dir), { withFileTypes: true })) { const r = join(dir, f.name); if (f.isDirectory()) await juntar(r, ext); else if (ext.some(e => f.name.endsWith(e))) archivos.push(r); } }
await juntar("content", [".json"]); await juntar("js", [".js"]); archivos.push("index.html");
const donde = new Map();
for (const f of archivos) {
  const t = await readFile(join(RAIZ, f), "utf8");
  for (const m of t.matchAll(/https?:\/\/[^\s"'`)<>\]\\]+/g)) {
    const u = m[0].replace(/[.,;]+$/, "");
    if (/fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|w3\.org\/2000|localhost/.test(u)) continue;
    if (!donde.has(u)) donde.set(u, new Set()); donde.get(u).add(f.replace(/\\/g, "/"));
  }
}
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
// Sitios oficiales que no se dejan leer por programas, pero que una persona abrió en el navegador.
// Si fallan acá, cuentan como "bloquea la lectura automática" (se revisan a mano), no como rotos. Al sumar uno, anotá quién y cuándo.
const REVISADOS_A_MANO = new Map([
  ["https://www.dof.gob.mx/nota_detalle.php?codigo=5752569&fecha=20/03/2025", "Lourdes, 23/11/2026 (D-075)"],
  ["https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus", "Lourdes, 23/11/2026 (D-075)"]
]);
// Redirecciones que se revisaron y están bien: el sitio redirige a propósito (al inicio de sesión, a su documentación).
// Cuentan como "funciona". Al sumar una, anotá quién la revisó, cuándo y por qué (D-082).
const REDIRECCIONES_ACEPTADAS = new Map([
  // ["https://claude.ai/", "Lourdes, AAAA-MM-DD: lleva al inicio de sesión"],
  ["https://claude.ai/", "Lourdes, 2026-11-26: lleva al inicio de sesión"],
  ["https://modelcontextprotocol.io/", "Lourdes, 2026-11-26: lleva a su documentación"],
]);
// Los DOI redirigen siempre, por diseño: doi.org envía al lugar donde hoy está publicado el trabajo. APA 7 pide citar el DOI.
const esDOI = u => /^https?:\/\/(dx\.)?doi\.org\//i.test(u);
async function probar(u, intento = 1) {
  const r = await probarUna(u);
  if (r.estado === "redirige" && (esDOI(u) || REDIRECCIONES_ACEPTADAS.has(u))) return { estado: "funciona", codigo: `${r.codigo}${REDIRECCIONES_ACEPTADAS.has(u) ? `; aceptada por ${REDIRECCIONES_ACEPTADAS.get(u)}` : "; DOI"}` };
  if (r.estado !== "funciona" && REVISADOS_A_MANO.has(u)) return { estado: "bloquea", codigo: `${r.codigo}; abierto en el navegador por ${REVISADOS_A_MANO.get(u)}` };
  // Una conexión cortada puede ser pasajera: se reintenta dos veces
  if (r.estado === "roto" && /ECONNRESET|ETIMEDOUT|TimeoutError|ECONNREFUSED/.test(String(r.codigo)) && intento < 3) { await new Promise(x => setTimeout(x, 3000)); return probar(u, intento + 1); }
  return r;
}
/* Identidad de una página, para saber si una redirección lleva a la misma o a otra. Se ignoran el idioma o la región
   en la dirección (es-419, es-es, en-us...), la barra final, mayúsculas y el nombre descriptivo que sigue al número de
   un artículo (8555545-file-uploads-faq y 8555545-uploading-files son el mismo artículo). */
function identidad(u) {
  try {
    const x = new URL(u);
    let p = x.pathname.toLowerCase().replace(/\/(?:[a-z]{2}(?:-[a-z0-9]{2,3})?)(?=\/|$)/g, "").replace(/\/+$/, "");
    p = p.replace(/\/(\d{4,})-[^/]*/g, "/$1");
    return x.host.replace(/^www\./, "") + p;
  } catch { return u; }
}
async function probarUna(u) {
  for (const metodo of ["HEAD", "GET"]) {
    try {
      const r = await fetch(u, { method: metodo, redirect: "follow", headers: { "user-agent": UA, "accept-language": "es-AR,es;q=0.9,en;q=0.8" }, signal: AbortSignal.timeout(20000) });
      if (r.ok) return r.redirected && identidad(r.url) !== identidad(u) ? { estado: "redirige", codigo: `${r.status}, lleva a ${r.url}` } : { estado: "funciona", codigo: r.status };
      if (metodo === "HEAD" && [403, 405, 400, 404, 501].includes(r.status)) continue;  // algunos sitios no aceptan HEAD
      if ([401, 403, 429, 999, 402].includes(r.status)) return { estado: "bloquea", codigo: r.status };
      return { estado: "roto", codigo: r.status };
    } catch (e) {
      // Certificado sin la cadena completa: los navegadores la completan solos y Node no. El sitio existe; se revisa a mano (D-073)
      const cod = e.cause?.code || e.name;
      if (metodo === "GET") return { estado: ["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY"].includes(cod) ? "bloquea" : "roto", codigo: cod };
    }
  }
}
const urls = [...donde.keys()], res = new Map();
for (let i = 0; i < urls.length; i += 6) await Promise.all(urls.slice(i, i + 6).map(async u => res.set(u, await probar(u))));
const grupo = e => urls.filter(u => res.get(u).estado === e);
const linea = u => `- ${u} (${res.get(u).codigo}). En: ${[...donde.get(u)].join(", ")}`;
await mkdir(join(RAIZ, "verificacion"), { recursive: true });
await writeFile(join(RAIZ, "verificacion", "enlaces.md"), `# Enlaces externos | Taller - IA\n\nRevisados el ${new Date().toLocaleString("es-AR")} con \`node scripts/verificar-enlaces.mjs\`: ${urls.length} enlaces.\n\n## Rotos (${grupo("roto").length})\n\n${grupo("roto").map(linea).join("\n") || "Ninguno."}\n\n## Redirigen a otra página (${grupo("redirige").length})\n\nEl enlace funciona, pero lleva a otra página. Puede que la original se haya reemplazado: revisá si conviene actualizar la URL.\n\n${grupo("redirige").map(linea).join("\n") || "Ninguno."}\n\n## Bloquean la lectura automática (${grupo("bloquea").length})\n\nEl sitio responde, pero rechaza a los programas. Se revisan abriéndolos en el navegador.\n\n${grupo("bloquea").map(linea).join("\n") || "Ninguno."}\n\n## Funcionan (${grupo("funciona").length})\n\n${grupo("funciona").map(linea).join("\n")}\n`, "utf8");
console.log(`${urls.length} enlaces: ${grupo("funciona").length} funcionan, ${grupo("redirige").length} redirigen a otra página, ${grupo("bloquea").length} bloquean la lectura automática, ${grupo("roto").length} rotos.`);
grupo("roto").forEach(u => console.log("ROTO", linea(u)));
grupo("redirige").forEach(u => console.log("REDIRIGE", u, res.get(u).codigo));
grupo("bloquea").forEach(u => console.log("BLOQUEA", u, res.get(u).codigo));
process.exitCode = grupo("roto").length ? 1 : 0;
