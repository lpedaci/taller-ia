# Taller - IA

Entorno de aprendizaje para usar la inteligencia artificial generativa con criterio. Autora: Lourdes Pedaci, Experience Designer.

Es un sitio de HTML, CSS y JavaScript sin paso de compilación. Funciona publicado tal cual en GitHub Pages: no hay servidor, cuentas ni analítica. El progreso de cada persona se guarda en su navegador.

## Estado del proyecto

Etapa 3 de 10, en curso: contenido de los módulos. Los bloques 1 a 3 (Módulos 0 a 10) están completos. El entorno muestra el progreso real de cada persona; con `?demo=1` muestra datos de ejemplo para revisar el diseño. La lección de prueba, con un ejemplo de cada tipo de bloque, está en `#/modulo/prueba`. El registro de pedidos y decisiones está en [DECISIONES.md](DECISIONES.md).

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
- audita cada pantalla contra el design system (ver más abajo);
- escribe el resultado en español en `verificacion/reporte-accesibilidad.md`.

`npm run verificar:rapido` hace lo mismo en 3 anchos (360, 768 y 1280 px). La verificación completa tarda unos 11 minutos y la rápida, unos 5.

### Auditoría contra el design system

```
npm run auditar
```

Revisa en cada pantalla, en 360, 412, 768, 1024 y 1280 px y en los dos modos, las reglas del design system: campos y desplegables, botones, orden y alineación de las filas de acciones, tipografía, forma, espaciado, íconos y color del texto. Tarda un par de minutos y escribe `verificacion/auditoria-design-system.md`. Las reglas están en `referencia/design-system/README.md` ("Reglas verificables") y el código, en `scripts/auditoria-ds.mjs`. Al crear un componente o una pantalla, sumá su página a `scripts/pantallas.mjs` y corré la auditoría antes de presentarlo. `npm run verificar` también la incluye.

Para revisar los estados de carga y error sin esperar a que pasen de verdad, agregá a la dirección `?simular=lento`, `?simular=error`, `?simular=error-leccion` o `?simular=sin-conexion`.

### Diagnóstico sin instalar nada

Agregá `?diagnostico=1` a la dirección (por ejemplo, `https://lpedaci.github.io/taller-ia/?diagnostico=1`). Aparece un panel que analiza la pantalla actual con axe-core, en español, y un botón para ver el sitio en anchos de mobile, tablet y desktop. Solo se carga con ese parámetro.

### Grabar una animación en video

Cada animación se puede exportar a MP4 (1920 x 1080) con subtítulos en WebVTT, para proyectarla en clase o usarla sin conexión. Hace falta tener [ffmpeg](https://ffmpeg.org/download.html) instalado.

```
node scripts/grabar-animacion.mjs prediccion-tokens
```

El video y los subtítulos quedan en `assets/video/`.

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
| `demo.json` | Datos de ejemplo que se ven con `?demo=1` |
| `modulo-XX.json` | La lección de cada módulo (ver abajo). `modulo-prueba.json` muestra todos los tipos de bloque |

Para cambiar un texto, pedíselo a Claude Code con tus palabras: Claude reformula el pedido, lo registra en `DECISIONES.md`, hace el cambio y lo verifica.

### Cómo se escribe una lección

Cada módulo es un archivo `content/modulo-XX.json` (por ejemplo, `modulo-03.json`). En `modulos.json`, el módulo lleva `"leccion": true` cuando su archivo ya existe.

```json
{
  "objetivos": [{ "id": "m3-o1", "texto": "Explicar por qué un modelo se equivoca.", "competencia": "comprender" }],
  "pasos": [
    { "titulo": "Una respuesta muy segura", "momento": "gancho", "bloques": [
      { "tipo": "texto", "md": "Texto con **negrita**, listas y un término del {{glosario}}." }
    ] }
  ]
}
```

- **Momentos** (eventos de Gagné): `gancho`, `objetivo`, `activacion`, `contenido`, `practica`, `feedback`, `evaluacion`, `transferencia` y `cierre`.
- **Bloques de contenido:** `texto`, `nota` (con `estado`: info, atencion, positivo o error), `objetivos`, `cita` (cita traducida) y `profundizar`.
- **Video y animación:** `video` (con `ref` al registro de `content/videos.json`), `animacion` (con `ref` a `content/animaciones/<id>.json`) y `grafico` (barras, líneas o mancuernas).
- **Actividades:** `quiz`, `vf`, `clasificador`, `errores`, `escenario`, `constructor` (con `modo`: prompt, visual o brief), `reflexion`, `comparador`, `tabla`, `flujo`, `storyboard` y `mapa`. Cada actividad lleva un `id` único dentro del módulo y, si es evaluada, la `competencia` y el `objetivo` a los que suma.
- **Del inicio del taller:** `perfil` (nombre y ruta), `autodiagnostico` (con `momento`: inicial o final), `objetivos-personales`, `diagrama` (círculos concéntricos con definiciones) y `predictor` (predictor de palabras con datos fijos). Ejemplos en `modulo-00.json`, `modulo-01.json` y `modulo-02.json`.
- **Del bloque 2:** `marco4d` (el diagrama del marco 4D; con `"destacar": "descripcion"` y `"compacto": true` muestra una sola dimensión), `subir-nivel` (un prompt que se mejora en rondas) y `checklist` (casillas que se descargan en Markdown). El bloque `errores` acepta un `pedido` que se muestra antes del texto. Ejemplos en `modulo-04.json` a `modulo-08.json`.
- **Del bloque 3:** `debate` (tres posiciones; la elegida y el argumento van al diario), `anonimizar` (un texto con partes que se marcan; las que tienen `dato` son las que hay que quitar, con su `reemplazo`) y `marco-legal` (tarjetas por país desde `content/marco-legal.json`; solo se muestran las que tienen `"verificado": true`). Ejemplos en `modulo-09.json` y `modulo-10.json`.
- En `profundizar`, un recurso sin `url` se muestra como libro (`"tipo": "libro"`).
- La lección de prueba (`content/modulo-prueba.json`) tiene un ejemplo de cada tipo de bloque, salvo los del inicio del taller.

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
assets/video/       animaciones grabadas en MP4 con subtítulos, para facilitadores
scripts/            servidor local, verificación y grabación de animaciones (solo desarrollo)
referencia/         prototipo aprobado y design system (no forma parte del taller)
```
