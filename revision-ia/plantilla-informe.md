# Plantilla del informe (Issue) | Taller - IA

Borrador (tarea 16 del plan). Cada corrida del sistema abre un Issue en `lpedaci/taller-ia` con este formato. El Issue cumple dos funciones:

1. **Es el informe** que leés y decidís.
2. **Es el registro de verificación.** Al final lleva un bloque oculto con la fecha en que se verificó cada dato. En la corrida siguiente, el workflow lee ese bloque del último Issue y se lo pasa a `vencimientos.mjs` con `--verificaciones`. Así la fecha de verificación queda guardada sin escribir nada a mano ni commitear nada.

**Qué datos entran al registro:** solo los de veredicto `vigente`. Un dato `cambio` o `no-verificable` no cuenta como verificado: sigue vencido hasta que lo resuelvas, y vuelve a aparecer en la próxima corrida.

**Etiqueta del Issue:** `verificacion`. El workflow busca el último Issue con esa etiqueta, abierto o cerrado.

---

## Título

```
Verificación | Taller - IA | AAAA-MM-DD
```

## Cuerpo

```markdown
Corrida del AAAA-MM-DD sobre los Módulos 10 y 11. Revisados: N datos (vencidos o "a verificar"). Disparador: periódico | pull request #N | manual.

## Para decidir

### Errores (N)
El taller afirma algo que la fuente contradice. Conviene corregir antes de la próxima clase.

| Dato | Qué dice el taller | Qué dice la fuente | Sugerencia |
|---|---|---|---|
| Copilot: Analizar datos | "..." | "..." ([fuente](URL)) | "..." |

### Desactualizados (N)
El dato era cierto, pero la fuente cambió.

(misma tabla)

### Mejoras (N)
No hay error. Hay una forma mejor de decirlo o de citarlo.

(misma tabla, con el criterio de la rúbrica)

## Fuentes propuestas (N)

Para los datos que quedaron desactualizados, que no se pudieron verificar o cuya fuente no es acorde. Cada propuesta se leyó en esta corrida y trae la frase que respalda el dato.

| Dato | Problema de la fuente actual | Fuente propuesta | Qué dice | Por qué |
|---|---|---|---|---|
| ChatGPT: Subir archivos | Demasiado general: portada de chatgpt.com | [Título de la página](URL) (en inglés) | "frase exacta" | Es la página de ayuda que describe la función |

<details><summary>Referencias en APA 7, listas para copiar a fuentes.json</summary>

- OpenAI. (s.f.). *Título de la página de ayuda*. OpenAI Help Center. URL

</details>

Sin reemplazo encontrado (N): Copilot: Analizar datos. Motivo: ninguna página oficial leída en esta corrida lo menciona.

## Revisión manual (N)

El sistema no pudo leer estas fuentes. No es un error del taller: hay que abrirlas en el navegador.

- México: Ley Federal de Protección de Datos Personales en Posesión de los Particulares ([abrir](URL)). Motivo: el sitio bloquea a los programas.
- Fuente propuesta de UNESDOC, a confirmar: *Título oficial en español* (código, año, páginas) ([abrir](https://unesdoc.unesco.org/ark:/48223/pf0000NNNNNN_spa)). Motivo: se encontró en el catálogo, pero el documento no se pudo leer en esta corrida. Antes de usarla, confirmá que sea el documento completo y no un folleto.

## Sin cambios (N)

<details><summary>Ver los N datos que siguen vigentes</summary>

| Dato | Evidencia | Fuente |
|---|---|---|
| ChatGPT: Subir archivos | "..." | [ayuda](URL) |

</details>

## Chequeos automáticos

- Enlaces: N funcionan, N bloquean la lectura automática, N rotos.
- Textos: N revisados, N hallazgos.
- Accesibilidad: N problemas.

---
La IA propone; Lourdes Pedaci decide. Nada se cambia en el repo sin su revisión. Para resolver un hallazgo, se corrige en un commit que menciona este Issue.

<!-- verificaciones: {"herramientas/chatgpt/archivos": "AAAA-MM-DD"} -->
```

## Por qué este orden

- **Lo que pide decisión va primero**, ordenado por gravedad. Lo que está bien queda plegado: cumple como evidencia de que se revisó, sin ocupar la vista.
- **Las fuentes propuestas van justo después de lo que hay que decidir**, porque son la forma de resolverlo: el problema y su reparación quedan juntos.
- **"Sin reemplazo encontrado" se dice explícitamente.** Así sabés que el sistema buscó y no encontró, en lugar de suponer que no buscó.
- **"Revisión manual" tiene su propia sección** para que un sitio bloqueado no se lea como una falla del taller.
- **Las columnas "Qué dice el taller" y "Qué dice la fuente" van lado a lado:** decidís comparando, sin abrir cinco pestañas.
