# Animación | Un flujo automatizado con revisión humana

> Este guion se genera con `node scripts/generar-guiones.mjs` a partir de `content/animaciones/flujo-revision.json`. Para cambiar un texto, se edita el JSON y se vuelve a generar.

## Ficha

| | |
|---|---|
| Módulo | 18, De la conversación a la automatización |
| Objetivo de aprendizaje | Mostrar el recorrido de un flujo automatizado (disparador, acciones, paso con IA) con un paso de revisión humana que detiene lo que está mal. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 49 segundos, en 4 escenas |
| Formato | Animación en SVG dentro de la lección, con los tokens de M3, en modo claro y oscuro. Lienzo horizontal desde 600 px de reproductor y vertical por debajo. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Diagrama animado sobrio: cajas con un ícono, flechas que se dibujan y un punto que recorre el camino. Sin robots ni cerebros. |
| Nota | El caso es inventado. |

## Escenas

### Escena 1 | Algo pone en marcha el flujo (11 s)

- **En pantalla:** Disparador: llega una inscripción. Los datos pasan solos a la planilla.
- **Qué se mueve:** Aparecen el disparador y la acción, y un punto viaja entre ellos.
- **Narración:** Sergio armó un flujo para su curso. Cada vez que alguien completa el formulario de inscripción, el flujo arranca solo y pasa los datos a la planilla.
- **Descripción para lectores de pantalla:** Una caja Llega una inscripción, con un rayo, y una flecha a Se carga en la planilla. Un punto viaja de una a otra.

### Escena 2 | La IA hace su parte (11 s)

- **En pantalla:** Paso con IA: redacta el correo de bienvenida.
- **Qué se mueve:** Aparece la caja La IA redacta, en color de IA.
- **Narración:** Después, la IA redacta un correo de bienvenida personalizado, con la fecha y el enlace del curso.
- **Descripción para lectores de pantalla:** Una flecha va de la planilla a La IA redacta la bienvenida.

### Escena 3 | Una persona revisa (13 s)

- **En pantalla:** Revisión humana: el correo no sale hasta que alguien lo aprueba.
- **Qué se mueve:** Aparecen Revisás vos, en verde, y Se envía.
- **Narración:** Antes de que el correo salga, Sergio lo mira. Le lleva unos segundos, y le da la tranquilidad de que lo que llega a cada persona es correcto. Si está bien, se envía.
- **Descripción para lectores de pantalla:** Una flecha va a una caja verde, Revisás vos, y de ahí a Se envía.

### Escena 4 | Si algo está mal, vuelve (14 s)

- **En pantalla:** Si algo está mal, se corrige antes de salir. Un error en un flujo se repite muchas veces.
- **Qué se mueve:** Aparece Corregís, en alerta, con una flecha curva que vuelve a la IA.
- **Narración:** Un día, la IA puso una fecha equivocada. Como hay revisión, Sergio lo vio, corrigió y el correo salió bien. Sin ese paso, el error le habría llegado a cuarenta personas.
- **Descripción para lectores de pantalla:** Una flecha va de Revisás vos a una caja de alerta, Corregís, y otra, curva, vuelve a La IA redacta.

## Accesibilidad

- Controles de reproducir, pausar, escena anterior y siguiente, velocidad y narración con la voz del navegador. No empieza sola ni se repite.
- Cada escena tiene su descripción, que se anuncia al cambiar, y la transcripción completa está debajo del reproductor.
- Con "reducir movimiento", las escenas se muestran fijas y completas.
