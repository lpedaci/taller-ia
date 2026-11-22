/* Taller - IA | Revisa los enlaces externos del contenido (solo desarrollo)
   Uso: npm run enlaces (algunos sitios mandan cabeceras muy grandes: el script se corre con --max-http-header-size)
   Junta las URL de content/*.json, js/ e index.html, pide cada una y clasifica el resultado:
   - funciona (2xx o redirección que termina bien);
   - bloquea la lectura automática (401, 403, 429 o 999): el sitio existe pero rechaza programas; se revisa a mano;
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
async function probar(u, intento = 1) {
  const r = await probarUna(u);
  // Una conexión cortada puede ser pasajera: se reintenta dos veces
  if (r.estado === "roto" && /ECONNRESET|ETIMEDOUT|TimeoutError|ECONNREFUSED/.test(String(r.codigo)) && intento < 3) { await new Promise(x => setTimeout(x, 3000)); return probar(u, intento + 1); }
  return r;
}
async function probarUna(u) {
  for (const metodo of ["HEAD", "GET"]) {
    try {
      const r = await fetch(u, { method: metodo, redirect: "follow", headers: { "user-agent": UA, "accept-language": "es-AR,es;q=0.9,en;q=0.8" }, signal: AbortSignal.timeout(20000) });
      if (r.ok) return { estado: "funciona", codigo: r.status };
      if (metodo === "HEAD" && [403, 405, 400, 404, 501].includes(r.status)) continue;  // algunos sitios no aceptan HEAD
      if ([401, 403, 429, 999, 402].includes(r.status)) return { estado: "bloquea", codigo: r.status };
      return { estado: "roto", codigo: r.status };
    } catch (e) { if (metodo === "GET") return { estado: "roto", codigo: e.cause?.code || e.name }; }
  }
}
const urls = [...donde.keys()], res = new Map();
for (let i = 0; i < urls.length; i += 6) await Promise.all(urls.slice(i, i + 6).map(async u => res.set(u, await probar(u))));
const grupo = e => urls.filter(u => res.get(u).estado === e);
const linea = u => `- ${u} (${res.get(u).codigo}). En: ${[...donde.get(u)].join(", ")}`;
await mkdir(join(RAIZ, "verificacion"), { recursive: true });
await writeFile(join(RAIZ, "verificacion", "enlaces.md"), `# Enlaces externos | Taller - IA\n\nRevisados el ${new Date().toLocaleString("es-AR")} con \`node scripts/verificar-enlaces.mjs\`: ${urls.length} enlaces.\n\n## Rotos (${grupo("roto").length})\n\n${grupo("roto").map(linea).join("\n") || "Ninguno."}\n\n## Bloquean la lectura automática (${grupo("bloquea").length})\n\nEl sitio responde, pero rechaza a los programas. Se revisan abriéndolos en el navegador.\n\n${grupo("bloquea").map(linea).join("\n") || "Ninguno."}\n\n## Funcionan (${grupo("funciona").length})\n\n${grupo("funciona").map(linea).join("\n")}\n`, "utf8");
console.log(`${urls.length} enlaces: ${grupo("funciona").length} funcionan, ${grupo("bloquea").length} bloquean la lectura automática, ${grupo("roto").length} rotos.`);
grupo("roto").forEach(u => console.log("ROTO", linea(u)));
grupo("bloquea").forEach(u => console.log("BLOQUEA", u, res.get(u).codigo));
process.exitCode = grupo("roto").length ? 1 : 0;
