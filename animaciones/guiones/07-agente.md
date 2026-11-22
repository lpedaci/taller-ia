# Animación | Cómo trabaja un agente

> Este guion se genera con `node scripts/generar-guiones.mjs` a partir de `content/animaciones/agente.json`. Para cambiar un texto, se edita el JSON y se vuelve a generar.

## Ficha

| | |
|---|---|
| Módulo | 18, De la conversación a la automatización |
| Objetivo de aprendizaje | Mostrar el ciclo de un agente (planificar, usar una herramienta, mirar el resultado y volver a planificar) y por qué termina con una revisión humana. |
| Público | Personas adultas sin formación técnica en IA |
| Duración | Alrededor de 52 segundos, en 4 escenas |
| Formato | Animación en SVG dentro de la lección, con los tokens de M3, en modo claro y oscuro. Lienzo horizontal desde 600 px de reproductor y vertical por debajo. Versión MP4 (1920 x 1080, modo claro) con subtítulos `.vtt` para facilitadores. |
| Estilo | Diagrama animado sobrio: cajas con un ícono, flechas que se dibujan y un punto que recorre el camino. Sin robots ni cerebros. |
| Nota | El caso es inventado. Los agentes reales varían, pero siguen este ciclo. |

## Escenas

### Escena 1 | Un objetivo y un plan (12 s)

- **En pantalla:** Le das un objetivo. El agente lo divide en pasos.
- **Qué se mueve:** Aparecen Objetivo y Planifica, unidos por una flecha.
- **Narración:** Laura le pide a un agente comparar tres plataformas para un curso virtual y armar un informe. El agente no responde de una: primero arma un plan con pasos.
- **Descripción para lectores de pantalla:** Una caja Objetivo y una flecha hacia Planifica, que divide la tarea en pasos.

### Escena 2 | Usa una herramienta (12 s)

- **En pantalla:** Para cada paso, usa una herramienta: buscar, leer un archivo, ejecutar algo.
- **Qué se mueve:** Aparece la caja Usa una herramienta y un punto viaja hasta ella.
- **Narración:** Para el primer paso, busca en la web las páginas de las plataformas. Un agente puede usar herramientas: buscar, abrir archivos, ejecutar comandos o mandar mensajes, según lo que le permitas.
- **Descripción para lectores de pantalla:** Una flecha va de Planifica a Usa una herramienta: buscar, leer, ejecutar.

### Escena 3 | Mira el resultado y vuelve a planificar (15 s)

- **En pantalla:** Mira qué obtuvo y decide el próximo paso. El ciclo se repite.
- **Qué se mueve:** Aparece Mira el resultado; una flecha curva vuelve a Planifica y el punto da varias vueltas.
- **Narración:** Mira lo que encontró y decide qué sigue: falta el precio de una plataforma, así que vuelve a buscar. Este ciclo de planificar, actuar y mirar se repite muchas veces, sin que nadie revise cada paso.
- **Descripción para lectores de pantalla:** Una flecha va de Usa una herramienta a Mira el resultado y otra, curva, vuelve a Planifica. Un punto recorre el ciclo varias veces.

### Escena 4 | Verifica, y vos revisás (13 s)

- **En pantalla:** Antes de terminar verifica, y vos revisás lo que hizo antes de usarlo.
- **Qué se mueve:** Aparecen Verifica y Revisás vos, en verde.
- **Narración:** Al final, el agente verifica su trabajo y entrega el informe. Pero verificó con su propio criterio. Por eso Laura revisa qué fuentes usó y si los precios son de este año antes de presentarlo. Más autonomía es más revisión.
- **Descripción para lectores de pantalla:** Una flecha va a Verifica y otra a una caja verde, Revisás vos.

## Accesibilidad

- Controles de reproducir, pausar, escena anterior y siguiente, velocidad y narración con la voz del navegador. No empieza sola ni se repite.
- Cada escena tiene su descripción, que se anuncia al cambiar, y la transcripción completa está debajo del reproductor.
- Con "reducir movimiento", las escenas se muestran fijas y completas.
