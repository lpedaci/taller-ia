/* Taller - IA | Arma el informe de verificación a partir de los resultados (workflow de verificación)
   Uso: node scripts/armar-informe.mjs leer < cuerpo-del-issue.md      (extrae las fechas de verificación del último Issue)
        node scripts/armar-informe.mjs armar --modo periodico          (arma el Issue de la corrida periódica)
        node scripts/armar-informe.mjs armar --modo pr --pr 12         (arma el comentario del pull request)

   El informe lo arma este script, no el modelo. El modelo solo devuelve JSON (revision-ia/prompt-*.md);
   el formato, el orden y el registro de fechas son reglas fijas, y las reglas fijas van en código.
   Así el informe tiene siempre la misma forma y se puede probar sin gastar uso del plan.

   Lee de verificacion/ (todos opcionales, salvo vencimientos.json en modo periódico):
   - vencimientos.json        (scripts/vencimientos.mjs)
   - resultado-fuentes.json   (paso con IA, prompt-fuentes.md)
   - resultado-parafrasis.json(paso con IA, prompt-parafrasis.md)
   - enlaces.md, textos.md    (npm run enlaces, npm run textos)
   - verificaciones-previas.json (salida de "leer")
   Escribe: verificacion/informe.md, verificacion/titulo.txt y, si no hay nada que informar, verificacion/sin-novedades. */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const V = join(RAIZ, "verificacion");
const MARCA = /<!-- verificaciones: (\{[\s\S]*?\}) -->/;
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const leerJSON = async f => existsSync(join(V, f)) ? JSON.parse(await readFile(join(V, f), "utf8")) : null;
const leerTexto = async f => existsSync(join(V, f)) ? readFile(join(V, f), "utf8") : null;
const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
// Texto de una celda de tabla: sin saltos de línea ni barras que rompan la tabla
const celda = t => String(t ?? "").replace(/\s+/g, " ").replace(/\|/g, "\\|").trim() || "(sin dato)";
const cita = t => t ? `"${celda(t)}"` : "(sin evidencia)";
const sinPunto = t => celda(t).replace(/[.]+$/, "");
const PROBLEMA = { general: "Demasiado general", "no-respalda": "No respalda el dato", "no-oficial": "No es oficial", "hay-version-en-espanol": "Existe la versión oficial en español", vieja: "Quedó vieja", "otro-producto": "Habla de otro producto o plan", cambio: "El dato cambió", "no-verificable": "No se pudo verificar" };
const problema = c => PROBLEMA[c] || celda(c);
const bloque = (...partes) => partes.filter(Boolean).join("\n\n");

/* ---------- leer: fechas de verificación guardadas en el último Issue ---------- */
if (process.argv[2] === "leer") {
  let cuerpo = ""; for await (const c of process.stdin) cuerpo += c;
  const m = cuerpo.match(MARCA);
  await mkdir(V, { recursive: true });
  await writeFile(join(V, "verificaciones-previas.json"), m ? m[1] : "{}", "utf8");
  console.log(m ? `Fechas de verificación leídas: ${Object.keys(JSON.parse(m[1])).length} datos.` : "El último Issue no tiene fechas de verificación (o no hay Issue anterior).");
  process.exit(0);
}

/* ---------- armar ---------- */
const modo = arg("--modo") || "periodico";
const venc = await leerJSON("vencimientos.json");
const leerSeguro = async f => { try { return await leerJSON(f); } catch { return null; } };
const fuentes = (await leerSeguro("resultado-fuentes.json"))?.resultados || [];
const parafrasis = await leerSeguro("resultado-parafrasis.json") || [];
const previas = await leerJSON("verificaciones-previas.json") || {};
const enlaces = await leerTexto("enlaces.md");
const textos = await leerTexto("textos.md");

const porId = Object.fromEntries((venc?.revisar || []).map(d => [d.id, d]));

// Control: si había datos para revisar y el paso con IA no devolvió un resultado válido para cada uno, la corrida
// NO es "sin novedades": es una falla. Se informa qué quedó sin revisar y el workflow termina en rojo.
const archivoIA = modo === "periodico" ? "resultado-fuentes.json" : "resultado-parafrasis.json";
let fallaIA = null;
if (modo === "periodico" && (venc?.revisar || []).length) {
  let r = null; try { r = await leerJSON(archivoIA); } catch { r = "invalido"; }
  const ids = new Set((r?.resultados || []).map(x => x.id));
  const faltan = venc.revisar.filter(d => !ids.has(d.id));
  if (r === null) fallaIA = { motivo: "el paso con IA no escribió su resultado", faltan };
  else if (r === "invalido") fallaIA = { motivo: "el resultado del paso con IA no es un JSON válido", faltan };
  else if (faltan.length) fallaIA = { motivo: `el paso con IA revisó ${venc.revisar.length - faltan.length} de ${venc.revisar.length} datos`, faltan };
}
if (modo === "pr" && process.env.HUBO_CAMBIOS_PILOTO === "1") {
  try { if (!(await leerJSON(archivoIA))) fallaIA = { motivo: "el paso con IA no escribió su resultado", faltan: [] }; }
  catch { fallaIA = { motivo: "el resultado del paso con IA no es un JSON válido", faltan: [] }; }
}
const grupo = v => fuentes.filter(r => r.veredicto === v);
const cambios = grupo("cambio"), noVerif = grupo("no-verificable");
// Un dato "a verificar" que la IA pudo confirmar no "sigue vigente": nunca tuvo texto. Es una decisión distinta:
// aceptar o no la redacción propuesta para completarlo.
const confirmables = grupo("vigente").filter(r => porId[r.id]?.estado === "a-verificar");
const vigentes = grupo("vigente").filter(r => !confirmables.includes(r));
const propuestas = fuentes.filter(r => (r.fuentes_propuestas || []).length);
const sinReemplazo = fuentes.filter(r => (r.veredicto !== "vigente" || r.fuente_acorde === false) && !(r.fuentes_propuestas || []).length);

// Hallazgos de paráfrasis, aplanados y clasificados por gravedad
const hallazgosP = (Array.isArray(parafrasis) ? parafrasis : [parafrasis]).flatMap(f => (f.hallazgos || []).map(h => ({ ...h, fragmento: f.fragmento, fuente: f.fuente })));
const propuestasP = (Array.isArray(parafrasis) ? parafrasis : [parafrasis]).filter(f => (f.fuentes_propuestas || []).length);

// Chequeos automáticos, leídos de los informes que ya generan los scripts del taller
const n = (t, re) => Number(t?.match(re)?.[1] ?? 0);
const rotos = n(enlaces, /## Rotos \((\d+)\)/), bloquean = n(enlaces, /## Bloquean la lectura automática \((\d+)\)/), funcionan = n(enlaces, /## Funcionan \((\d+)\)/);
const hallazgosTextos = (textos?.match(/^- \*\*/gm) || []).length;

const s = [];
const tablaDatos = lista => `| Dato | Qué dice el taller | Qué dice la fuente | Sugerencia |\n|---|---|---|---|\n` +
  lista.map(r => `| ${celda(r.que)} | ${cita(porId[r.id]?.afirma)} | ${cita(r.evidencia)}${r.url_leida ? ` ([fuente](${r.url_leida}))` : ""} | ${celda(r.sugerencia || "Revisar el dato")} |`).join("\n");
const tablaParafrasis = lista => `| Fragmento | Criterio | Qué dice el taller | Qué dice la fuente | Sugerencia |\n|---|---|---|---|---|\n` +
  lista.map(h => `| \`${celda(h.fragmento)}\` | ${h.criterio} (puntaje ${h.puntaje}) | ${cita(h.evidencia_taller)} | ${cita(h.evidencia_fuente)} | ${celda(h.sugerencia)} |`).join("\n");

if (modo === "periodico") {
  s.push(`Corrida del ${hoy} sobre los Módulos 10 y 11. Revisados: ${fuentes.length} de ${venc?.total ?? "?"} datos (los vencidos, los "a verificar" y los que no tienen una fuente específica). Disparador: ${process.env.DISPARADOR || "manual"}.`);
} else {
  s.push(`Revisión automática del pull request #${arg("--pr") || "?"}, del ${hoy}. Fragmentos revisados: ${(Array.isArray(parafrasis) ? parafrasis : [parafrasis]).length}.`);
}

if (fallaIA) s.push(`## ⚠️ La revisión con IA no se completó\n\nMotivo: ${fallaIA.motivo}. Esta corrida no sirve como verificación: los datos que siguen no se revisaron y vuelven a aparecer en la próxima.${fallaIA.faltan.length ? `\n\n${fallaIA.faltan.map(d => `- ${celda(d.que)} (${celda(d.motivo)})`).join("\n")}` : ""}${process.env.URL_CORRIDA ? `\n\nDetalle del error: [corrida en GitHub Actions](${process.env.URL_CORRIDA}).` : ""}`);

// Para decidir: errores, desactualizados y mejoras
const errores = [...cambios.filter(r => r.estado_sugerido !== porId[r.id]?.estado)], errP = hallazgosP.filter(h => h.gravedad === "error");
const desact = cambios.filter(r => !errores.includes(r)), desP = hallazgosP.filter(h => h.gravedad === "desactualizado");
const mejP = hallazgosP.filter(h => h.gravedad === "mejora"), mejF = vigentes.filter(r => r.fuente_acorde === false);
s.push(`## Para decidir`);
s.push(bloque(`### Errores (${errores.length + errP.length})\nEl taller afirma algo que la fuente contradice. Conviene corregir antes de la próxima clase.`, errores.length && tablaDatos(errores), errP.length && tablaParafrasis(errP), !errores.length && !errP.length && "Ninguno."));
s.push(bloque(`### Desactualizados (${desact.length + desP.length})\nEl dato era cierto, pero la fuente cambió.`, desact.length && tablaDatos(desact), desP.length && tablaParafrasis(desP), !desact.length && !desP.length && "Ninguno."));
s.push(bloque(`### Mejoras (${mejP.length + mejF.length})\nNo hay error. Hay una forma mejor de decirlo o de citarlo.`, mejF.length && mejF.map(r => `- **${celda(r.que)}**: el dato sigue vigente, pero la fuente no es acorde (${problema(r.problema_fuente).toLowerCase()}). Ver "Fuentes propuestas".`).join("\n"), mejP.length && tablaParafrasis(mejP), !mejP.length && !mejF.length && "Ninguna."));

if (confirmables.length) s.push(`### Se puede confirmar (${confirmables.length})\nDatos marcados "a verificar" que la fuente permite completar. Decidí si aceptás la redacción propuesta.\n\n| Dato | Estado propuesto | Redacción propuesta | Qué dice la fuente |\n|---|---|---|---|\n${confirmables.map(r => `| ${celda(r.que)} | ${r.estado_sugerido === "no" ? "No la tiene" : "La tiene"} | ${celda(r.sugerencia || "(sin redacción propuesta)")} | ${cita(r.evidencia)}${r.url_leida ? ` ([fuente](${r.url_leida}))` : ""} |`).join("\n")}`);

// Fuentes propuestas
const todas = [...propuestas.map(r => ({ que: r.que, problema: r.problema_fuente || r.veredicto, lista: r.fuentes_propuestas })), ...propuestasP.map(f => ({ que: f.fragmento, problema: "no sostiene el fragmento", lista: f.fuentes_propuestas }))];
const confirmadas = todas.flatMap(p => p.lista.filter(x => !x.a_confirmar).map(x => ({ ...x, que: p.que, problema: p.problema })));
const aConfirmar = todas.flatMap(p => p.lista.filter(x => x.a_confirmar).map(x => ({ ...x, que: p.que })));
s.push(`## Fuentes propuestas (${confirmadas.length})\n\nCada propuesta se leyó en esta corrida y trae la frase que respalda el dato.\n\n` +
  (confirmadas.length ? `| Dato | Problema de la fuente actual | Fuente propuesta | Qué dice | Por qué |\n|---|---|---|---|---|\n` +
    confirmadas.map(x => `| ${celda(x.que)} | ${problema(x.problema)} | [${x.idioma === "en" ? "En inglés" : "En español"}](${x.url}) | ${cita(x.evidencia)} | ${celda(x.por_que)} |`).join("\n") +
    `\n\n<details><summary>Referencias en APA 7, listas para copiar a fuentes.json</summary>\n\n${confirmadas.map(x => `- ${x.apa}${String(x.apa).includes(x.url) ? "" : ` ${x.url}`}`).join("\n")}\n\n</details>` : "Ninguna.") +
  (sinReemplazo.length ? `\n\nSin reemplazo encontrado (${sinReemplazo.length}): ${sinReemplazo.map(r => `${celda(r.que)}. Motivo: ${sinPunto(r.motivo)}`).join("; ")}.` : ""));

// Revisar a mano
const aMano = [...noVerif.map(r => `- ${celda(r.que)}${porId[r.id]?.url ? ` ([abrir](${porId[r.id].url}))` : ""}. Motivo: ${celda(r.motivo)}`),
  ...aConfirmar.map(x => `- Fuente propuesta a confirmar para ${celda(x.que)}: ${x.apa} ([abrir](${x.url})). Motivo: ${celda(x.a_confirmar)}. Antes de usarla, confirmá que sea el documento completo y no un folleto.`)];
s.push(`## Revisar a mano (${aMano.length})\n\nEl sistema no pudo leer estas fuentes. No es un error del taller: hay que abrirlas en el navegador.\n\n${aMano.join("\n") || "Nada."}`);

// Sin cambios, plegado
if (vigentes.length) s.push(`## Sin cambios (${vigentes.length})\n\n<details><summary>${vigentes.length === 1 ? "Ver el dato que sigue vigente" : `Ver los ${vigentes.length} datos que siguen vigentes`}</summary>\n\n| Dato | Evidencia | Fuente |\n|---|---|---|\n${vigentes.map(r => `| ${celda(r.que)} | ${cita(r.evidencia)} | ${r.url_leida ? `[abrir](${r.url_leida})` : "(sin URL)"} |`).join("\n")}\n\n</details>`);

// Chequeos automáticos
const chequeos = [];
if (enlaces) chequeos.push(`- Enlaces: ${funcionan} funcionan, ${bloquean} bloquean la lectura automática, ${rotos} rotos.`);
if (textos) chequeos.push(`- Textos: ${hallazgosTextos} hallazgos.`);
if (process.env.ACCESIBILIDAD) chequeos.push(`- Accesibilidad y design system: ${process.env.ACCESIBILIDAD === "0" ? "sin problemas" : "hay problemas, ver el informe adjunto a la corrida"}.`);
if (chequeos.length) s.push(`## Chequeos automáticos\n\n${chequeos.join("\n")}${process.env.URL_CORRIDA ? `\n\nInformes completos: [corrida en GitHub Actions](${process.env.URL_CORRIDA}).` : ""}`);

// Registro de verificación: fechas previas + los vigentes de hoy (solo modo periódico)
const registro = { ...previas };
if (modo === "periodico") for (const r of vigentes) registro[r.id] = hoy;
s.push(`---\nLa IA propone; Lourdes Pedaci decide. Nada se cambia en el repo sin su revisión. Para resolver un hallazgo, se corrige en un commit que menciona este ${modo === "pr" ? "pull request" : "Issue"}.`);
if (modo === "periodico") s.push(`<!-- verificaciones: ${JSON.stringify(registro)} -->`);

const hayAlgo = !!fallaIA || confirmables.length || errores.length + errP.length + desact.length + desP.length + mejP.length + mejF.length + confirmadas.length + aMano.length + sinReemplazo.length + rotos + hallazgosTextos > 0 || (process.env.ACCESIBILIDAD && process.env.ACCESIBILIDAD !== "0");
await mkdir(V, { recursive: true });
await writeFile(join(V, "informe.md"), s.join("\n\n") + "\n", "utf8");
await writeFile(join(V, "titulo.txt"), `Verificación | Taller - IA | ${hoy}`, "utf8");
// Aun sin novedades, si hubo datos vigentes conviene abrir el Issue: es el registro de que se verificaron
if (!hayAlgo && !vigentes.length) await writeFile(join(V, "sin-novedades"), "", "utf8");
if (fallaIA) await writeFile(join(V, "falla-ia"), fallaIA.motivo, "utf8");
if (fallaIA) console.log(`ATENCIÓN: ${fallaIA.motivo}. Quedaron sin revisar: ${fallaIA.faltan.length}.`);
console.log(`Informe armado: ${errores.length + errP.length} errores, ${desact.length + desP.length} desactualizados, ${mejP.length + mejF.length} mejoras, ${confirmadas.length} fuentes propuestas, ${aMano.length} para revisar a mano, ${vigentes.length} vigentes, ${confirmables.length} para confirmar.${!hayAlgo && !vigentes.length ? " Sin novedades." : ""}`);
