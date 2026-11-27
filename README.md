<div align="center">

<img src="assets/svg/logo.svg" width="72" height="72" alt="Logo de Taller - IA">

# Taller - IA

**Entorno de aprendizaje para usar la inteligencia artificial generativa con criterio.**<br>
Sitio estático y accesible, con un sistema de verificación de contenido automatizado con IA y revisado por personas.

[![Sitio publicado](https://img.shields.io/badge/sitio-publicado-005eb1?logo=githubpages&logoColor=white)](https://lpedaci.github.io/taller-ia/)
[![Verificación de fuentes](https://github.com/lpedaci/taller-ia/actions/workflows/verificacion-fuentes.yml/badge.svg)](https://github.com/lpedaci/taller-ia/actions/workflows/verificacion-fuentes.yml)
[![Revisión de cambios](https://github.com/lpedaci/taller-ia/actions/workflows/revision-cambios.yml/badge.svg)](https://github.com/lpedaci/taller-ia/actions/workflows/revision-cambios.yml)
![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2_AA-005eb1)
![Sin build](https://img.shields.io/badge/build-sin_compilaci%C3%B3n-2ea44f)

[**Ver el taller**](https://lpedaci.github.io/taller-ia/) &nbsp;|&nbsp; [Verificación con IA](#verificación-automática-con-ia) &nbsp;|&nbsp; [Ver en local](#ver-el-taller-en-tu-computadora) &nbsp;|&nbsp; [Decisiones](DECISIONES.md)

Diseño y desarrollo: **Lourdes Pedaci**, Experience Designer enfocada en desarrollo web y automatización con IA.

</div>

| 21 | 9 | 46 | 2 | 87 |
|:---:|:---:|:---:|:---:|:---:|
| módulos con lección y actividades | animaciones propias | datos verificados por IA en su fuente | workflows de GitHub Actions | decisiones registradas |

### Stack

<p>
  <img src="https://skillicons.dev/icons?i=html,css,js,nodejs,githubactions,github,md&theme=dark" alt="HTML, CSS, JavaScript, Node.js, GitHub Actions, GitHub y Markdown">
</p>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-663399?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JSON](https://img.shields.io/badge/Contenido_en_JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Material Design 3](https://img.shields.io/badge/Material_Design_3-757575?style=for-the-badge&logo=materialdesign&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

**Automatización y calidad**

![Claude](https://img.shields.io/badge/Claude_Code-D97757?style=for-the-badge&logo=claude&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_20+-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge)
![axe-core](https://img.shields.io/badge/axe--core-663399?style=for-the-badge)
![ffmpeg](https://img.shields.io/badge/ffmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)

### Metodologías

![Human in the loop](https://img.shields.io/badge/Human_in_the_loop-la_IA_propone,_una_persona_decide-005eb1?style=flat-square)
![Design system](https://img.shields.io/badge/Design_system-auditado_en_cada_cambio-005eb1?style=flat-square)
![Accesibilidad](https://img.shields.io/badge/Accesibilidad-WCAG_2.2_AA-005eb1?style=flat-square)
![Gagné](https://img.shields.io/badge/Dise%C3%B1o_instruccional-eventos_de_Gagn%C3%A9-005eb1?style=flat-square)
![APA 7](https://img.shields.io/badge/Citas-APA_7-005eb1?style=flat-square)
![Decisiones](https://img.shields.io/badge/Registro-de_decisiones-005eb1?style=flat-square)

## Sobre el proyecto

Es un sitio de HTML, CSS y JavaScript sin paso de compilación. Funciona publicado tal cual en GitHub Pages: no hay servidor, cuentas ni analítica. El progreso de cada persona se guarda en su navegador.

El contenido se mantiene al día con un **sistema de verificación asistido por IA**: revisa las fuentes y la redacción, propone cómo corregirlas y deja cada decisión a una persona. Ver [Verificación automática con IA](#verificación-automática-con-ia).

## Estado del proyecto

Las 10 etapas del brief están terminadas: 21 módulos con lección, actividades, nueve animaciones propias, glosario, Biblioteca, diario y guía para facilitadores. Lo que queda pendiente de verificar a mano está al final de [DECISIONES.md](DECISIONES.md) (D-070). El entorno muestra el progreso real de cada persona; con `?demo=1` muestra datos de ejemplo para revisar el diseño. La lección de prueba, con un ejemplo de cada tipo de bloque, está en `#/modulo/prueba`. El registro de pedidos y decisiones está en [DECISIONES.md](DECISIONES.md).

## Verificación automática con IA

Un curso sobre IA envejece rápido: las herramientas cambian funciones, las leyes se reforman y las páginas de ayuda se mudan. Este repositorio tiene un sistema que lo revisa solo, en piloto sobre los Módulos 10 (marco legal) y 11 (asistentes): **46 datos verificables**, 40 funciones de asistentes y 6 leyes de la región.

**La regla central: la IA propone, una persona decide.** Los workflows solo pueden leer el repositorio y escribir informes. No publican, no corrigen y no fusionan.

### Qué revisa y quién lo revisa

| Lo revisa | Qué | Por qué así |
|---|---|---|
| Scripts, sin IA | Enlaces rotos o que redirigen a otra página, datos vencidos, ortografía, precios sin fecha, accesibilidad y el armado del informe | Es regla: gratis, rápido y siempre igual |
| IA (Claude) | Si la fuente oficial sigue diciendo lo que afirma el taller, si una paráfrasis es fiel y natural, y qué fuente oficial sirve para reparar un dato | Es criterio: necesita leer y comparar |

Cada veredicto de la IA trae la **frase exacta de la fuente**, leída en esa corrida. Si una fuente no carga, el dato va a revisión manual: el sistema nunca completa de memoria.

### Cuándo corre

| Disparador | Qué hace | Dónde deja el informe |
|---|---|---|
| Los días 1, 11 y 21 de cada mes (`verificacion-fuentes.yml`) | Revisa enlaces y textos, calcula qué datos vencieron (30 días las herramientas, 180 las leyes) y verifica solo esos en su fuente oficial | Un Issue con la etiqueta `verificacion` |
| Cada pull request que toca contenido, estilos o código (`revision-cambios.yml`) | Corre la verificación completa del taller, verifica en la fuente los datos que cambian y revisa la paráfrasis con la rúbrica | Un comentario en el pull request |

Las fechas no se escriben a mano: cuándo cambió un dato sale del historial de commits, y cuándo se verificó queda guardado en el último Issue.

### Cómo se usa

1. **Leer el informe.** Arriba va lo que hay que decidir, ordenado por gravedad; después las fuentes propuestas, con la referencia en APA 7 lista para copiar; lo que está bien queda plegado.
2. **Comprobar lo dudoso** en la fuente, sobre todo las fuentes propuestas: que hablen del mismo producto y del mismo plan que el taller.
3. **Corregir en un pull request** que mencione el informe. El propio pull request vuelve a revisar los datos que cambian.

Para correrlo a mano: **Actions > Verificación de fuentes > Run workflow**. Se puede elegir la rama y marcar **"Revisar los 46 datos"** o **"Corrida de prueba"**, que abre un Issue "[Prueba]" sin guardar fechas.

### Cómo se validó

Con una **prueba a ciegas** de 21 casos sembrados en una rama aparte (pull request #6, cerrado sin fusionar): 19 errores en datos, textos y ortografía, y 2 controles correctos que no debían marcarse.

| Resultado | |
|---|---|
| Errores detectados | 17 de 19 |
| Controles sin falsa alarma | 2 de 2 |
| Problemas reales encontrados que no se habían sembrado | 2 |
| Datos cambiados en el primer uso real (#8), sin ningún error falso | 18 |

Cada falla de la prueba se convirtió en un ajuste de la versión 3 (D-083).

### Archivos y costo

- `.github/workflows/`: los dos workflows.
- `scripts/vencimientos.mjs`: qué datos revisar (`--todos` para todos, `--cambios-desde <rama>` para los de un pull request).
- `scripts/armar-informe.mjs`: arma el informe y detecta si la IA no completó la revisión.
- `revision-ia/`: la rúbrica, los dos prompts y la plantilla del informe.

No tiene costo adicional: GitHub Actions es gratis en repositorios públicos, y la IA usa una suscripción de Claude a través del secret `CLAUDE_CODE_OAUTH_TOKEN`. GitHub pausa los workflows programados después de 60 días sin actividad en el repositorio: si pasa, se reactivan desde **Actions**.

Las decisiones están registradas en [DECISIONES.md](DECISIONES.md), de la D-079 a la D-084.

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

### Lista corta

Antes de subir un cambio a `main`, corré lo que corresponda:

| Comando | Qué revisa | Cuándo |
|---|---|---|
| `npm run auditar` | Que todo respete el design system (unos minutos) | Siempre que cambies algo visual |
| `npm run textos` | Rayas, puntos medios, texto en inglés sin traducir, citas, signos sin par, palabras repetidas, precios sin la nota con fecha y la ortografía que se puede revisar con reglas (tildes diacríticas, homófonos, "de el") | Siempre que cambies un texto |
| `npm run enlaces` | Que todos los enlaces externos funcionen, y cuáles redirigen a otra página (la original puede haberse reemplazado) | Al sumar fuentes. La verificación automática lo corre los días 1, 11 y 21 |
| `npm run contraste` | Contraste alto en todas las pantallas y que el progreso se mantenga al cerrar el navegador | Antes de publicar una versión |
| `npm run letra` | Que el sitio funcione con la letra del navegador al doble: que el texto crezca, sin scroll horizontal ni texto cortado | Siempre que cambies un componente o un layout |
| `npm run verificar` | Todo lo anterior de accesibilidad y diseño, con capturas en 6 anchos y 2 modos | Antes de publicar una versión |

Los resultados quedan en `verificacion/` (esa carpeta no se publica).

### Verificación completa

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

### Animaciones

Cada animación tiene sus textos en `content/animaciones/<id>.json` (en pantalla, narración, descripción y qué se mueve) y su dibujo en `js/animaciones/<id>.js`. Las que explican un proceso se arman con las piezas de `js/animaciones/kit.js`. El guion de cada una se genera desde su JSON:

```
node scripts/generar-guiones.mjs
```

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
| `modulos.json` | Bloques, módulos (título, descripción, pasos, minutos), competencias, niveles, rutas sugeridas y `coordinacion`, el nombre y el correo a los que se envían las insignias y el certificado |
| `agenda.json` | Fechas de la cursada por cohorte. Hoy está vacío: tiene un ejemplo del formato |
| `demo.json` | Datos de ejemplo que se ven con `?demo=1` |
| `glosario.json` | Los 40 términos del glosario, con su original en inglés, una definición propia y el módulo donde se explican |
| `fuentes.json` | La Biblioteca. Se arma con `node scripts/generar-fuentes.mjs` a partir de "Para profundizar" de cada módulo; el "por qué leerlo" se escribe a mano |
| `facilitadores.json` | La guía para facilitadores, módulo por módulo (los objetivos salen de cada lección) |
| `herramientas.json` | Funciones de ChatGPT, Claude, Gemini y Copilot, con la URL de la ayuda oficial donde se confirmó cada dato. La fecha de cada dato sale del historial de commits, y la verificación automática avisa cuando vence |
| `marco-legal.json` | Leyes de protección de datos de otros países de la región. Solo se muestran las que tienen `"verificado": true` |
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
- **Del bloque 4:** `herramientas` (fichas de los asistentes desde `content/herramientas.json`; `"claves"` elige las funciones), `prompt-fijo` (un prompt para copiar o abrir en un asistente) y `kit` (áreas con tres prompts modelo cada una). En `constructor`, un campo con `"opciones"` se muestra como desplegable. Ejemplos en `modulo-11.json` a `modulo-13.json`.
- **Del bloque 5:** `catalogo` (herramientas de creación de una `"categoria"` de `herramientas.json`), `agente` (conversación simulada en la que se marcan los momentos para frenar), `guion-voz` (guion con pausas, énfasis y duración estimada) y `guia` (pasos opcionales en un bloque plegable). Ejemplos en `modulo-14.json` a `modulo-17.json`.
- **Del bloque 7:** `rubrica` (criterios con tres niveles), `proyecto` (opciones, plantilla, autoevaluación con la rúbrica e impresión) y `certificado` (requiere el proyecto guardado: `"requiere": "20-proyecto"`). Ejemplos en `modulo-20.json`.
- En `profundizar`, un recurso sin `url` se muestra como libro (`"tipo": "libro"`).
- La lección de prueba (`content/modulo-prueba.json`) tiene un ejemplo de cada tipo de bloque, salvo los del inicio del taller.

## Estructura

```
index.html          el entorno
estilos.html        tokens y componentes
css/tokens.css      tokens de Material 3 (la escala tipográfica pasó a rem en D-072)
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
revision-ia/        rúbrica, prompts y plantilla del informe de la verificación con IA
.github/workflows/  verificación periódica de fuentes y revisión de cada pull request
referencia/         prototipo aprobado y design system (no forma parte del taller)
```
