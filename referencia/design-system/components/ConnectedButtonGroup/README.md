# ConnectedButtonGroup
Grupo de botones conectados de M3 Expressive, que reemplaza a los *segmented buttons*: se elige una opción entre 2 y 5.

- **Usos:** vista de la agenda (Día, Semana, Mes), tema y contraste en Ajustes.
- **Forma:** los extremos son redondos y las uniones van en `md-sys-shape-corner-small`. La opción seleccionada usa `secondary` y se vuelve completamente redonda.
- **Accesibilidad:** el contenedor lleva `role="group"` con `aria-label`. Cada botón lleva `aria-pressed`. No se usa solo el color para marcar la selección: también cambia la forma.
