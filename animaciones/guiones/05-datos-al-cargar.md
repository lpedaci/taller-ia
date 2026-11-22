# Animación | Qué pasa con lo que le cargás a una IA

> Este guion se genera con `node scripts/generar-guiones.mjs` a partir de `content/animaciones/datos-carga.json`. Para cambiar un texto, se edita el JSON y se vuelve a generar.

## Ficha

| | |
|---|---|
| Módulo | 10, Datos personales y marco legal |
| Objetivo de aprendizaje | Mostrar el recorrido de lo que se carga en una herramienta de IA (servidores, almacenamiento, posible entrenamiento y revisión humana) y lo que la persona puede hacer antes. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 50 segundos, en 4 escenas |
| Formato | Animación en SVG dentro de la lección, con los tokens de M3, en modo claro y oscuro. Lienzo horizontal desde 600 px de reproductor y vertical por debajo. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Diagrama animado sobrio: cajas con un ícono, flechas que se dibujan y un punto que recorre el camino. Sin robots ni cerebros. |
| Nota | Es un esquema general: lo que pasa en cada herramienta depende del tipo de cuenta y de la configuración. |

## Escenas

### Escena 1 | Lo que escribís viaja (12 s)

- **En pantalla:** Lo que escribís o adjuntás sale de tu computadora.
- **Qué se mueve:** Aparece Vos y una flecha lleva un punto hasta Servidores de la empresa.
- **Narración:** Andrea pega un correo de trabajo en un asistente para pedir un resumen. En cuanto lo envía, el texto sale de su computadora y llega a los servidores de la empresa que ofrece la herramienta.
- **Descripción para lectores de pantalla:** Una caja Vos, una flecha y una caja Servidores de la empresa. Un punto viaja de una a otra.

### Escena 2 | Se guarda (11 s)

- **En pantalla:** Ahí se guarda un tiempo, aunque lo borres de tu pantalla.
- **Qué se mueve:** Aparece la caja Se guarda debajo de los servidores.
- **Narración:** Ahí, lo que envió se guarda durante un tiempo. Borrar la conversación de su pantalla no siempre lo borra de los servidores.
- **Descripción para lectores de pantalla:** Una flecha va de Servidores a una caja Se guarda, un tiempo.

### Escena 3 | Dos usos posibles (14 s)

- **En pantalla:** Según la herramienta y la cuenta, puede usarse para entrenar y lo puede leer una persona.
- **Qué se mueve:** Desde Se guarda salen dos flechas: Puede entrenar y Puede leerlo una persona, en color de alerta.
- **Narración:** Según la herramienta, el tipo de cuenta y la configuración, eso puede usarse para mejorar los modelos. Y por seguridad o control de calidad, alguna conversación la puede leer una persona de la empresa. En el correo de Andrea había nombres y un dato de salud de otras personas.
- **Descripción para lectores de pantalla:** Dos flechas salen de Se guarda hacia dos cajas de alerta: Puede entrenar, si no lo desactivás, y Puede leerlo una persona.

### Escena 4 | Lo que podés hacer antes (13 s)

- **En pantalla:** Antes de cargar: anonimizá, revisá la privacidad y usá la herramienta que autoriza tu organización.
- **Qué se mueve:** Aparece una caja verde Antes de cargar, con una flecha hacia Vos.
- **Narración:** La parte que sí depende de vos está al principio: quitar los datos que no hacen falta, revisar si tu cuenta permite desactivar el entrenamiento y usar la herramienta que autorizó tu organización. Lo que no cargás, no viaja.
- **Descripción para lectores de pantalla:** Una caja verde, Antes de cargar: anonimizar y revisar la privacidad, con una flecha que apunta a Vos.

## Accesibilidad

- Controles de reproducir, pausar, escena anterior y siguiente, velocidad y narración con la voz del navegador. No empieza sola ni se repite.
- Cada escena tiene su descripción, que se anuncia al cambiar, y la transcripción completa está debajo del reproductor.
- Con "reducir movimiento", las escenas se muestran fijas y completas.
