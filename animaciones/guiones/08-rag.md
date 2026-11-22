# Animación | Responder buscando en tus documentos

> Este guion se genera con `node scripts/generar-guiones.mjs` a partir de `content/animaciones/rag.json`. Para cambiar un texto, se edita el JSON y se vuelve a generar.

## Ficha

| | |
|---|---|
| Módulo | 18, De la conversación a la automatización |
| Objetivo de aprendizaje | Explicar RAG en términos simples: antes de responder, el sistema busca en documentos y responde con lo que encontró, citando la fuente; y compararlo con responder sin buscar. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 47 segundos, en 4 escenas |
| Formato | Animación en SVG dentro de la lección, con los tokens de M3, en modo claro y oscuro. Lienzo horizontal desde 600 px de reproductor y vertical por debajo. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Diagrama animado sobrio: cajas con un ícono, flechas que se dibujan y un punto que recorre el camino. Sin robots ni cerebros. |
| Nota | El reglamento y la pregunta son inventados. |

## Escenas

### Escena 1 | Una pregunta sobre tu reglamento (10 s)

- **En pantalla:** Una pregunta cuya respuesta está en un documento de tu organización.
- **Qué se mueve:** Aparece la caja Tu pregunta.
- **Narración:** Joaquín quiere saber cuántos días de licencia por estudio le corresponden. La respuesta está en el reglamento interno de su empresa, que ningún modelo leyó en su entrenamiento.
- **Descripción para lectores de pantalla:** Una caja con la pregunta de Joaquín: cuántos días de licencia por estudio tiene.

### Escena 2 | Primero, busca (12 s)

- **En pantalla:** Antes de responder, el sistema busca en los documentos los fragmentos relevantes.
- **Qué se mueve:** Flechas llevan a Busca en tus documentos y a Encuentra dos fragmentos.
- **Narración:** Un asistente con RAG no responde de memoria. Primero busca en los documentos que le conectaron, y encuentra dos fragmentos del reglamento que hablan de licencias.
- **Descripción para lectores de pantalla:** Flechas de Tu pregunta a Busca en tus documentos y de ahí a Encuentra fragmentos: reglamento, página 4 y página 7.

### Escena 3 | Responde con lo que encontró (13 s)

- **En pantalla:** Responde usando esos fragmentos y te dice de dónde salió cada dato.
- **Qué se mueve:** Los fragmentos viajan al modelo y aparece Respuesta con fuentes, en verde.
- **Narración:** El modelo recibe la pregunta junto con esos fragmentos y responde con esa información, indicando la página. Joaquín puede abrir el reglamento y comprobarlo.
- **Descripción para lectores de pantalla:** Flechas llevan los fragmentos a El modelo y de ahí a una caja verde, Respuesta con fuentes: cita las páginas 4 y 7.

### Escena 4 | Sin buscar, adivina (12 s)

- **En pantalla:** Sin buscar, el modelo responde lo más probable. Puede sonar igual de seguro.
- **Qué se mueve:** Aparece una caja de alerta: Sin buscar, responde lo más probable.
- **Narración:** Sin RAG, el modelo respondería con lo más probable para cualquier empresa: diez días, quizás. Sonaría igual de seguro. La diferencia está en de dónde sale la respuesta.
- **Descripción para lectores de pantalla:** Una flecha va de Tu pregunta a una caja de alerta: Sin buscar, responde lo más probable.

## Accesibilidad

- Controles de reproducir, pausar, escena anterior y siguiente, velocidad y narración con la voz del navegador. No empieza sola ni se repite.
- Cada escena tiene su descripción, que se anuncia al cambiar, y la transcripción completa está debajo del reproductor.
- Con "reducir movimiento", las escenas se muestran fijas y completas.
