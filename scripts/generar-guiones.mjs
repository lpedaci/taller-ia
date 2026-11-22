/* Taller - IA | Genera el guion (storyboard en Markdown) de cada animación a partir de su archivo de textos.
   Solo desarrollo. Uso: node scripts/generar-guiones.mjs
   Lee content/animaciones/*.json y escribe el archivo indicado en "guion". El guion de la animación piloto
   (prediccion-tokens) se escribió a mano y no se toca. Así el guion y lo que se ve nunca se contradicen. */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(RAIZ, "content", "animaciones");
const modulos = JSON.parse(await readFile(join(RAIZ, "content", "modulos.json"), "utf8")).modulos;
let n = 0;
for (const f of (await readdir(DIR)).filter(x => x.endsWith(".json"))) {
  const a = JSON.parse(await readFile(join(DIR, f), "utf8"));
  if (!a.guion || a.id === "prediccion-tokens") continue;
  const m = modulos.find(x => x.id === a.modulo);
  const total = a.escenas.reduce((s, e) => s + e.duracion, 0);
  const md = `# Animación | ${a.titulo}

> Este guion se genera con \`node scripts/generar-guiones.mjs\` a partir de \`content/animaciones/${a.id}.json\`. Para cambiar un texto, se edita el JSON y se vuelve a generar.

## Ficha

| | |
|---|---|
| Módulo | ${m ? `${m.id}, ${m.titulo}` : a.modulo} |
| Objetivo de aprendizaje | ${a.objetivo} |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de ${total} segundos, en ${a.escenas.length} escenas |
| Formato | Animación en SVG dentro de la lección, con los tokens de M3, en modo claro y oscuro. Lienzo horizontal desde 600 px de reproductor y vertical por debajo. Versión MP4 (1920 x 1080, modo claro) con subtítulos \`.vtt\` para facilitadores. |
| Estilo | Diagrama animado sobrio: cajas con un ícono, flechas que se dibujan y un punto que recorre el camino. Sin robots ni cerebros. |
| Nota | ${a.nota} |

## Escenas

${a.escenas.map((e, i) => `### Escena ${i + 1} | ${e.titulo} (${e.duracion} s)

- **En pantalla:** ${e.pantalla}
- **Qué se mueve:** ${e.movimiento}
- **Narración:** ${e.narracion}
- **Descripción para lectores de pantalla:** ${e.descripcion}`).join("\n\n")}

## Accesibilidad

- Controles de reproducir, pausar, escena anterior y siguiente, velocidad y narración con la voz del navegador. No empieza sola ni se repite.
- Cada escena tiene su descripción, que se anuncia al cambiar, y la transcripción completa está debajo del reproductor.
- Con "reducir movimiento", las escenas se muestran fijas y completas.
`;
  await writeFile(join(RAIZ, a.guion), md, "utf8"); n++;
}
console.log(`${n} guiones generados.`);
