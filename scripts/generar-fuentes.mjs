/* Taller - IA | Arma content/fuentes.json (la Biblioteca) a partir de los bloques "profundizar" de cada módulo.
   Solo desarrollo. Uso: node scripts/generar-fuentes.mjs
   Conserva el "porque" (por qué leerlo) de las fuentes que ya estaban. Si aparece una fuente nueva, la agrega
   con "porque" vacío y lo avisa: hay que escribirlo a mano antes de publicar. */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const C = join(resolve(dirname(fileURLToPath(import.meta.url)), ".."), "content");
const leer = async f => JSON.parse(await readFile(join(C, f), "utf8"));
const mods = (await leer("modulos.json")).modulos;
const bloque = Object.fromEntries(mods.map(m => [m.id, m.bloque]));
let previo = {};
try { previo = Object.fromEntries((await leer("fuentes.json")).fuentes.map(f => [f.url || f.apa, f.porque])); } catch { /* primera vez */ }

const tipo = f => {
  const { tipo: t, apa } = f;
  if (["libro", "curso", "video"].includes(t)) return t;
  if (t === "articulo") return /arXiv|Advances/.test(apa) ? "paper" : "artículo";
  if (t === "documento" && /Ley 25\.326|Decreto 1558|Recomendación|OECD AI Principles|AI Act/.test(apa)) return "normativa";
  return "documentación";
};
const nivel = n => /^técnica/i.test(n || "") ? "Técnica" : /^profundizaci/i.test(n || "") ? "Profundización" : "Inicial";

const vistas = new Map();
for (const m of mods) {
  let d; try { d = await leer(`modulo-${String(m.id).padStart(2, "0")}.json`); } catch { continue; }
  for (const p of d.pasos) for (const b of p.bloques) {
    if (b.tipo !== "profundizar") continue;
    for (const f of b.fuentes) {
      const k = f.url || f.apa;
      if (!vistas.has(k)) vistas.set(k, { titulo: f.titulo, apa: f.apa, ...(f.url ? { url: f.url } : {}), idioma: f.idioma || "es", nivel: nivel(f.nivel), tipo: tipo(f), modulos: [], porque: previo[k] || "" });
      const e = vistas.get(k); if (!e.modulos.includes(m.id)) e.modulos.push(m.id);
    }
  }
}
const fuentes = [...vistas.values()].map(e => ({ ...e, bloques: [...new Set(e.modulos.map(i => bloque[i]))].sort((a, b) => a - b) }))
  .sort((a, b) => a.bloques[0] - b.bloques[0] || a.modulos[0] - b.modulos[0]);
await writeFile(join(C, "fuentes.json"), JSON.stringify({ actualizado: "noviembre de 2026", nota: "Se genera con scripts/generar-fuentes.mjs a partir de los bloques \"profundizar\" de cada módulo. El campo \"porque\" se escribe a mano.", fuentes }, null, 2) + "\n", "utf8");
const faltan = fuentes.filter(f => !f.porque);
console.log(`${fuentes.length} fuentes.` + (faltan.length ? ` Falta "porque" en: ${faltan.map(f => f.titulo).join("; ")}` : " Todas tienen \"porque\"."));
process.exitCode = faltan.length ? 1 : 0;
