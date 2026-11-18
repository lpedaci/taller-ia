# Menu
Menú de M3 Expressive: lista temporal de acciones sobre `surface-container`, con esquina `large` (16 px) y elevación 2.

**Menú de usuario:** se abre con el avatar de la barra superior.
- **Encabezado:** nombre, cohorte y ruta.
- **Navegación personal:** Mi aprendizaje, Mi portafolio, Cambiar de ruta, Ajustes y accesibilidad.
- **Datos:** Exportar mi progreso, Importar progreso.
- **Soporte:** Ayuda.
- **Acción destructiva:** Borrar mis datos, en color `error` y siempre con un diálogo de confirmación.

**Medidas:** ítems de 48 px de alto, con ícono de 24 px y etiqueta en `label-large`.

**Teclado**
- Las flechas recorren los ítems; Inicio y Fin van al primero y al último.
- Escape cierra el menú y devuelve el foco al avatar.
- Tab cierra el menú.

**Accesibilidad:** el avatar lleva `aria-haspopup="menu"` y `aria-expanded`. Cada ítem lleva `role="menuitem"`, y los separadores, `role="separator"`.

**No incluye "Cerrar sesión":** el entorno no tiene cuentas, y los datos viven en el navegador.
