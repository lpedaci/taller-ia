# Button
Botones comunes de M3 Expressive: cinco tamaños, dos formas (redonda y cuadrada) y estilos por jerarquía.

## Tamaños (especificación M3 Expressive)

| Tamaño | Alto | Padding lateral | Ícono | Etiqueta | Esquina al presionar | Uso en el taller |
|---|---|---|---|---|---|---|
| XS | 32 px | 12 px | 20 px | label-large | 8 px | No se usa (área táctil chica) |
| S (por defecto) | 40 px | 16 px | 20 px | label-large | 8 px | Acciones de tarjeta, formularios |
| M | 56 px | 24 px | 24 px | title-medium | 12 px | Acción destacada dentro del contenido |
| L | 96 px | 48 px | 32 px | headline-small | 16 px | Reservado (pantallas de bienvenida) |
| XL | 136 px | 64 px | 40 px | headline-large | 16 px | No se usa |

Además:
- **Ancho:** el ancho sigue al contenido, con un mínimo de 48 px. Excepción: "Agregar tarea" (tonal, M) ocupa todo el ancho de la tarjeta de Pendientes en todos los anchos (decisión de Lourdes).
- **Separación entre ícono y etiqueta:** 8 px.

## Estilos
- **Relleno (`btn btn-filled`):** la acción principal. Uno por vista.
- **Tonal (`btn btn-tonal`):** acciones secundarias, como "Agregar tarea".
- **Relleno en `error` (`btn btn-danger`):** acciones destructivas en diálogos (Eliminar, Borrar).
- **Delineado (`btn btn-outlined`):** navegación auxiliar, como "Hoy".
- **De texto (`btn btn-text`):** acciones de tarjeta, como "Ver recorrido", "Ver todo" o "Calendario". Va alineado al final de la tarjeta y con su propia área táctil. Nunca es una fila de enlace a todo el ancho.

## Estados (selección e interacción)
Todos los botones tienen una capa de estado (`::after` con `currentColor`):
- *hover*: 8%;
- foco: 10% más el anillo de foco;
- presionado: 10%.

Al presionar, la forma pasa de redonda a la esquina del tamaño (*shape morph*) con un spring rápido. Los botones de selección (*toggle*) se resuelven con el grupo de botones conectados: el seleccionado cambia de color y de forma.

## Botón "Continuar: Módulo X"
- Es la acción principal persistente del entorno. Va en la **barra superior**, a la derecha del buscador y separado 24 px de él. No hay FAB en el riel ni FAB flotante en mobile.
- Botón relleno tamaño S (40 px), con ícono `play_arrow`.
- 1200 px o más: "Continuar: Módulo X"; 600 a 1199 px: "Continuar"; menos de 600 px: solo el ícono, en un botón de 40 px.
- El nombre accesible es siempre "Continuar: Módulo X": el texto se oculta solo visualmente.
