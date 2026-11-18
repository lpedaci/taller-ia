/* Servidor local mínimo para ver el taller en la computadora (solo desarrollo).
   Uso: npm run servir  (abre http://localhost:8080) */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(fileURLToPath(new URL("..", import.meta.url)));
const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".md": "text/markdown; charset=utf-8", ".mp4": "video/mp4", ".vtt": "text/vtt; charset=utf-8", ".woff2": "font/woff2" };

export function crearServidor() {
  return http.createServer(async (req, res) => {
    try {
      let ruta = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (ruta.endsWith("/")) ruta += "index.html";
      const archivo = normalize(join(RAIZ, ruta));
      if (!archivo.startsWith(RAIZ) || archivo.includes("node_modules")) { res.writeHead(403).end("Prohibido"); return; }
      const s = await stat(archivo);
      if (!s.isFile()) throw new Error("no es archivo");
      res.writeHead(200, { "Content-Type": TIPOS[extname(archivo).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
      res.end(await readFile(archivo));
    } catch (e) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("No encontrado");
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const puerto = Number(process.env.PORT) || 8080;
  crearServidor().listen(puerto, () => console.log(`Taller - IA en http://localhost:${puerto}  (Ctrl+C para cerrar)`));
}
