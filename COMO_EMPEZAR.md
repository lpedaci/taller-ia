# Cómo empezar con Claude Code

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `BRIEF_taller-ia.md` | La especificación completa: contenidos, pedagogía, diseño, stack, fuentes, etapas y forma de trabajo. |
| `css/tokens.css` | Los tokens de color, tipografía, forma, espacio y movimiento de Material 3 ya generados. No se editan a mano. |
| `referencia/prototipo-entorno.html` | El prototipo aprobado del entorno. Se abre con doble clic en el navegador. |
| `referencia/design-system/` | El design system "Taller - IA": fundamentos, tokens y componentes, cada uno con su README y su vista previa. |

## Pasos

1. Creá en GitHub un repositorio vacío llamado `taller-ia` y clonalo en tu computadora (o creá una carpeta `taller-ia`).
2. Copiá adentro todo el contenido de esta carpeta, respetando las subcarpetas.
3. Abrí una terminal en esa carpeta y ejecutá `claude`.
4. Pegá el mensaje de abajo.
5. Claude Code te va a hacer las preguntas de la sección 0 del brief y te va a mostrar un plan antes de escribir código. Respondé y aprobá el plan.

## Mensaje para pegar

```
Vas a construir el Taller - IA, un learning environment. En esta carpeta están:
- BRIEF_taller-ia.md: la especificación completa. Leelo entero antes de escribir código.
- css/tokens.css: los tokens de Material 3 ya generados. Usalos tal cual.
- referencia/prototipo-entorno.html: el prototipo aprobado del entorno. Abrilo y respetá su estructura, jerarquía y comportamiento responsive.
- referencia/design-system/: el design system, con sus fundamentos y componentes.

Antes de empezar:
1. Confirmá conmigo las decisiones de la sección 0 del brief.
2. Proponé un plan para la etapa 1 de la sección 8 y esperá mi aprobación.
3. Creá DECISIONES.md con el formato de la sección 10 y registrá ahí cada pedido y decisión.

Trabajá por etapas y verificá cada cambio como indica la sección 10 (capturas en mobile, tablet y desktop, modo claro y oscuro, y chequeo de accesibilidad con axe-core). No des nada por terminado sin verificarlo.
```

## Para los pedidos siguientes

- Pedí un cambio por vez, en tus palabras. Claude Code lo reformula como "Solicitado" en `DECISIONES.md`.
- Si algo se ve mal, mandá una captura y decí en qué pantalla y en qué ancho pasa.
- Si querés retomar otro día, decile: "Leé DECISIONES.md y seguí donde quedamos".
