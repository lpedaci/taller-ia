# CompetencyLevel
Muestra el nivel demostrado en cada competencia del taller. Es la métrica principal de avance y reemplaza al "progreso por bloque", que solo medía completitud.

**Escala**
- **Sin evidencia:** todavía no hay evidencia.
- **Inicial, En desarrollo y Logrado:** se calculan a partir de actividades evaluadas y evidencias.

**Lectura del nivel**
- Tres segmentos que suben de intensidad (`primary` al 35%, al 65% y al 100%).
- Una etiqueta de texto con el nivel. El nivel nunca se comunica solo con color.

**Resumen y próximo paso**
- **Arriba del panel:** "X de Y objetivos demostrados con evidencias".
- **Abajo del panel:** un "Próximo paso sugerido" sobre `primary-container`.

**Accesibilidad:** cada fila tiene una descripción completa en `aria-label` (competencia, nivel, objetivos y evidencias).
