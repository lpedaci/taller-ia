/* Taller - IA | Graba una animación como MP4 (1920 x 1080, modo claro) y genera sus subtítulos .vtt
   Solo para desarrollo. Uso: node scripts/grabar-animacion.mjs prediccion-tokens
   Requiere ffmpeg instalado. El resultado va a assets/video/<id>.mp4 y assets/video/<id>.vtt */
import { chromium } from "playwright";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { crearServidor } from "./servidor.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2] || "prediccion-tokens";
const FPS = 25;
const anim = JSON.parse(await readFile(join(RAIZ, "content", "animaciones", id + ".json"), "utf8"));
const cuadros = join(tmpdir(), "taller-ia-anim-" + id);
await rm(cuadros, { recursive: true, force: true }); await mkdir(cuadros, { recursive: true });
await mkdir(join(RAIZ, "assets", "video"), { recursive: true });

// Página mínima que monta solo el reproductor, a pantalla completa
const html = `<!DOCTYPE html><html lang="es" data-theme="light" data-contrast="standard"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,300..750&display=block">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..600,0..1,0&display=block">
<link rel="stylesheet" href="css/tokens.css"><link rel="stylesheet" href="css/components.css"><link rel="stylesheet" href="css/charts.css"><link rel="stylesheet" href="css/animacion.css">
<style>body{margin:0;background:var(--app-color-card-item)}.anim{border:0;padding:0;border-radius:0;width:1920px}.anim>:not(.anim-stage){display:none!important}.anim-stage{border-radius:0;width:1920px;height:1080px;aspect-ratio:auto}.anim-play-big{display:none!important}</style></head>
<body><div id="raiz"></div><script type="module">
import { leerJSON } from "./js/state.js";
import { montarAnimacion } from "./js/animacion.js";
const a = await leerJSON("content/animaciones/${id}.json"), m = await import("./js/animaciones/${id}.js");
document.getElementById("raiz").innerHTML = '<figure class="anim"><div class="anim-stage"><svg role="img"></svg><button class="anim-play-big" hidden></button></div><div class="anim-ctrl"><button class="anim-pp"></button><ol class="anim-seg">' + a.escenas.map(() => '<li><button data-an="ir"><span class="seg-fill"></span></button></li>').join("") + '</ol></div><p class="anim-desc"></p></figure>';
await document.fonts.ready;
montarAnimacion(document.querySelector(".anim"), a, m.escenas);
window.__listo = true;
</script></body></html>`;
await writeFile(join(RAIZ, "_grabar.html"), html);

const s = crearServidor(); await new Promise(r => s.listen(0, r));
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 }, colorScheme: "light" })).newPage();
try {
  await p.goto(`http://localhost:${s.address().port}/_grabar.html`, { waitUntil: "networkidle" });
  await p.waitForFunction(() => window.__listo === true);
  await p.waitForTimeout(800);
  let n = 0, t0 = 0;
  const vtt = ["WEBVTT", ""];
  const ts = sec => { const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, x = (sec % 60).toFixed(3).padStart(6, "0"); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${x}`; };
  for (let k = 0; k < anim.escenas.length; k++) {
    const e = anim.escenas[k], total = Math.round(e.duracion * FPS);
    // Subtítulos: la narración de la escena, partida en oraciones repartidas en su duración
    const frases = e.narracion.match(/[^.!?]+[.!?]+/g) || [e.narracion], largo = frases.reduce((a, f) => a + f.length, 0);
    let t = t0;
    frases.forEach((f, i) => { const d = e.duracion * f.length / largo; vtt.push(String(vtt.length), `${ts(t)} --> ${ts(t + d)}`, f.trim(), ""); t += d; });
    for (let f = 0; f <= total; f++) {
      await p.evaluate(([k, q]) => document.querySelector(".anim").__anim.irA(k, q), [k, f / total]);
      await p.screenshot({ path: join(cuadros, String(n++).padStart(5, "0") + ".png") });
    }
    t0 += e.duracion + 1 / FPS;
  }
  // Numeración correlativa de los bloques del .vtt
  const lineas = vtt.join("\n").split("\n"); let c = 0;
  const salidaVtt = lineas.map((l, i) => (/^\d+$/.test(l) && lineas[i + 1]?.includes("-->")) ? String(++c) : l).join("\n");
  await writeFile(join(RAIZ, "assets", "video", id + ".vtt"), salidaVtt);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(cuadros, "%05d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23", "-movflags", "+faststart", join(RAIZ, "assets", "video", id + ".mp4")]);
  console.log(`Listo: assets/video/${id}.mp4 (${n} cuadros a ${FPS} fps) y assets/video/${id}.vtt`);
} finally {
  await b.close(); s.close();
  await rm(join(RAIZ, "_grabar.html"), { force: true });
  await rm(cuadros, { recursive: true, force: true });
}
