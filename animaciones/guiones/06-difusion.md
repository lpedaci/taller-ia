# Animación | Cómo un modelo de imagen dibuja a partir de ruido

> Este guion se genera con `node scripts/generar-guiones.mjs` a partir de `content/animaciones/difusion.json`. Para cambiar un texto, se edita el JSON y se vuelve a generar.

## Ficha

| | |
|---|---|
| Módulo | 15, IA para imagen |
| Objetivo de aprendizaje | Explicar en términos simples que muchos modelos de imagen parten de ruido y lo limpian paso a paso guiados por el pedido, y por qué cada vez sale distinta. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 51 segundos, en 4 escenas |
| Formato | Animación en SVG dentro de la lección, con los tokens de M3, en modo claro y oscuro. Lienzo horizontal desde 600 px de reproductor y vertical por debajo. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Diagrama animado sobrio: cajas con un ícono, flechas que se dibujan y un punto que recorre el camino. Sin robots ni cerebros. |
| Nota | Es una simplificación: la imagen es un dibujo de pocos píxeles y los pasos son ilustrativos. |

## Escenas

### Escena 1 | Empieza con ruido (11 s)

- **En pantalla:** El modelo no busca una imagen guardada. Empieza con ruido.
- **Qué se mueve:** Aparece una grilla de píxeles al azar, como la nieve de un televisor.
- **Narración:** Diego pide una imagen: una casa con el sol de la tarde. El modelo no busca una foto en un archivo. Arranca con algo parecido a la nieve de un televisor viejo: puro ruido.
- **Descripción para lectores de pantalla:** Una grilla de cuadraditos grises al azar, como ruido de televisor, con el pedido de Diego arriba.

### Escena 2 | Paso a paso, el ruido se limpia (15 s)

- **En pantalla:** En cada paso, quita un poco de ruido. Al final aparece la imagen.
- **Qué se mueve:** Los píxeles cambian de a poco y aparece una casa, el sol y el pasto. Un contador va del paso 1 al 30.
- **Narración:** En cada paso, el modelo quita un poco de ruido, en la dirección de lo que se pidió. Después de muchos pasos, aparece una casa, el sol y el pasto. Nadie la dibujó: se fue limpiando.
- **Descripción para lectores de pantalla:** Los cuadraditos cambian de a poco hasta formar una casa azul con techo naranja, un sol y pasto verde. Un contador marca el paso, de 1 a 30.

### Escena 3 | El pedido guía cada paso (12 s)

- **En pantalla:** El pedido decide hacia dónde limpia: por eso describir bien cambia la imagen.
- **Qué se mueve:** El pedido se resalta con una flecha hacia la imagen terminada.
- **Narración:** El pedido es lo que orienta cada paso de limpieza. Por eso un prompt visual bien descripto, con el estilo, la luz y el encuadre, cambia tanto el resultado.
- **Descripción para lectores de pantalla:** El pedido se resalta y una flecha lo une con la imagen terminada.

### Escena 4 | Otro ruido, otra imagen (13 s)

- **En pantalla:** Con otro ruido inicial, el mismo pedido da otra imagen.
- **Qué se mueve:** Aparecen dos imágenes pequeñas del mismo pedido, distintas entre sí.
- **Narración:** Si se repite el pedido, el ruido inicial es otro, y la imagen también: el sol en otro lugar, otra puerta. Por eso nunca sale dos veces igual, y por eso los detalles difíciles, como las manos o las letras, a veces fallan.
- **Descripción para lectores de pantalla:** Dos imágenes chicas del mismo pedido, una al lado de la otra, con el sol y la puerta en lugares distintos.

## Accesibilidad

- Controles de reproducir, pausar, escena anterior y siguiente, velocidad y narración con la voz del navegador. No empieza sola ni se repite.
- Cada escena tiene su descripción, que se anuncia al cambiar, y la transcripción completa está debajo del reproductor.
- Con "reducir movimiento", las escenas se muestran fijas y completas.
