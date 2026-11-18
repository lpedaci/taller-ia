/* Taller - IA | Video con fachada
   - Antes del clic no se carga nada de YouTube: la portada es propia (tokens del sistema).
   - Al hacer clic se inserta youtube-nocookie (privacidad mejorada) con subtítulos en español si existen.
   - No es para mirar pasivamente: pregunta guía antes, resumen propio en español y preguntas después.
   - Sin conexión, la lección sigue con el resumen y un aviso. */
import { esc, qs } from "../util.js";
import { icono } from "../ui.js";
import { md } from "../lesson/markdown.js";
import { registrar, dibujar } from "../lesson/bloques.js";
import { datos } from "../state.js";
import { sinConexion, esperaConMensaje } from "../estados.js";

const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const minutos = s => Math.max(1, Math.round(s / 60));
const SUBS = { es: "Subtítulos en español", auto: "Subtítulos automáticos", no: "Sin subtítulos" };

registrar("video", {
  render: (b, ctx) => {
    const v = (datos.videos || []).find(x => x.id === b.ref);
    if (!v) return `<div class="status status-warning">${icono("warning")}<span><b>Video sin verificar</b>Este video todavía no está en el registro de videos verificados.</span></div>`;
    const dur = v.fin ? v.fin - (v.inicio || 0) : v.duracion;
    const ingles = v.idioma === "en";
    const despues = b.despues ? dibujar([{ ...b.despues, tipo: b.despues.tipo || "quiz" }], ctx) : null;
    if (despues) ctx._montajes = (ctx._montajes || []).concat(despues.montar);
    return `<figure class="video" data-video="${esc(v.id)}">` +
      (b.pregunta ? `<div class="video-guia">${icono("visibility")}<div><b>Mientras mirás</b>${md(b.pregunta)}</div></div>` : "") +
      `<div class="video-frame"><button class="video-play" type="button" aria-describedby="vd-${esc(v.id)}">` +
        `<span class="vp-ic">${icono("play_arrow", "fill")}</span><span class="vp-txt"><span class="vp-t">${esc(v.titulo)}</span>` +
        `<span class="vp-m">${esc(v.canal)} | ${mmss(dur)}${v.inicio ? ` (fragmento desde el minuto ${mmss(v.inicio)})` : ""}</span></span>` +
        `<span class="sr-only">Reproducir el video</span></button></div>` +
      `<figcaption id="vd-${esc(v.id)}"><div class="video-tags">${ingles ? '<span class="lang-tag">En inglés</span>' : ""}<span class="chip chip-neutral">${icono("closed_caption")}${SUBS[v.subtitulos] || SUBS.no}</span><span class="chip chip-neutral">${icono("schedule")}${minutos(dur)} min</span></div>` +
        `<p class="video-orig">Título original: <span lang="${esc(v.idioma)}">${esc(v.tituloOriginal || v.titulo)}</span></p>` +
        `<p class="video-ref">${md(v.apa).replace(/^<p>|<\/p>$/g, "")}</p></figcaption>` +
      (b.resumen?.length ? `<section class="video-resumen" aria-labelledby="vr-${esc(v.id)}"><h4 id="vr-${esc(v.id)}">${icono("summarize", "sm")}Resumen en español</h4><ul>${b.resumen.map(r => `<li>${esc(r)}</li>`).join("")}</ul></section>` : "") +
      (despues ? `<div class="video-despues">${despues.html}</div>` : "") +
      `</figure>`;
  },
  montar(el, b, ctx) {
    (ctx._montajes || []).splice(0).forEach(f => f());
    const v = (datos.videos || []).find(x => x.id === b.ref); if (!v) return;
    const frame = qs(".video-frame", el), portada = frame.innerHTML;
    el.addEventListener("click", e => {
      if (!e.target.closest(".video-play")) return;
      if (sinConexion()) {
        frame.innerHTML = `<div class="video-estado" role="status">${icono("cloud_off")}<p><b>Este video necesita conexión.</b> Podés seguir con la lección y verlo después: abajo tenés el resumen en español.</p>` +
          `<button class="btn btn-tonal" type="button" data-vreintentar>${icono("refresh")}Reintentar</button></div>`;
        qs("[data-vreintentar]", frame).addEventListener("click", () => { frame.innerHTML = portada; qs(".video-play", frame).click(); });
        return;
      }
      const params = new URLSearchParams({ autoplay: "1", rel: "0", hl: "es", cc_lang_pref: "es", cc_load_policy: v.subtitulos === "es" ? "1" : "0" });
      if (v.inicio) params.set("start", v.inicio);
      if (v.fin) params.set("end", v.fin);
      frame.setAttribute("aria-busy", "true");
      frame.innerHTML = `<div class="video-carga"></div><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.videoId)}?${params}" title="Video: ${esc(v.titulo)} (${esc(v.canal)})" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      const carga = qs(".video-carga", frame);
      const cancelar = esperaConMensaje(carga, {
        texto: `Cargando el video de ${esc(v.canal)} (${v.idioma === "en" ? "en inglés, " : ""}${minutos(v.fin ? v.fin - (v.inicio || 0) : v.duracion)} min).`,
        despues: "Ya casi está. Si tu conexión es lenta, puede tardar un poco más.",
        salida: `<div class="act-actions"><a class="btn btn-outlined" href="${esc(v.url)}" target="_blank" rel="noopener">${icono("open_in_new")}Abrir en YouTube</a></div>`
      });
      qs("iframe", frame).addEventListener("load", () => { cancelar(); carga.remove(); frame.setAttribute("aria-busy", "false"); qs("iframe", frame).focus(); }, { once: true });
    });
  }
});
