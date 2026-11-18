# DECISIONES | Taller - IA

Registro de desarrollo del proyecto. Cada entrada tiene fecha, lo solicitado (reformulado), la decisión, los archivos afectados, la verificación y los pendientes. Las decisiones reemplazadas se marcan, no se borran.

## Índice de decisiones vigentes

| N.º | Fecha | Decisión | Estado |
|---|---|---|---|
| D-001 | 2026-11-18 | Valores de la sección 0 del brief confirmados sin cambios | Vigente |
| D-002 | 2026-11-18 | Repositorio git local conectado a GitHub, con push al cerrar cada etapa | Vigente |
| D-003 | 2026-11-18 | El recorrido tiene 7 bloques (no 5) en el Módulo 0 | Vigente |
| D-004 | 2026-11-18 | La terciaria es "miel" y se usa para lo relacionado con el tiempo | Vigente |
| D-005 | 2026-11-18 | Las skills de diseño instaladas se usan como apoyo; ante conflicto manda el brief | Vigente |
| D-006 | 2026-11-18 | Etapa 1: arquitectura sin build, módulos ES y contenido en JSON | Vigente |
| D-007 | 2026-11-18 | Etapa 1: el inicio usa datos de ejemplo de `content/demo.json` | Vigente |
| D-008 | 2026-11-18 | Niveles de competencia en la escala azul, sin terciaria | Vigente |
| D-009 | 2026-11-18 | Campo de búsqueda en la barra desde 1200 px; botón de búsqueda debajo | Vigente |
| D-010 | 2026-11-18 | Eventos que ya pasaron: se atenúan con color, no con opacidad | Vigente |
| D-011 | 2026-11-18 | Áreas táctiles de 48 px con extensión invisible; excepción en la grilla del mes | Vigente |
| D-012 | 2026-11-18 | Rutas por hash con el formato `#/seccion/parametros` | Vigente |
| D-013 | 2026-11-18 | Ruta "Taller completo" sumada a las rutas sugeridas | Vigente |
| D-014 | 2026-11-18 | Herramientas de verificación y modo `?diagnostico=1` | Vigente |
| D-015 | 2026-11-18 | Cierre de la etapa 1: verificación completa | Vigente |
| D-016 | 2026-11-18 | Los textos explicativos ocupan el ancho de su contenedor | Vigente |
| D-017 | 2026-11-18 | Tarjeta "Tu ruta" rediseñada, con diálogo para elegir la ruta | Vigente |
| D-018 | 2026-11-18 | Riel: Aprender abierta en Inicio y secciones en acordeón (reemplaza en parte una regla del brief) | Vigente |

---

## D-001 | 2026-11-18 | Confirmación de la sección 0

**Solicitado:** confirmar los supuestos de partida antes de construir: nombre, públicos, edad, modalidad, duración, repositorio, idioma, registro y design system.

**Decisión y motivo:** se mantienen todos los valores por defecto del brief: "Taller - IA"; público adulto (mayores de 18) de Argentina y LATAM sin formación técnica en IA, con docentes y capacitadores como público secundario; modalidad autoasistida y para clases online sincrónicas; 21 módulos en 7 bloques de 45 a 75 minutos; publicación en `lpedaci.github.io/taller-ia`; solo español, sin internacionalización, con voseo rioplatense moderado; Material Design 3 Expressive.

**Archivos afectados:** ninguno.

**Verificación:** confirmado por Lourdes.

**Pendientes o riesgos:** ninguno.

## D-002 | 2026-11-18 | Control de versiones

**Solicitado:** conectar la carpeta del proyecto con el repositorio `github.com/lpedaci/taller-ia`, que está vacío.

**Decisión y motivo:** se inicializa git en la carpeta, se agrega el remoto `origin` y se trabaja con commits locales. El push a `main` se hace al cerrar cada etapa, después de la aprobación de Lourdes. `node_modules/` y `verificacion/` quedan fuera del repositorio.

**Archivos afectados:** `.gitignore`.

**Verificación:** `git remote -v` apunta al repositorio.

**Pendientes o riesgos:** activar GitHub Pages en la configuración del repositorio cuando haya una primera versión publicable (lo hace Lourdes desde GitHub).

## D-003 | 2026-11-18 | Cantidad de bloques en el mapa del recorrido

**Solicitado:** resolver una inconsistencia del brief: el Módulo 0 menciona un "mapa del recorrido en 5 bloques", pero la estructura de contenidos tiene 7.

**Decisión y motivo:** el mapa muestra los 7 bloques (Comprender, Criterio, Ética y datos, Asistentes, Crear con IA, Automatizar, Aplicar), porque es la estructura vigente de la sección 3.

**Archivos afectados:** contenido del Módulo 0 (etapa 3).

**Verificación:** pendiente para la etapa 3.

**Pendientes o riesgos:** ninguno.

## D-004 | 2026-11-18 | Uso de la paleta terciaria

**Solicitado:** resolver una inconsistencia entre fuentes: el README del design system describe en una tabla la terciaria como violeta (solo para el nivel "En desarrollo"), mientras que el brief y `css/tokens.css` la definen como "miel" (tono HCT 75, croma 28).

**Decisión y motivo:** se sigue el brief y los tokens: la terciaria es miel y se usa con moderación para lo relacionado con el tiempo (ícono de Agenda, Pendientes, tarjeta "Próximo cierre" y avatar). No se usa para estados ni para selección.

**Archivos afectados:** ninguno por ahora. Se aplica al construir los componentes.

**Verificación:** `css/tokens.css` define `--md-sys-color-tertiary: #795826` (claro) y `#ebbf83` (oscuro), tonos miel.

**Pendientes o riesgos:** conviene corregir esa tabla del README del design system para que no confunda. Se consulta con Lourdes.

## D-005 | 2026-11-18 | Skills de diseño instaladas

**Solicitado:** aplicar la sección 5 ("Uso de skills instaladas"): cargar las skills de UX, frontend, accesibilidad y visualización disponibles en la etapa que corresponda.

**Decisión y motivo:** se usa la skill de UI/UX (reglas de accesibilidad, interacción, layout y movimiento) como checklist de revisión en cada etapa, y las de accesibilidad y visualización de datos en las etapas 2 y 10. Las recomendaciones de estilo, paleta o tipografía de esas skills no se aplican: el sistema visual ya está definido por el brief, `css/tokens.css` y el design system. Si alguna regla de una skill contradice el brief, se anota acá y se sigue el brief.

**Archivos afectados:** ninguno.

**Verificación:** no aplica.

**Pendientes o riesgos:** ninguno.

## D-006 | 2026-11-18 | Etapa 1: arquitectura

**Solicitado:** construir el esqueleto del entorno (etapa 1 de la sección 8): tokens M3 tal cual, componentes base, navegación adaptable a las 4 clases de ventana, enrutamiento, estado y persistencia, inicio con mapa del recorrido y página de estilos. **Alcance:** todas las clases de ventana, modo claro y oscuro, contraste estándar, medio y alto. **Verificación:** capturas en 6 anchos y 2 modos, axe-core y teclado.

**Decisión y motivo:** HTML, CSS y JavaScript sin build, con módulos ES nativos (`<script type="module">`), que GitHub Pages sirve sin configuración. La estructura, la jerarquía y el comportamiento responsive se tomaron del prototipo aprobado. El código se separó en `css/components.css`, `css/layout.css` y una vista por sección en `js/views/`. Consecuencia: como el contenido vive en JSON, el sitio no abre con doble clic. Para verlo en la computadora se usa `npm run servir`. Si alguien lo abre con doble clic, la pantalla explica cómo abrirlo.

**Archivos afectados:** `index.html`, `estilos.html`, `css/components.css`, `css/layout.css`, `js/*`, `content/modulos.json`, `content/agenda.json`, `content/demo.json`, `assets/svg/logo.svg`.

**Verificación realizada:** ver D-014 y el cierre de la etapa 1 (D-015).

**Pendientes o riesgos:** ninguno.

## D-007 | 2026-11-18 | Datos de ejemplo en el inicio

**Solicitado:** mostrar el panel de inicio completo en la etapa 1, antes de que existan lecciones que generen progreso real.

**Decisión y motivo:** los datos del prototipo (perfil, progreso, competencias, eventos, pendientes y avisos) pasaron a `content/demo.json`, con fechas relativas a hoy para que la agenda siempre se vea viva. Lo que la persona cambia (tareas propias, tareas tildadas, ruta elegida, último módulo visitado y ajustes) sí se guarda en el navegador. El pie conserva el aviso del prototipo: "los datos de esta pantalla son de ejemplo". En la etapa 2 se reemplaza por el estado real, con sus estados vacíos.

**Archivos afectados:** `content/demo.json`, `js/state.js`.

**Verificación realizada:** al recargar se mantienen las tareas propias, la ruta y el último módulo. "Borrar mis datos" vuelve al estado de ejemplo.

**Pendientes o riesgos:** el registro de actividad de ejemplo se genera con una semilla fija. En la etapa 2 sale de las actividades completadas.

## D-008 | 2026-11-18 | Colores de los niveles de competencia

**Solicitado:** resolver un conflicto del prototipo: el nivel "En desarrollo" usaba la terciaria, que según el brief se reserva para lo relacionado con el tiempo (D-004).

**Decisión y motivo:** los cuatro niveles usan la familia azul, de menos a más: Sin evidencia (gris neutro), Inicial (borde y texto `primary`), En desarrollo (`primary-container`) y Logrado (`primary` relleno). Siempre van con su etiqueta de texto, así que no dependen del color.

**Archivos afectados:** `css/layout.css` (`.lvl-*`).

**Verificación realizada:** axe-core sin problemas de contraste en modo claro y oscuro.

**Pendientes o riesgos:** ninguno.

## D-009 | 2026-11-18 | Búsqueda en la barra superior

**Solicitado:** que la barra superior no corte botones ni títulos en ningún ancho. En el prototipo, entre 840 y 1199 px, el campo de búsqueda, el título, "Continuar" y los íconos no entran juntos: el título quedaba reducido a "Ag..." o los íconos se salían de la pantalla.

**Decisión y motivo:** el campo de búsqueda aparece en la barra desde 1200 px y se achica antes que el título (mínimo 168 px). Por debajo de 1200 px es un botón de ícono que abre la búsqueda a pantalla completa. El texto de ejemplo del campo pasó a "Buscar"; la etiqueta accesible sigue siendo "Buscar módulos y secciones". En Medium (600 a 839 px) se oculta el subtítulo de la barra y el título se acorta con puntos suspensivos cuando no entra. Es un cambio de detalle, no de estructura.

**Archivos afectados:** `css/layout.css`, `index.html`.

**Verificación realizada:** capturas de la barra en 600, 840, 1024, 1200 y 1280 px. El verificador ahora también detecta elementos cortados a la derecha.

**Pendientes o riesgos:** entre 600 y 680 px, fuera de Inicio, el título de la barra se ve muy corto ("Mi a..."). La pantalla repite su título grande en el contenido. **A consultar con Lourdes:** si prefiere ocultarlo en ese rango, como en mobile.

## D-010 | 2026-11-18 | Eventos que ya pasaron

**Solicitado:** atenuar los eventos que ya pasaron sin perder contraste. En el prototipo se atenuaban con opacidad y el texto quedaba por debajo de 4.5:1.

**Decisión y motivo:** se atenúan con color: fondo `surface-container`, título en `on-surface-variant`, chip en gris y la marca "Finalizado" con tilde. Cumplen AA y nunca dependen solo del color. Con el mismo criterio, los días de otro mes en la grilla mensual llevan fondo `app-color-card-item`.

**Archivos afectados:** `css/layout.css`.

**Verificación realizada:** axe-core sin problemas de contraste en Inicio y Agenda, en modo claro y oscuro.

**Pendientes o riesgos:** ninguno.

## D-011 | 2026-11-18 | Áreas táctiles

**Solicitado:** áreas táctiles de 48 x 48 px como mínimo (sección 5).

**Decisión y motivo:** los botones S de M3 miden 40 px visibles y tienen una extensión invisible de 48 px (regla de M3). Los chips de filtro (32 px) llevan 16 px entre filas para no superponer sus áreas. Los enlaces dentro de un texto corrido quedan exceptuados, como indica WCAG 2.2 (criterio 2.5.8). **Excepción documentada:** en la grilla del mes de la Agenda, 7 columnas en 360 px dejan celdas de 47 px de ancho. Superan el mínimo de 24 px de WCAG 2.2 AA. El verificador la lista aparte como excepción aceptada.

**Archivos afectados:** `css/components.css`, `css/layout.css`, `js/views/agenda.js`, `scripts/verificar.mjs`.

**Verificación realizada:** el verificador prueba cada elemento con la posición real del toque, no solo con su tamaño, en 360 y 412 px.

**Pendientes o riesgos:** ninguno.

## D-012 | 2026-11-18 | Formato de las rutas

**Solicitado:** enrutamiento por hash que funcione en GitHub Pages (sección 6).

**Decisión y motivo:** `#/seccion/parametros`. Por ejemplo: `#/inicio`, `#/agenda/semana/2026-11-19`, `#/modulo/6` y, más adelante, `#/modulo/6/paso/2`. También se aceptan las rutas del prototipo (`#agenda-semana`) para que los enlaces viejos sigan funcionando. "Ajustes" usa `#/ajustes` (en el prototipo era `#preferencias`).

**Archivos afectados:** `js/routes.js`, `js/app.js`.

**Verificación realizada:** prueba de navegación con teclado y de búsqueda (Enter abre el resultado).

**Pendientes o riesgos:** ninguno.

## D-013 | 2026-11-18 | Ruta "Taller completo"

**Solicitado:** permitir elegir la ruta desde "Mi recorrido" y desde "Cambiar de ruta" en el menú del avatar.

**Decisión y motivo:** además de las 5 rutas del brief, se suma "Taller completo" (los 21 módulos), para quien cursa todo en modo autoasistido. Los módulos fuera de la ruta elegida se muestran con borde punteado y sin la marca "En tu ruta", pero no se bloquean.

**Archivos afectados:** `content/modulos.json`, `js/views/recorrido.js`.

**Verificación realizada:** el selector se maneja con flechas (patrón de radio de ARIA) y la elección se recuerda.

**Pendientes o riesgos:** **a consultar con Lourdes:** si quiere mantener esta sexta ruta.

## D-014 | 2026-11-18 | Verificación y diagnóstico

**Solicitado:** herramientas para verificar cada cambio (sección 10) y un modo de diagnóstico que Lourdes pueda usar sin instalar nada.

**Decisión y motivo:** `package.json` solo para desarrollo, con Playwright 1.65.1 y @axe-core/playwright 4.14.0. `npm run verificar` hace capturas, corre axe-core en español y revisa scroll horizontal, elementos cortados, áreas táctiles, consola, movimiento reducido, rayas largas y puntos medios. `?diagnostico=1` carga axe-core 4.10.2 desde jsDelivr (versión fija), solo con ese parámetro. `node_modules/` y `verificacion/` no se suben al repositorio.

**Archivos afectados:** `package.json`, `scripts/servidor.mjs`, `scripts/verificar.mjs`, `js/diagnostico.js`, `README.md`.

**Verificación realizada:** las URL de axe-core en jsDelivr responden (código 200).

**Pendientes o riesgos:** los estados simulados (`?simular=lento` y `?simular=error`) se suman al verificador en la etapa 2, junto con esos estados.

## D-015 | 2026-11-18 | Cierre de la etapa 1: verificación

**Solicitado:** verificar el producto completo antes de presentar la etapa 1 (sección 10).

**Decisión y motivo:** la etapa se presenta a Lourdes para su aprobación. El push a GitHub se hace después del OK (D-002).

**Archivos afectados:** todos los de la etapa 1. Ajustes hechos durante la verificación: ilustraciones de las tarjetas de módulo que no se veían, riel que se animaba al cargar cada página, barra superior en tablet (D-009), contraste de eventos pasados (D-010), nombres accesibles del avatar y de los días del mes, tabla por mes que no entraba en 360 px, lectura de colores en `estilos.html`.

**Verificación realizada:**
- `npm run verificar`: 156 capturas (13 pantallas, 6 anchos, claro y oscuro) y 156 análisis de axe-core. Sin problemas de axe, sin errores de consola, sin animaciones con "reducir movimiento", sin rayas largas ni puntos medios y con todas las áreas táctiles en regla (una excepción documentada en D-011). La tabla por mes que se cortaba en 360 px se corrigió y se confirmó con `npm run verificar:rapido` (todo en cero).
- Prueba con teclado (43 de 45 chequeos; los 2 restantes eran errores de la prueba, no del entorno): saltar al contenido, menú de usuario con flechas, Inicio, Fin y Escape; diálogo Nueva tarea con error, Escape y foco de vuelta; eliminar con confirmación y foco en la tarea siguiente; riel modal en tablet con Escape; hoja "Más" en mobile con foco atrapado; búsqueda con flechas y Enter.
- Persistencia: tareas propias, ruta, último módulo, tema, contraste y preferencia del riel se mantienen al recargar. Exportar descarga un JSON, Borrar vuelve al estado inicial e Importar lo restaura.
- `?diagnostico=1`: el panel carga axe-core, analiza la pantalla en español y abre la vista en 360, 768 y 1280 px.
- Revisión visual de capturas de inicio, recorrido, agenda, estilos y barra superior en todas las clases de ventana.

**Pendientes o riesgos:**
- Lo automático detecta solo una parte de los problemas: falta una prueba con lector de pantalla (NVDA en Windows) y con personas usuarias.
- Dos consultas para Lourdes: el título de la barra entre 600 y 680 px (D-009) y la sexta ruta "Taller completo" (D-013).
- Corregir la tabla de la paleta terciaria en el README del design system (D-004).

## D-016 | 2026-11-18 | Ancho de los textos explicativos

**Solicitado:** **Cambio:** los párrafos que explican algo (descripciones de tarjetas, textos de ayuda, estados vacíos, introducciones de sección) ocupan todo el ancho de su contenedor, en lugar de cortar la línea antes (en 48, 68 o 72 caracteres) y dejar un hueco a la derecha. **Alcance:** todas las pantallas, las 4 clases de ventana y los dos modos. **Motivo inferido:** el corte anticipado deja el texto desalineado con el resto del contenido de la tarjeta (chips, botones, barras) y genera cortes de línea innecesarios que dificultan la lectura. **Verificación:** que ninguna línea quede excesivamente larga en 1920 px.

**Decisión y motivo:** se quitó el ancho máximo de los párrafos. Para que las líneas no se vuelvan demasiado largas, lo que limita el ancho de lectura es el contenedor, no el párrafo: Ajustes (760 px), la página de cada módulo (880 px) y Ayuda (960 px, nuevo). Con el mismo criterio, el texto de las lecciones de la etapa 3 (el brief pide entre 60 y 75 caracteres por línea) se va a resolver con el ancho de la tarjeta de lectura, no con el del párrafo.

**Archivos afectados:** `css/components.css`, `css/layout.css`, `js/views/otras.js`, `estilos.html`.

**Verificación realizada:** `npm run verificar` completo (156 capturas, axe-core sin problemas, sin scroll ni elementos cortados). Revisión de capturas de Mi recorrido en 360, 768 y 1280 px.

**Pendientes o riesgos:** ninguno.

## D-017 | 2026-11-18 | Tarjeta "Tu ruta" en Mi recorrido

**Solicitado:** **Cambio:** rediseñar la tarjeta de la ruta en Mi recorrido. **Problemas que tenía:** el título repetía la palabra ruta ("Tu ruta: Ruta esencial"); un solo párrafo mezclaba qué incluye la ruta, el avance y una instrucción; las 6 rutas aparecían como chips sin explicar qué incluye cada una, así que se elegía a ciegas; y la leyenda de estados (Completado, En curso) estaba dentro de la tarjeta, aunque explica el mapa de módulos. **Alcance:** Mi recorrido, las 4 clases de ventana y los dos modos.

**Decisión y motivo:**
- **Encabezado:** "Tu ruta" como texto de apoyo y el nombre de la ruta como título, con el ícono de ruta en un contenedor `primary-container`.
- **Contenido:** qué incluye la ruta, en una oración, y el avance como dato destacado ("6 de 13 módulos completados") con su barra de progreso. En pantallas anchas, texto y avance van en dos columnas.
- **Cambiar de ruta:** botón tonal, como acción de la tarjeta (arriba a la derecha en tablet y desktop; abajo y a todo el ancho en mobile). Abre el diálogo "Elegí tu ruta" con las 6 rutas como lista de opciones, cada una con qué incluye y cuántos módulos tiene, y un texto que aclara que el progreso no se pierde. Cancelar y Elegir ruta; en mobile, diálogo de pantalla completa (patrón M3). Al elegir, aviso "Ruta cambiada".
- **Leyenda:** pasó fuera de la tarjeta, justo antes del mapa de módulos.
- "Cambiar de ruta" del menú del avatar abre directamente el mismo diálogo.
- Se corrigió también un error del prototipo: en mobile, el título del bloque se superponía con "4 de 4 módulos completados".

**Archivos afectados:** `js/views/recorrido.js`, `index.html` (diálogo), `css/layout.css`, `content/modulos.json` (descripciones de las rutas: "Los bloques..." en lugar de "Bloques...").

**Verificación realizada:** capturas en 360, 768 y 1280 px; diálogo con teclado (flechas entre opciones, Escape, foco de vuelta en "Cambiar de ruta"); `npm run verificar` completo sin problemas.

**Pendientes o riesgos:** sigue abierta la consulta de D-013 sobre la ruta "Taller completo".

## D-018 | 2026-11-18 | Secciones del riel: Aprender abierta en Inicio y comportamiento de acordeón

**Solicitado:** **Cambio:** (1) en Inicio, la sección Aprender del riel aparece desplegada; (2) al abrir una sección, se pliega la que estaba abierta, salvo la sección que contiene la página actual, que siempre queda abierta. **Alcance:** riel expandido en Large, riel modal en Medium y Expanded, y riel colapsado (los íconos de Recursos y Soporte expanden el riel con esa sección abierta). **Motivo inferido:** Inicio no pertenece a ninguna sección y el riel quedaba con todo plegado, sin mostrar el camino principal; y abrir varias secciones a la vez alarga el riel y diluye la ubicación.

**Decisión y motivo:** reemplaza en parte a la regla del brief: "La persona puede abrir otra sección a mano, pero eso no se recuerda". Se mantiene que no se recuerda; ahora, además, abrir una sección pliega las otras, salvo la activa. Tocar una sección abierta la pliega.

**Archivos afectados:** `js/shell.js`.

**Verificación realizada:** prueba automática de 9 casos (Inicio, Glosario y Agenda; desktop y tablet), todos correctos. Prueba de teclado completa (45 de 45).

**Pendientes o riesgos:** ninguno.
