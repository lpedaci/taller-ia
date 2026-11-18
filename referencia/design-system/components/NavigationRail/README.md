# NavigationRail
Riel de navegación de M3 Expressive, colapsado (96 px) o expandido (280 px). Reemplaza al *navigation drawer*, que M3 Expressive dejó en desuso.

**Estructura (de arriba hacia abajo)**
1. Botón de menú con la etiqueta "Menú", para colapsar o expandir. La marca no va en el riel: está en la barra superior.
2. **Inicio**, solo, sin pertenecer a ninguna sección.
3. Tres **secciones desplegables**, cada una con su ícono:
   - **Aprender** (`school`): Mi recorrido, Agenda, Mi aprendizaje.
   - **Recursos** (`library_books`): Biblioteca, Mis prompts, Glosario, Facilitadores.
   - **Soporte** (`support`): Ayuda, Ajustes y accesibilidad.
No hay FAB en el riel: "Continuar" es un botón de la barra superior.

**Comportamiento de las secciones**
- **Riel expandido:** todas las secciones aparecen plegadas, excepto la de la página actual, que se abre con su destino activo. Cada sección se abre y se cierra con su botón (con un chevron que rota); lo que se abre a mano no se recuerda.
- **Sección con la página actual:** siempre se marca. Plegada (o con el riel colapsado), su botón lleva el indicador activo; abierta, el encabezado va en `primary`. El nombre accesible agrega "contiene la página actual".
- **Riel colapsado:** se ven los destinos de Aprender. Recursos y Soporte aparecen como íconos con etiqueta corta; al tocarlos, el riel se expande con esa sección abierta.

**Vista previa al dejar el cursor (decisión de Lourdes)**

Con el riel colapsado, si el cursor queda **700 ms** sobre él, el riel se despliega **por encima del contenido** (clase `peek`, elevación 2, esquinas `large` del lado derecho):
- **El contenido no se mueve:** el panel principal conserva su margen de 96 px.
- **Al sacar el cursor,** el riel se vuelve a ocultar.
- **Si durante la vista previa se toca el botón de menú,** el riel queda fijo expandido y se guarda la preferencia.
- **Elegir un destino** cierra la vista previa.
- **Solo funciona con mouse** (`(hover: hover) and (pointer: fine)`) y desde 600 px. En pantallas táctiles no se activa.
- **Después de colapsarlo con el botón,** hay que salir y volver a entrar con el cursor para que vuelva a contar el tiempo, así no se reabre enseguida.

**Según la clase de ventana**
- **Medium y Expanded:** el riel expandido es modal, con *scrim*, y se cierra con Escape.
- **Large o más:** no es modal y se recuerda la preferencia.

**Superficie y estados**
- Fondo `app-color-chrome`, el mismo que la barra superior con scroll, sin borde.
- Indicador activo en `secondary-container`, con el ícono relleno. Con el riel colapsado envuelve ícono y nombre (decisión de Lourdes; M3 marca solo el ícono).

**Accesibilidad**
- `aria-current="page"` en el destino activo.
- `aria-expanded` y `aria-controls` en el botón de menú y en cada sección.
- Altura de la ventana y sin scroll propio, salvo que el contenido no entre.

## Geometría común (plegado y desplegado)
- Inicio va solo, arriba de la sección Aprender.
- Los íconos quedan siempre centrados a 48 px del borde izquierdo, con el riel plegado o desplegado, para que no "salten" al cambiar de estado.
- Filas de 60 px separadas por 12 px en los dos estados. Cabecera de 68 px con el botón de menú y la etiqueta "Menú".
- Indicador activo con esquina grande (16 px): plegado envuelve ícono y nombre (72 px de ancho); desplegado ocupa la fila, con el mismo borde izquierdo (12 px).
- Separadores: entre Inicio y Aprender (plegado, ocupa el lugar del encabezado) y antes de Recursos (en los dos estados).
