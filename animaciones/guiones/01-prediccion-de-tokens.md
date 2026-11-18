# Animación piloto | Cómo un modelo de lenguaje predice el próximo token

## Ficha

| | |
|---|---|
| Módulo | 2, Cómo funciona un modelo de lenguaje |
| Objetivo de aprendizaje | Explicar con palabras propias que un modelo de lenguaje escribe prediciendo el próximo fragmento, de a uno por vez, y por qué eso explica que la respuesta varíe y que a veces invente. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 80 segundos, en 5 escenas |
| Formato | Animación en SVG dentro de la página, con los tokens de M3. Modo claro y oscuro. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Motion graphics sobrio: burbujas de chat, fragmentos de texto, barras. Sin robots ni cerebros. |
| Datos | Las personas y el mensaje son inventados. Las probabilidades son **valores ilustrativos**, no de un modelo real, y la pantalla lo dice. |

## La situación

Son las 23:40. Ana trabaja en una oficina y mañana tiene turno con el médico a primera hora. Necesita avisarle a su jefa, Laura, que va a llegar más tarde, y le pide ayuda a un asistente para escribir el mensaje. Seguimos ese pedido desde que Ana lo envía hasta que aparece la respuesta, y vemos dónde puede salir algo que nadie dijo.

## Escenas

### Escena 1 | Un mensaje a las 23:40 (14 s)

- **En pantalla:** la hora "23:40" y una burbuja de chat que se escribe sola: "Ayudame a avisarle a mi jefa que mañana llego más tarde. Tengo turno con el médico a las 8."
- **Qué se mueve:** el mensaje aparece letra por letra, como cuando alguien escribe. Se envía.
- **Narración:** Son casi las doce de la noche. Ana tiene turno con el médico mañana temprano y le pide a un asistente que la ayude a avisarle a su jefa. Mientras la respuesta aparece en la pantalla, ¿qué está pasando del otro lado?
- **Descripción para lectores de pantalla:** Una burbuja de chat a las 23:40 con el pedido de Ana: ayuda para avisarle a su jefa que mañana llega más tarde porque tiene turno con el médico a las 8.

### Escena 2 | El asistente lee en fragmentos (14 s)

- **En pantalla:** "El asistente no lee palabras: lee fragmentos, llamados tokens."
- **Qué se mueve:** el mensaje de Ana se separa en recuadros. "médico" se parte en dos ("méd" e "ico") para mostrar que un token puede ser un pedazo de palabra.
- **Narración:** Lo primero que hace es cortar el mensaje en fragmentos. A veces un fragmento es una palabra entera y a veces, un pedazo. Para el modelo, cada uno es un número.
- **Descripción:** El mensaje se divide en recuadros, uno por fragmento. La palabra "médico" queda partida en dos.

### Escena 3 | La respuesta empieza a escribirse (18 s)

- **En pantalla:** la respuesta empieza: "Hola, Laura. Mañana voy a llegar" y un espacio por completar. Al costado, "¿Qué sigue?" y la nota "Valores ilustrativos".
- **Qué se mueve:** crecen cinco barras con candidatos para el fragmento que sigue: "un" 38 %, "más" 27 %, "tarde" 21 %, "a" 8 %, otros 6 %.
- **Narración:** La respuesta se escribe de a un fragmento. En cada paso, el modelo estima qué es más probable que siga, según millones de textos parecidos que vio al entrenarse. No sabe qué le pasa a Ana: sabe cómo suelen seguir mensajes como este.
- **Descripción:** La respuesta dice "Hola, Laura. Mañana voy a llegar". Cinco barras muestran opciones para seguir; la más probable es "un", con 38 %.

### Escena 4 | Elige, suma y vuelve a empezar (16 s)

- **En pantalla:** "Elige un fragmento, lo suma y vuelve a calcular."
- **Qué se mueve:** "un" se resalta y pasa a la frase. Las barras se vacían y la respuesta sigue, fragmento a fragmento: "un poco más tarde porque tengo turno con el médico a las 8. Gracias."
- **Narración:** Elige una opción, la agrega y vuelve a calcular con todo lo que ya está escrito. Así, fragmento a fragmento, aparece un mensaje que suena natural y que Ana podría mandar.
- **Descripción:** La palabra "un" se suma a la respuesta, que se completa: "Hola, Laura. Mañana voy a llegar un poco más tarde porque tengo turno con el médico a las 8. Gracias."

### Escena 5 | Otra versión, y un detalle que nadie dijo (18 s)

- **En pantalla:** debajo de la primera respuesta aparecen dos versiones más, como si Ana hubiera pedido de nuevo:
  - "Laura, mañana llego cerca de las 10: tengo un turno médico."
  - "Laura, mañana llego tarde por el paro de colectivos."

  En la última, "por el paro de colectivos" queda marcado, con la nota "Nadie habló de un paro". Al final: "Probable no es lo mismo que verdadero."
- **Qué se mueve:** las versiones aparecen una debajo de la otra; después se marca el fragmento inventado.
- **Narración:** Si Ana vuelve a pedirlo, puede recibir otra versión, porque el modelo elige entre opciones probables. Y a veces completa con algo que suena creíble pero no es cierto, como un paro que nunca existió. Por eso, antes de enviar, se lee y se revisa.
- **Descripción:** Aparecen dos versiones más del mensaje. Una dice que Ana llega tarde por un paro de colectivos, algo que nadie mencionó, y queda marcada. Cierra el texto "Probable no es lo mismo que verdadero".

## Controles y accesibilidad

- Reproducir y pausar, escena anterior y siguiente, velocidad (0,75; 1 y 1,25) y una barra de progreso dividida en 5 escenas.
- No empieza sola y no se repite en bucle.
- Narración opcional con la voz del navegador, y transcripción completa debajo.
- La descripción de cada escena se anuncia al cambiar de escena (`aria-live="polite"`).
- Con "reducir movimiento", se muestran las 5 escenas fijas, con flechas para avanzar.
- Todo funciona con teclado.

## Diseño

- Contenedor 16:9 en una tarjeta con esquina grande.
- Mensaje de Ana en una burbuja `secondary-container`; respuesta del asistente en `app-color-card-item`; recuadros de tokens en `surface-container-highest`; barras en `--app-chart-1`; fragmento elegido en `primary`; fragmento inventado con el color y el ícono de atención (`app-color-warning`).
- Texto en pantalla con Roboto Flex. En mobile, el texto se achica y las barras ocupan todo el ancho.
- Movimiento con los springs de M3: fragmentos con `spring-fast-spatial`, barras con `spring-default-spatial`, cambios de color con `spring-fast-effects`.

## MP4 para facilitadores (después de aprobada la animación)

1. Grabar con Playwright a 1920 x 1080, en modo claro, a velocidad 1.
2. Convertir con ffmpeg a MP4 H.264.
3. Generar `prediccion-de-tokens.vtt` con la narración y sus tiempos.
4. Guardar en `assets/video/` y ofrecerlo en la guía para facilitadores.
