# ListItem
Ítem de lista de M3 Expressive: **toda la fila es el área interactiva**, no solo el texto. Se usa en "Continuar donde dejaste", "Evidencias recientes" y los ítems de "Próximos eventos".

**Anatomía**
- **Elemento inicial:** anillo de progreso, ícono en un contenedor de 40 px o avatar.
- **Texto principal:** `body-large`.
- **Texto de apoyo:** `body-medium` en `on-surface-variant`.
- **Elemento final:** un ícono que anticipa la acción: `chevron_right` para continuar y `replay` para repasar.

**Medidas y forma**
- Alto mínimo de 72 px (dos líneas), con padding de 16 px al inicio y 12 px al final.
- **Ítems en contenedor (M3 Expressive):** cada ítem es su propia superficie, separada por 2 px, en lugar de usar divisores.
  - Esquinas de 4 px entre ítems y de 16 px (`large`) en el primero y el último.
  - Al presionar, el ítem se redondea completo.

**Estados:** capa de estado sobre toda la fila (*hover* 8%, foco 10%, presionado 10%), y anillo de foco interno de 3 px.

**Marcado:** el `<a>` (o `<button>`) envuelve toda la fila. Nunca hay un enlace solo en el título, porque obliga a apuntar al texto y achica el área táctil.
