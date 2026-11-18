# Taller - IA

Entorno de aprendizaje para usar la inteligencia artificial generativa con criterio. Autora: Lourdes Pedaci, Experience Designer.

Es un sitio de HTML, CSS y JavaScript sin paso de compilación. Funciona publicado tal cual en GitHub Pages: no hay servidor, cuentas ni analítica. El progreso de cada persona se guarda en su navegador.

## Estado del proyecto

Etapa 1 de 10: esqueleto y sistema de diseño Material 3 Expressive. El inicio usa datos de ejemplo (`content/demo.json`). El registro de pedidos y decisiones está en [DECISIONES.md](DECISIONES.md).

## Ver el taller en tu computadora

El contenido vive en archivos JSON, y el navegador no los lee si abrís `index.html` con doble clic. Hace falta un servidor local:

1. Instalá [Node.js](https://nodejs.org/es) (versión 20 o más nueva).
2. Abrí una terminal en esta carpeta y ejecutá:

```
npm run servir
```

3. Abrí `http://localhost:8080` en el navegador. Para cerrar el servidor, apretá Ctrl+C en la terminal.

Páginas útiles:

- `http://localhost:8080/estilos.html`: todos los tokens y componentes, con selector de tema y contraste.
- `http://localhost:8080/?diagnostico=1`: el entorno con el panel de diagnóstico de accesibilidad (ver más abajo).

## Verificar antes de publicar

La primera vez, instalá las herramientas de verificación (solo se usan en tu computadora, no se publican):

```
npm install
npx playwright install chromium
```

Después, cada vez que quieras verificar:

```
npm run verificar
```

El comando levanta un servidor local, recorre las pantallas principales y:

- saca capturas en 360, 412, 768, 1024, 1280 y 1920 px, en modo claro y oscuro, en `verificacion/capturas/`;
- corre axe-core en cada pantalla, ancho y modo;
- revisa que no haya scroll horizontal ni elementos cortados, que las áreas táctiles en mobile midan 48 px, que no haya errores de consola, que "reducir movimiento" apague las animaciones y que no aparezcan rayas largas ni puntos medios como separadores;
- escribe el resultado en español en `verificacion/reporte-accesibilidad.md`.

`npm run verificar:rapido` hace lo mismo en 3 anchos (360, 768 y 1280 px).

### Diagnóstico sin instalar nada

Agregá `?diagnostico=1` a la dirección (por ejemplo, `https://lpedaci.github.io/taller-ia/?diagnostico=1`). Aparece un panel que analiza la pantalla actual con axe-core, en español, y un botón para ver el sitio en anchos de mobile, tablet y desktop. Solo se carga con ese parámetro.

## Publicar en GitHub Pages

1. En GitHub, entrá al repositorio `taller-ia` y abrí **Settings > Pages**.
2. En **Source**, elegí **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. Guardá.
3. En uno o dos minutos el sitio queda en `https://lpedaci.github.io/taller-ia/`.

Cada vez que se suben cambios a `main`, GitHub Pages vuelve a publicar solo.

## Editar contenidos

El contenido está separado del código, en la carpeta `content/`:

| Archivo | Qué contiene |
|---|---|
| `modulos.json` | Bloques, módulos (título, descripción, pasos, minutos), competencias, niveles y rutas sugeridas |
| `agenda.json` | Fechas de la cursada por cohorte. Hoy está vacío: tiene un ejemplo del formato |
| `demo.json` | Datos de ejemplo del panel de inicio (etapa 1) |

Para cambiar un texto, pedíselo a Claude Code con tus palabras: Claude reformula el pedido, lo registra en `DECISIONES.md`, hace el cambio y lo verifica.

## Estructura

```
index.html          el entorno
estilos.html        tokens y componentes
css/tokens.css      tokens de Material 3 generados (no se editan a mano)
css/components.css  componentes M3
css/layout.css      clases de ventana, navegación y paneles
js/app.js           arranque y enrutamiento por hash (#/seccion)
js/storage.js       localStorage con respaldo en memoria
js/state.js         contenido y estado de la persona
js/shell.js         riel, barra inferior, barra superior, búsqueda y menús
js/views/           una vista por sección
js/diagnostico.js   panel de accesibilidad (?diagnostico=1)
content/            contenido en JSON
assets/svg/         ícono del sitio
scripts/            servidor local y verificación (solo desarrollo)
referencia/         prototipo aprobado y design system (no forma parte del taller)
```
