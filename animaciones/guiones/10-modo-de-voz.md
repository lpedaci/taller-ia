# Animación | Qué pasa cuando le hablás a un asistente

> Este guion se genera con `node scripts/generar-guiones.mjs` a partir de `content/animaciones/modo-voz.json`. Para cambiar un texto, se edita el JSON y se vuelve a generar.

## Ficha

| | |
|---|---|
| Módulo | 12, Conversar con la IA por voz |
| Objetivo de aprendizaje | Explicar que el modo de voz encadena tres pasos (tu voz se vuelve texto, el modelo responde en texto y ese texto se vuelve voz) y que por eso valen los mismos cuidados que al escribir. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 48 segundos, en 4 escenas |
| Formato | Animación en SVG dentro de la lección, con los tokens de M3, en modo claro y oscuro. Lienzo horizontal desde 600 px de reproductor y vertical por debajo. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Diagrama animado sobrio: cajas con un ícono, flechas que se dibujan y un punto que recorre el camino. Sin robots ni cerebros. |
| Nota | La conversación es inventada. Algunos asistentes procesan la voz de forma más directa; el esquema muestra la idea general. |

## Escenas

### Escena 1 | Hablás (11 s)

- **En pantalla:** Todo empieza con tu voz: un sonido, no un texto.
- **Qué se mueve:** Aparece la caja "Hablás" y una onda de sonido que late.
- **Narración:** Martina está practicando inglés camino al trabajo. Toca el micrófono y pregunta en voz alta cómo decir una frase. Para el asistente, eso todavía no son palabras: es sonido.
- **Descripción para lectores de pantalla:** Una caja con un micrófono, "Hablás", y una onda de sonido animada con la pregunta de Martina.

### Escena 2 | Tu voz se vuelve texto (12 s)

- **En pantalla:** Primero, tu voz se transcribe. Si entendió mal una palabra, todo lo que sigue parte de ese error.
- **Qué se mueve:** Una flecha lleva a "Se transcribe" y debajo aparece el texto de la pregunta.
- **Narración:** El primer paso es pasar el sonido a texto. Con un acento fuerte, ruido o una palabra poco común, la transcripción puede fallar. Y si el texto está mal, el resto también.
- **Descripción para lectores de pantalla:** Una flecha va de "Hablás" a "Se transcribe". Aparece el texto de la pregunta transcripta.

### Escena 3 | El modelo responde en texto (12 s)

- **En pantalla:** El modelo trabaja con el texto, igual que en el chat. Puede equivocarse igual.
- **Qué se mueve:** El texto viaja hasta "El modelo" y de ahí sale "Texto de la respuesta".
- **Narración:** Con ese texto, el modelo arma una respuesta como en cualquier chat: prediciendo de a un fragmento. Por eso todo lo que aprendiste sobre verificar sigue valiendo, aunque después lo escuches.
- **Descripción para lectores de pantalla:** Flechas de "Se transcribe" a "El modelo" y de ahí a "Texto de la respuesta". Un punto recorre el camino.

### Escena 4 | Y el texto vuelve a ser voz (13 s)

- **En pantalla:** Una voz sintética lee la respuesta. Podés interrumpirla y la ronda empieza otra vez.
- **Qué se mueve:** Una flecha lleva a "Voz sintética"; una flecha curva vuelve a "Hablás" con la etiqueta "podés interrumpir".
- **Narración:** Por último, una voz sintética lee la respuesta. Suena natural y segura, aunque el contenido esté mal. Si Martina la interrumpe, la ronda empieza de nuevo desde su voz.
- **Descripción para lectores de pantalla:** Una flecha va de "Texto de la respuesta" a "Voz sintética" y otra, curva, vuelve a "Hablás" con la etiqueta "podés interrumpir".

## Accesibilidad

- Controles de reproducir, pausar, escena anterior y siguiente, velocidad y narración con la voz del navegador. No empieza sola ni se repite.
- Cada escena tiene su descripción, que se anuncia al cambiar, y la transcripción completa está debajo del reproductor.
- Con "reducir movimiento", las escenas se muestran fijas y completas.
