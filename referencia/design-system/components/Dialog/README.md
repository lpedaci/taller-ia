# Dialog
Diálogo básico de M3 para confirmar acciones importantes o irreversibles.

**Medidas y superficie**
- Fondo `surface-container-high`, esquina `extra-large` (28 px) y padding de 24 px.
- Ancho de 280 a 560 px.

**Contenido**
- Ícono opcional centrado, en `secondary`.
- Título en `headline-small`, como una pregunta clara ("¿Borrar tus datos?").
- Texto que explica la consecuencia y cómo evitarla.

**Acciones** (decisión de Lourdes, para que los botones no se pierdan sobre la superficie)
- Alineadas al final. Cancelar va primero, como botón con borde (`outline` y texto `on-surface`).
- La acción principal es un botón relleno; si es destructiva (Eliminar, Borrar), relleno en `error`.

**Diálogo de formulario** (por ejemplo, "Nueva tarea")
- Tablet y desktop: diálogo básico de 480 px, con título alineado a la izquierda.
- Mobile: pantalla completa, con botón de cerrar, título y la acción principal arriba.
- Campos con etiqueta visible y 56 px de alto; error con borde y mensaje en `error`, y `aria-invalid`.
- Fecha y hora con ícono Material visible en lugar del ícono nativo del navegador.

**Accesibilidad**
- Se usa el elemento `<dialog>` con `showModal()`, que atrapa el foco y se cierra con Escape.
- El foco vuelve al botón que lo abrió.
- Nunca se usan `alert` ni `confirm` del navegador.
