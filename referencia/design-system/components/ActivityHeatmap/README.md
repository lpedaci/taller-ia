# ActivityHeatmap
Registro de actividad estilo GitHub: cada celda es un día, y el color indica cuántas actividades, lecturas o evaluaciones se completaron.

- **Escala:** 5 niveles, de `surface-container-highest` a `primary`, con una leyenda que va de "Menos" a "Más".
- **Ancho:** la cantidad de semanas se calcula según el ancho disponible. Nunca genera scroll horizontal.
- **No muestra:** rachas, días seguidos ni tiempo de conexión. Lleva siempre la nota aclaratoria.
- **Accesibilidad:** `role="img"` con un resumen, y una alternativa en tabla por mes dentro de un `<details>`.
