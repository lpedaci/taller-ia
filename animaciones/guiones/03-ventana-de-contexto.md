# Animación | Lo que el modelo tiene a la vista

> Este guion se genera con `node scripts/generar-guiones.mjs` a partir de `content/animaciones/ventana-contexto.json`. Para cambiar un texto, se edita el JSON y se vuelve a generar.

## Ficha

| | |
|---|---|
| Módulo | 2, Cómo funciona un modelo de lenguaje |
| Objetivo de aprendizaje | Explicar que el modelo solo usa lo que está dentro de su ventana de contexto, que en conversaciones largas lo primero queda afuera, y qué hacer al respecto. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 52 segundos, en 4 escenas |
| Formato | Animación en SVG dentro de la lección, con los tokens de M3, en modo claro y oscuro. Lienzo horizontal desde 600 px de reproductor y vertical por debajo. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Diagrama animado sobrio: cajas con un ícono, flechas que se dibujan y un punto que recorre el camino. Sin robots ni cerebros. |
| Nota | La conversación es inventada y la ventana está achicada para que se vea: las reales son mucho más grandes, pero también se llenan. |

## Escenas

### Escena 1 | La conversación entra en la ventana (12 s)

- **En pantalla:** Todo lo que escribís y todo lo que responde va entrando en una ventana.
- **Qué se mueve:** Los primeros mensajes aparecen dentro de un marco.
- **Narración:** Ana empieza una conversación para armar un curso. Cada mensaje, suyo o del asistente, entra en lo que se llama la ventana de contexto: lo que el modelo tiene a la vista.
- **Descripción para lectores de pantalla:** Un marco con el título Ventana de contexto. Adentro aparecen los primeros mensajes entre Ana y el asistente.

### Escena 2 | En cada respuesta, lee todo lo que está adentro (12 s)

- **En pantalla:** Para cada respuesta, el modelo vuelve a leer todo lo que hay en la ventana.
- **Qué se mueve:** Los mensajes de adentro se resaltan y una flecha los lleva al modelo.
- **Narración:** El modelo no recuerda como una persona. Cada vez que responde, vuelve a leer todo lo que hay en la ventana, de principio a fin. Eso es lo que le permite seguir el hilo.
- **Descripción para lectores de pantalla:** Todos los mensajes del marco se resaltan y una flecha los lleva a una caja que dice El modelo.

### Escena 3 | Cuando se llena, lo primero queda afuera (15 s)

- **En pantalla:** Si la conversación es muy larga, lo más viejo sale de la ventana. El modelo ya no lo ve.
- **Qué se mueve:** Llegan más mensajes; los primeros suben y quedan fuera del marco, atenuados.
- **Narración:** La conversación sigue y la ventana se llena. Los mensajes más viejos quedan afuera, y con ellos el dato de que Ana trabaja en una aseguradora. Cuando ella pregunta para qué empresa era el curso, el modelo ya no lo tiene a la vista. Puede adivinar.
- **Descripción para lectores de pantalla:** Llegan más mensajes. Los primeros suben y quedan afuera del marco, en gris. Abajo aparece la pregunta de Ana: para qué empresa era el curso.

### Escena 4 | Empezar de nuevo, con lo importante (13 s)

- **En pantalla:** Una conversación nueva con un resumen de lo importante funciona mejor que una eterna.
- **Qué se mueve:** La ventana se vacía y entra un mensaje de resumen y la pregunta nueva.
- **Narración:** La solución es simple: cuando una conversación se alarga, pedile un resumen de lo importante y empezá una nueva con ese resumen. Así todo lo que importa vuelve a estar a la vista.
- **Descripción para lectores de pantalla:** El marco se vacía. Entra un mensaje con el resumen de lo importante y después la pregunta nueva.

## Accesibilidad

- Controles de reproducir, pausar, escena anterior y siguiente, velocidad y narración con la voz del navegador. No empieza sola ni se repite.
- Cada escena tiene su descripción, que se anuncia al cambiar, y la transcripción completa está debajo del reproductor.
- Con "reducir movimiento", las escenas se muestran fijas y completas.
