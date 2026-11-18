# Animación piloto | Cómo un modelo de lenguaje predice el próximo token

Estado: **guion para aprobar**. No se construye hasta que Lourdes lo apruebe.

## Ficha

| | |
|---|---|
| Módulo | 2, Cómo funciona un modelo de lenguaje |
| Objetivo de aprendizaje | Explicar con palabras propias que un modelo de lenguaje genera texto prediciendo el próximo fragmento, de a uno por vez, y por qué eso explica que varíe y que pueda equivocarse. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 75 segundos, en 5 escenas |
| Formato | Animación en SVG dentro de la página, con los tokens de M3. Modo claro y oscuro. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Motion graphics sobrio: chips de texto, barras, una línea de lectura. Sin robots, sin cerebros, sin personajes. |
| Datos | Las probabilidades son **valores ilustrativos**, no de un modelo real, y la pantalla lo dice. |

## Escenas

### Escena 1 | Una frase incompleta (12 s)

- **Texto en pantalla:** "El café de la mañana está muy ___"
- **Qué se mueve:** la frase aparece palabra por palabra; al final queda un espacio marcado, a completar.
- **Narración:** Cuando le escribís a un asistente, no busca una respuesta guardada. Lo que hace es completar el texto, de a un fragmento por vez.
- **Descripción para lectores de pantalla:** Aparece la frase "El café de la mañana está muy", con un espacio en blanco al final.

### Escena 2 | El texto se parte en tokens (14 s)

- **Texto en pantalla:** "El modelo lee el texto en fragmentos: los tokens."
- **Qué se mueve:** la frase se separa en chips, uno por token ("El", "café", "de", "la", "mañana", "está", "muy"). Un chip se divide en dos para mostrar que un token puede ser parte de una palabra.
- **Narración:** Primero, el texto se divide en tokens: palabras enteras o pedazos de palabras. Para el modelo, cada token es un número.
- **Descripción:** La frase se separa en siete fragmentos, cada uno en un recuadro. Uno de ellos se divide en dos partes.

### Escena 3 | Cada continuación tiene una probabilidad (16 s)

- **Texto en pantalla:** "¿Qué token sigue?" y la nota "Valores ilustrativos".
- **Qué se mueve:** crecen cinco barras horizontales con candidatos y su porcentaje: caliente 46 %, rico 22 %, amargo 14 %, fuerte 9 %, otros 9 %.
- **Narración:** Con lo que aprendió durante el entrenamiento, el modelo calcula qué tan probable es cada continuación. No sabe cuál es la verdadera: estima cuál es más probable.
- **Descripción:** Cinco barras muestran candidatos para la palabra siguiente. "Caliente" es la más probable, con 46 %; le siguen "rico", "amargo", "fuerte" y "otros".

### Escena 4 | Elige, suma y repite (16 s)

- **Texto en pantalla:** "Elige un token, lo suma al texto y vuelve a empezar."
- **Qué se mueve:** "caliente" se resalta y se desplaza al final de la frase. Las barras se vacían y vuelven a crecer con nuevos candidatos para el token siguiente ("y", ".", "para"). Una flecha circular marca el ciclo, una sola vez.
- **Narración:** Elige una opción, la agrega al texto y repite el proceso con el texto nuevo. Así, token por token, se escribe toda la respuesta.
- **Descripción:** La palabra "caliente" se suma a la frase. Aparecen nuevas barras para el token que sigue, y una flecha muestra que el proceso se repite.

### Escena 5 | Por qué varía y por qué se equivoca (17 s)

- **Texto en pantalla:** dos versiones de la frase, una debajo de la otra: "...está muy caliente" y "...está muy rico". Debajo: "Probable no es lo mismo que verdadero."
- **Qué se mueve:** se repite la elección, pero esta vez sale "rico" (menos probable). Las dos frases quedan juntas para comparar.
- **Narración:** Como el modelo elige entre opciones probables, la misma pregunta puede dar respuestas distintas. Y una respuesta puede sonar muy segura y estar mal: es probable, no verificada. Por eso siempre hay que revisar lo que produce.
- **Descripción:** Se muestran dos finales posibles para la misma frase: "caliente" y "rico". Debajo aparece el texto "Probable no es lo mismo que verdadero".

## Controles y accesibilidad

- Reproducir y pausar, escena anterior y siguiente, velocidad (0,75; 1 y 1,25) y una barra de progreso dividida en 5 escenas.
- La animación no empieza sola y no se repite en bucle.
- Transcripción completa debajo (la narración de cada escena), y botón "Escuchar" para oírla con la voz del navegador.
- Cada escena tiene su descripción en texto, que se anuncia al cambiar de escena (`aria-live="polite"`).
- Con "reducir movimiento", la animación se muestra como 5 escenas fijas con flechas para avanzar.
- Todo funciona con teclado.

## Diseño

- Contenedor 16:9 en una tarjeta, con esquina grande.
- Tokens de color: chips en `secondary-container`, barras en `--app-chart-1`, token elegido en `primary`, segunda opción (escena 5) en `--app-chart-2`.
- Tipografía Roboto Flex: el texto en pantalla en `headline-small` (desktop) o `title-large` (mobile).
- Movimiento con los springs de M3: aparición de chips con `spring-fast-spatial`, crecimiento de barras con `spring-default-spatial`, cambios de color con `spring-fast-effects`.
- En mobile, las barras ocupan todo el ancho y el texto en pantalla se achica; la frase pasa a dos líneas si hace falta.

## Para producir el MP4 (después de aprobada)

1. Grabar la animación con Playwright a 1920 x 1080, en modo claro, a velocidad 1.
2. Convertir con ffmpeg (ya está instalado) a MP4 H.264.
3. Generar `prediccion-de-tokens.vtt` con la narración de cada escena y sus tiempos.
4. Guardar en `assets/video/` y ofrecerlo en la guía para facilitadores.
