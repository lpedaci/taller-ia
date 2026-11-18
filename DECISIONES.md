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
| D-007 | 2026-11-18 | Etapa 1: el inicio usa datos de ejemplo de `content/demo.json` | Reemplazada por D-024 |
| D-008 | 2026-11-18 | Niveles de competencia en la escala azul, sin terciaria | Vigente |
| D-009 | 2026-11-18 | Campo de búsqueda en la barra desde 1200 px; botón de búsqueda debajo | Vigente |
| D-010 | 2026-11-18 | Eventos que ya pasaron: se atenúan con color, no con opacidad | Vigente |
| D-011 | 2026-11-18 | Áreas táctiles de 48 px con extensión invisible; excepción en la grilla del mes | Vigente |
| D-012 | 2026-11-18 | Rutas por hash con el formato `#/seccion/parametros` | Vigente |
| D-013 | 2026-11-18 | Ruta "Taller completo" sumada a las rutas sugeridas | Vigente |
| D-014 | 2026-11-18 | Herramientas de verificación y modo `?diagnostico=1` | Vigente |
| D-015 | 2026-11-18 | Cierre de la etapa 1: verificación completa | Vigente |
| D-016 | 2026-11-18 | Los textos explicativos ocupan el ancho de su contenedor | Vigente |
| D-017 | 2026-11-18 | Tarjeta "Tu ruta" rediseñada, con diálogo para elegir la ruta | Vigente, ajustada por D-019 |
| D-018 | 2026-11-18 | Riel: Aprender abierta en Inicio y secciones en acordeón (reemplaza en parte una regla del brief) | Vigente |
| D-019 | 2026-11-18 | Tarjeta "Tu ruta": se quita la frase sobre la marca "En tu ruta" | Vigente |
| D-020 | 2026-11-18 | Bloque terminado en verde, con tilde y "Bloque completado" | Vigente |
| D-021 | 2026-11-18 | Mobile: módulos de cada bloque en un desplegable | Vigente |
| D-022 | 2026-11-18 | Etapa 1 aprobada y subida a GitHub | Vigente |
| D-023 | 2026-11-18 | Tokens de tamaño de componentes y barra superior equilibrada | Vigente |
| D-024 | 2026-11-18 | Estado real por defecto; datos de ejemplo solo con `?demo=1` | Vigente |
| D-025 | 2026-11-18 | Motor de lecciones por pasos, barra flotante, Escuchar y lección de prueba | Vigente |
| D-026 | 2026-11-18 | Doce tipos de actividad con feedback explicativo, borradores y layout para mobile | Vigente |
| D-027 | 2026-11-18 | Estados de carga, espera, error y sin conexión; video con fachada; eventos propios en la Agenda | Vigente |
| D-028 | 2026-11-18 | Componente de gráficos en SVG con paleta validada y tabla alternativa | Vigente |
| D-029 | 2026-11-18 | Guion de la animación piloto (predicción de tokens) | Vigente |
| D-030 | 2026-11-18 | Barra de la lección arriba del paso, fija debajo de la barra superior | Vigente |
| D-031 | 2026-11-18 | Motor de animaciones por escenas y animación piloto, pendiente de aprobación | Vigente |
| D-032 | 2026-11-18 | Alineación de actividades y orden de botones según el design system | Vigente |
| D-033 | 2026-11-18 | Cierre de la etapa 2: verificación completa | Vigente |

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

## D-019 | 2026-11-18 | Tarjeta "Tu ruta": sin la frase sobre la marca

**Solicitado:** **Cambio:** quitar de la tarjeta "Tu ruta" la oración "Los módulos de tu ruta llevan la marca 'En tu ruta'". **Motivo inferido:** repite lo que ya dice la leyenda que está justo debajo y alarga la descripción. **Alcance:** Mi recorrido, todos los anchos.

**Decisión y motivo:** la descripción queda en una sola oración: qué incluye la ruta. Ajusta D-017.

**Archivos afectados:** `js/views/recorrido.js`.

**Verificación realizada:** ver D-021.

**Pendientes o riesgos:** ninguno.

## D-020 | 2026-11-18 | Bloque terminado en verde

**Solicitado:** **Cambio:** cuando todos los módulos de un bloque están completos, el bloque se marca en verde. **Motivo inferido:** reconocer de un vistazo qué partes del recorrido ya están cerradas. **Alcance:** Mi recorrido, las 4 clases de ventana, modo claro y oscuro.

**Decisión y motivo:**
- El número del bloque se reemplaza por un tilde, sobre `app-color-success-container`.
- "N de N módulos completados" pasa a "Bloque completado", con ícono y texto en `app-color-success`.
- El verde es el color de estado positivo del sistema y siempre va con ícono y texto, nunca solo color.
- Las tarjetas de módulo completas siguen en azul (progreso), como pide el brief.
- Se cambió además la miniatura del bloque 7: era un tilde grande y se leía como "completado" en módulos sin empezar. Ahora es una forma abstracta.

**Archivos afectados:** `js/views/recorrido.js`, `js/views/piezas.js`, `css/layout.css`.

**Verificación realizada:** contraste AA del verde sobre las tarjetas en los 6 esquemas (axe-core sin problemas). Capturas en 360 y 1280 px, claro y oscuro.

**Pendientes o riesgos:** ninguno.

## D-021 | 2026-11-18 | Mobile: módulos de cada bloque en un desplegable

**Solicitado:** **Cambio:** en mobile (Compact, menos de 600 px), los módulos de cada bloque aparecen dentro de un desplegable. **Motivo inferido:** con 21 tarjetas a una columna, la pantalla se volvía muy larga y costaba ubicar un bloque. **Alcance:** solo Compact; desde 600 px los bloques se muestran abiertos, como antes.

**Decisión y motivo:**
- Cada bloque es una tarjeta cuyo encabezado entero es el botón: número (o tilde si está completo), nombre, avance y chevron. Mide 72 px de alto como mínimo.
- El botón lleva `aria-expanded` y `aria-controls`, y se usa con Enter o Espacio.
- Al entrar se abre solo el bloque del módulo en curso, para que "Continuar" y el recorrido coincidan. Lo que la persona abre o cierra se mantiene mientras navega, pero no se guarda.
- Si la ventana cruza los 600 px, la vista cambia sola entre desplegables y bloques abiertos.

**Archivos afectados:** `js/views/recorrido.js`, `css/layout.css`.

**Verificación realizada:**
- `npm run verificar` completo: 156 capturas, sin problemas de axe-core, sin scroll ni elementos cortados, sin errores de consola, áreas táctiles en regla.
- Prueba del desplegable: al entrar, el bloque 2 abierto y el resto cerrado; Enter y Espacio abren y cierran; en 1024 px no hay desplegables.
- Prueba de teclado del entorno (45 de 45) y del riel (9 de 9).

**Pendientes o riesgos:** ninguno.

## D-022 | 2026-11-18 | Etapa 1 aprobada

**Solicitado:** Lourdes aprobó la etapa 1 y pidió subirla a GitHub.

**Decisión y motivo:** push de la rama `main` a `github.com/lpedaci/taller-ia` (D-002). Para publicar el sitio falta activar GitHub Pages desde la configuración del repositorio (instrucciones en el README).

**Archivos afectados:** ninguno.

**Verificación realizada:** ver D-021.

**Pendientes o riesgos:** siguen abiertas las consultas de D-009 (título de la barra entre 600 y 680 px) y D-013 (ruta "Taller completo").

## D-023 | 2026-11-18 | Tamaños de componentes: tokens y barra superior equilibrada

**Solicitado:** **Cambio:** equilibrar los tamaños de la barra superior y fijarlos en el sistema de diseño. En mobile, el logo (32 px), el botón "Continuar" (40 px con ícono de 20), los íconos (24 en lugares de 48) y el avatar (40 px) no seguían una misma regla. Además, los espacios entre las acciones no eran parejos. En desktop, el buscador medía 56 px al lado de controles de 40, y el botón "Menú" del riel quedaba 8 px más abajo que la línea de la barra. **Alcance:** barra superior y riel en las 4 clases de ventana; modo claro y oscuro.

**Decisión y motivo:**
- Se agregaron tokens de tamaño de componentes en `css/components.css` (`css/tokens.css` no tiene esa familia y no se edita a mano): `--app-size-target` (48), `--app-size-control` (40), `--app-size-icon` (24), `--app-size-icon-sm` (20), `--app-size-avatar` (32), `--app-size-avatar-lg` (40) y `--app-size-brand` (32).
- Regla del sistema: todo elemento interactivo ocupa un lugar de 48 px y lo visible se centra adentro.
- Mobile:
  - "Continuar" es un botón relleno de 40 px con ícono de 24, centrado en su lugar de 48;
  - el avatar mide 32 px (medida de M3 para la barra superior);
  - las acciones van una al lado de la otra, sin espacio extra;
  - el logo y el avatar quedan a 16 px de cada borde.
- Desktop:
  - el buscador mide 48 px;
  - el botón "Menú" del riel queda centrado en la misma línea que la barra (32 px desde arriba), sin cambiar la geometría del resto del riel;
  - el avatar del menú de usuario mide 40 px.
- Los tamaños se muestran en `estilos.html`, sección "Tamaños de componentes".

**Archivos afectados:** `css/components.css`, `css/layout.css`, `estilos.html`.

**Verificación realizada:**
- Medición en 360 y 1280 px: todos los elementos de la barra centrados en y = 32 px; 24 px entre el buscador y "Continuar".
- `npm run verificar` completo sin problemas (156 capturas).
- Teclado 45 de 45 y riel 9 de 9.

**Pendientes o riesgos:** ninguno.

## D-024 | 2026-11-18 | Etapa 2, parte 1: estado real y modo de ejemplo

**Solicitado:** reemplazar los datos de ejemplo del inicio por el progreso real de la persona (etapa 2, D-007), sin perder la posibilidad de revisar el diseño con datos.

**Decisión y motivo:**
- Por defecto, todo sale de lo que la persona completa y produce: pasos, actividades, evidencias y tareas propias. Para quien recién empieza, cada panel tiene su estado vacío con la primera acción:
  - Continuar donde dejaste: "Empezar el Módulo 0".
  - Competencias: una línea que explica cómo se calcula el nivel.
  - Objetivos y evidencias: para qué sirven y dónde se completan.
- La acción principal de la barra dice "Empezar: Módulo 0" hasta que hay progreso; después, "Continuar: Módulo X" y lleva al último paso visitado.
- Sin nombre, el avatar muestra un ícono de persona. En Ajustes se puede cargar el nombre (opcional), que se usa en el saludo, el avatar y, más adelante, el certificado. Las iniciales son la primera letra del primer y del último nombre.
- Modo de ejemplo: con `?demo=1` el entorno muestra los datos del prototipo (`content/demo.json`) para revisar el diseño. Lo que se hace en ese modo se guarda aparte (`tia.estado-demo`), no se mezcla con el progreso real y no se exporta. El pie con "los datos de esta pantalla son de ejemplo" aparece solo en ese modo.
- El progreso guardado en la etapa 1 (datos de ejemplo) se descarta: el estado pasó a la versión 2.

**Archivos afectados:** `js/state.js`, `js/shell.js`, `js/app.js`, `js/views/inicio.js`, `js/views/aprendizaje.js`, `js/views/piezas.js`, `js/views/otras.js`.

**Verificación realizada:** prueba automática del recorrido real: Empezar, Continuar, progreso por paso, módulo completado, persistencia al recargar, separación con el modo de ejemplo y nombre en Ajustes. `npm run verificar:rapido` sin problemas.

**Pendientes o riesgos:** sin cohorte, la agenda queda vacía; la opción de agregar eventos propios desde ese estado vacío se suma en la parte 3 (estados).

## D-025 | 2026-11-18 | Etapa 2, parte 1: motor de lecciones

**Solicitado:** el motor que muestra cada lección por pasos (sección 4: "Paso 3 de 7", Anterior y Siguiente, Escuchar) con contenido separado del código (sección 6).

**Decisión y motivo:**
- **Contenido:** cada módulo es un archivo `content/modulo-XX.json` con objetivos y pasos. Cada paso indica su momento de Gagné y una lista de bloques. Bloques de esta parte: texto (Markdown mínimo, con términos del glosario y etiqueta "En inglés"), nota de estado, objetivos, cita traducida y "Para profundizar". En `modulos.json`, `"leccion": true` indica qué módulos ya tienen lección; los demás muestran "Lección en preparación" sin pedir el archivo.
- **Rutas:** `#/modulo/N/paso/M`. `#/modulo/N` lleva al primer paso sin completar.
- **Pantalla:**
  - encabezado con bloque, título y "Paso N de M" con su barra;
  - el paso en una tarjeta de lectura de hasta 760 px (D-016);
  - índice del módulo al costado desde 840 px, y debajo de la lección en pantallas más chicas.
- **Barra flotante** (M3 *floating toolbar*): Anterior, Escuchar y Siguiente. En mobile, Anterior y Escuchar van solo con ícono y conservan su nombre accesible. En el último paso, "Terminar módulo".
- **Progreso:** un paso se completa al avanzar desde él. Terminar el módulo muestra una insignia con cambio de forma (M3 Expressive) y las acciones "Ir al módulo siguiente", "Volver a Mi recorrido" y "Repasar".
- **Transición:** entre pasos, la transición muestra la dirección (View Transitions API). Con "reducir movimiento" el cambio es instantáneo. El foco va al título del paso nuevo.
- **Escuchar:** lee el paso con la voz del navegador. Elige una voz en español (prioriza es-AR y es-419) y avisa si no hay. Tiene pausar, seguir, velocidad (1; 1,25; 1,5 y 0,75) y detener. Lee por oraciones, para no cortarse en textos largos.
- **Lección de prueba** (`#/modulo/prueba`): muestra cada bloque con contenido de ejemplo y no cuenta para el progreso. Sus dos enlaces de "Para profundizar" se verificaron (Elements of AI y la guía de prompts de Anthropic, código 200).

**Archivos afectados:** `js/lesson/leccion.js`, `js/lesson/bloques.js`, `js/lesson/markdown.js`, `js/escuchar.js`, `css/lesson.css`, `content/modulo-prueba.json`, `index.html`, `estilos.html`, `scripts/verificar.mjs`.

**Verificación realizada:**
- Prueba automática del motor: 20 de 20, sin errores de consola.
- Con teclado: Tab hasta Siguiente y Enter avanza; el foco va al título del paso.
- `npm run verificar:rapido` sin problemas: 96 capturas, ahora con la lección, el cierre del módulo y el modo de ejemplo.

**Pendientes o riesgos:** el enlace de UNESCO que se probó para la lección de prueba no respondió (tiempo agotado) y no se usó; se revisa en la etapa 3. La lectura en voz alta depende de las voces instaladas en cada dispositivo; conviene probarla en el celular de Lourdes.

## D-026 | 2026-11-18 | Etapa 2, parte 2: actividades

**Solicitado:** los tipos de actividad de la sección 6, configurables desde el contenido, accesibles por teclado y con layout propio en mobile. Feedback inmediato que siempre explica por qué. Microevaluaciones con reintento.

**Decisión y motivo:**
- **Doce actividades nuevas**, registradas como tipos de bloque de la lección:
  - **Evaluadas:** opción múltiple, verdadero o falso con justificación, clasificador, marcar errores en un texto y escenario ramificado.
  - **De producción:** constructor guiado (prompt, prompt visual y brief), reflexión para el diario, comparador antes y después, tabla comparativa editable, constructor de flujos, storyboard y mapa de impactos.
  - La cita traducida ya estaba (D-025). El video con fachada va en la parte 3 y la animación por escenas, en la parte 5.
- **Marco común:** tipo de actividad, título, consigna, cuerpo y una zona de feedback que se anuncia a los lectores de pantalla. El feedback por ítem lleva ícono y texto ("Correcto." o "Revisalo.") y nunca depende solo del color.
- **Evaluadas:**
  - "Comprobar" pide completar lo que falta y lleva el foco ahí.
  - Después muestra el puntaje ("2 de 3"), la explicación de cada ítem y "Reintentar".
  - Marcar errores distingue los errores encontrados, los que faltaron y las partes marcadas que estaban bien.
  - El escenario muestra la consecuencia de cada decisión, el camino recorrido y un final con su tono.
- **Arrastrar sin depender del arrastre:** el clasificador se puede usar arrastrando con el mouse o con el selector "Mover a" en cada tarjeta, que funciona con teclado y en pantallas táctiles.
- **Producción:**
  - Lo que se escribe se guarda como borrador mientras se escribe.
  - El constructor arma el texto en vivo con una plantilla del contenido y omite las líneas vacías.
  - Tiene "Copiar", "Abrir en" Claude, ChatGPT, Gemini o Copilot (copia y abre la web, sin API) y "Guardar en Mis prompts".
  - El brief se descarga como `.md`.
  - El flujo revisa que empiece con un disparador y que haya una persona que revise después de la IA, y se descarga como diagrama `.svg`.
  - El storyboard se imprime o se guarda como PDF, solo él.
  - El mapa ofrece "Ideas para comparar", sin una única respuesta correcta.
- **Resultados:** en las lecciones reales, cada resultado alimenta las competencias (por objetivo), el registro de actividad y las evidencias del portafolio. La reflexión se guarda en el diario y los prompts, en Mis prompts. En la lección de prueba todo queda en memoria y no cuenta.
- **Mis prompts:** muestra la lista real, con copiar y eliminar (con confirmación). La exportación en Markdown y JSON llega con el Módulo 5 (etapa 4).
- **Mobile:**
  - la tabla se convierte en tarjetas por fila;
  - el clasificador, el mapa y el storyboard pasan a una columna;
  - las actividades usan container queries, así se adaptan al ancho de la lección y no solo al de la ventana.
- **Barra flotante:** con `scroll-padding`, el foco nunca queda debajo de la barra (WCAG 2.4.11).
- **Enlaces "Abrir en":** verificados el 2026-11-18 (código 200). Copilot redirige a copilot.com. Pasan a `content/herramientas.json` en la etapa 6.

**Archivos afectados:** `js/activities/comun.js`, `js/activities/evaluadas.js`, `js/activities/produccion.js`, `css/activities.css`, `js/state.js` (diario, prompts, evidencias y borradores), `js/views/otras.js` (Mis prompts), `js/app.js`, `content/modulo-prueba.json`, `scripts/verificar.mjs`, `README.md`, `index.html`, `estilos.html`.

**Verificación realizada:**
- Prueba de cada actividad en 1280, 768 y 360 px: 43 chequeos en cada ancho, más axe-core después de interactuar, con el feedback a la vista. Todo correcto. Arrastrar y soltar se comprobó con un movimiento real del mouse; el atajo de arrastre de la herramienta de prueba no dispara los eventos.
- `npm run verificar` completo: 276 capturas (20 pantallas, ahora con cada paso de actividades), sin problemas.
- Teclado del entorno 45 de 45 y riel 9 de 9.

**Pendientes o riesgos:** los contenidos de la lección de prueba son ejemplos; los textos reales de cada actividad se escriben en las etapas 3 a 8. En las capturas de página completa, el clasificador ocupa bastante alto en desktop con riel expandido (columnas apiladas, porque la lección mide unos 600 px): queda para revisar con contenido real.

## D-027 | 2026-11-18 | Etapa 2, parte 3: estados, video con fachada y eventos propios

**Solicitado:** los estados de carga, espera, error, sin conexión y vacíos de la sección 4, con el parámetro `?simular=` para revisarlos; el componente de video con fachada y `videos.json`; y la opción de agregar eventos propios en la Agenda sin cohorte (pendiente de D-024).

**Decisión y motivo:**
- **Primera carga:** la pantalla de inicio (nombre del taller e indicador lineal) aparece solo si la carga tarda más de 300 ms. A los 3 s el mensaje pasa a "Ya casi está"; a los 10 s ofrece Reintentar. Nunca se agrega una espera artificial.
- **Lección:** mientras carga, *skeleton* con la forma real de la lección y un mensaje ("Preparando la lección: pasos y actividades") que se actualiza a los 3 s y a los 10 s ofrece volver a Mi recorrido. Si falla, una tarjeta de error explica qué pasó, que el progreso no se pierde, y ofrece Reintentar o volver.
- **Contenido largo** (Mi aprendizaje, Biblioteca, Glosario, Mis prompts): *skeleton* de tarjetas con mensaje. Hoy carga al instante; se ve con `?simular=lento`.
- **Proceso con duración conocida:** diálogo con barra determinada, porcentaje y "Paso N de M: qué se está haciendo". Se usa al exportar el progreso. Como hoy es instantáneo, se ve con `?simular=lento`; se va a usar de verdad al generar el portafolio y el certificado.
- **Guardado automático:** indicador discreto "Guardado" en cada actividad, sin mover el foco.
- **Sin conexión:** aviso al perder y recuperar la conexión. Si un video no puede cargar, el marco dice "Este video necesita conexión" y la lección sigue con el resumen en español.
- **Parámetro de desarrollo:**
  - `?simular=lento`: las demoras se aplican solo con este valor;
  - `?simular=error`: falla la carga inicial;
  - `?simular=error-leccion`: falla solo la lección (se separó para poder ver ese estado dentro del entorno);
  - `?simular=sin-conexion`.
- **Accesibilidad:** contenedores con `aria-busy` mientras cargan, mensajes de progreso con `role="status"` y errores con `role="alert"`. Al terminar, el foco va al contenido nuevo.
- **Video con fachada:**
  - Portada propia, hecha con los tokens: antes del clic no se pide nada a YouTube (ni miniatura), así no se cargan rastreadores.
  - Al hacer clic se inserta `youtube-nocookie.com` con subtítulos en español cuando existen, y un indicador con mensaje ("Cargando el video de 3Blue1Brown, en inglés, 8 min") que a los 10 s ofrece abrirlo en YouTube.
  - Lleva pregunta guía antes, etiquetas "En inglés", subtítulos y duración, título original con su `lang`, referencia APA, resumen propio en español y preguntas después (con la actividad de opción múltiple).
- **Video verificado y registrado en `content/videos.json`:** "Large Language Models explained briefly", de 3Blue1Brown (canal oficial). Dura 7 min 58 s, se puede insertar y tiene subtítulos en español hechos por personas. Se verificó con oEmbed de YouTube y con los datos de la página del video el 2026-11-18. Está en la lección de prueba y es candidato para el Módulo 2.
- **Agenda sin cohorte:** estado vacío "Tu agenda está vacía" con "Agregar evento". El diálogo pide nombre (obligatorio, con error en el campo), tipo, fecha y horario, y es de pantalla completa en mobile. Los eventos propios llevan la etiqueta "Propio" y se pueden eliminar con confirmación. En el inicio, el panel de agenda vacío también ofrece "Agregar evento".
- **`estilos.html`:** suma la sección "Estados de carga, espera y error", con enlaces para forzar cada estado.

**Archivos afectados:** `js/estados.js`, `js/activities/video.js`, `css/estados.css`, `content/videos.json`, `content/modulo-prueba.json` (paso de video), `js/app.js`, `js/lesson/leccion.js`, `js/activities/comun.js`, `js/state.js` (videos y eventos propios), `js/views/agenda.js`, `js/views/inicio.js`, `js/shell.js`, `index.html`, `estilos.html`, `scripts/verificar.mjs`.

**Verificación realizada:**
- Prueba automática de estados: 24 de 24, sin errores de JavaScript. Cubre pantalla de inicio solo si tarda, mensaje a los 3 s, error inicial y de lección, lección lenta, video sin conexión, ningún pedido a YouTube antes del clic, iframe de youtube-nocookie con subtítulos, preguntas después del video, Agenda vacía, crear y eliminar evento con foco y errores, proceso determinado con `aria-valuenow` y descarga final, e indicador de guardado.
- Prueba de actividades sin cambios (todo correcto).
- `npm run verificar` completo: 336 capturas (28 pantallas, ahora con la Agenda vacía, los estados de error, sin conexión y el paso de video). Encontró dos problemas, ya corregidos: en modo oscuro el botón Reintentar del video sin conexión tenía poco contraste (pasó a colores inversos) y el título del resumen del video saltaba un nivel de encabezado (pasó a h4). Después, `npm run verificar:rapido` sin problemas.
- La verificación completa tarda unos 11 minutos; para cambios chicos alcanza con `npm run verificar:rapido` (unos 5 minutos).

**Pendientes o riesgos:**
- El contador de eventos de hoy en el riel se calcula al cargar la página: si se agrega un evento para hoy, se actualiza al recargar.
- La descarga de la Agenda en `.ics` queda para la etapa 9 (transversales).

## D-028 | 2026-11-18 | Etapa 2, parte 4: componente de gráficos

**Solicitado:** el componente de gráficos de la sección 5: SVG propio, título, unidad, fuente, leyenda solo con más de una serie, etiquetas directas, alternativa en tabla, colores de los tokens validados en los dos modos, contraste 3:1 y versión simplificada en mobile.

**Decisión y motivo:**
- **Método:** se siguió la skill de visualización de datos instalada (D-005): forma según la pregunta, color al final, paleta validada con su script y no a ojo.
- **Formas:**
  - Barras para comparar. Siempre horizontales: los nombres largos (bloques, competencias) se leen bien y en mobile no hay que girar nada.
  - Líneas para evolución.
  - Mancuernas para el antes y el después (el autodiagnóstico de los Módulos 0 y 20).
  - No hay tortas ni efectos 3D.
- **Paleta categórica en orden fijo** (nunca se recorre en ciclo): azul, naranja, violeta y verde.
  - En modo claro son los mismos valores de los tokens (`primary` y los acentos de los eventos).
  - En modo oscuro, los acentos de los tokens fallaban (demasiado claros y apagados para un gráfico). Se generaron los tonos 57 de las mismas paletas con `@material/material-color-utilities`, la librería oficial que generó los tokens, instalada solo para desarrollo.
  - El orden se eligió para que el verde no quede al lado del naranja: juntos, quedaban en el mínimo para daltonismo.
  - Resultado del validador: todo aprobado en los dos modos, sobre el color de la tarjeta. Los valores están en `css/charts.css` como `--app-chart-1` a `--app-chart-4`.
- **Marcas:**
  - barras de 16 px con la esquina redondeada solo en el extremo del dato;
  - líneas de 2 px;
  - en las mancuernas, "antes" es un anillo neutro y "después" un punto de color, así no dependen solo del color;
  - grilla y ejes recesivos;
  - el texto siempre con los colores de texto, nunca con el de la serie;
  - etiquetas directas selectivas: el valor al final de cada barra y solo el último punto de cada línea.
- **Interacción:** detalle al pasar el cursor por cada barra o fila, y en las líneas una guía vertical con todas las series de esa semana.
- **Accesibilidad:**
  - el SVG tiene `role="img"` y un resumen que remite a la tabla;
  - "Ver como tabla" muestra los mismos datos;
  - la leyenda aparece solo con más de una serie;
  - con "reducir movimiento" los datos aparecen sin animación.
- **Mobile:** el nombre de cada categoría va arriba de su barra, la grilla se dibuja solo en la franja de cada barra, el eje de las líneas muestra solo las etiquetas que entran sin pisarse, y el gráfico se redibuja al cambiar el ancho.
- **Escalas fijas:** con una escala corta (como de 1 a 5) se marca cada entero; las mancuernas aceptan un mínimo distinto de 0.
- **Carga:** con `?simular=lento` se ve el *skeleton* con la forma del gráfico antes de los datos.
- **Dónde se ve:** un paso nuevo de la lección de prueba ("Gráficos", con tres ejemplos marcados como "datos de ejemplo") y la sección "Gráficos" de `estilos.html`. En Mi aprendizaje se suma cuando haya datos reales del autodiagnóstico (etapas 3 y 8).

**Archivos afectados:** `js/charts.js`, `css/charts.css`, `content/modulo-prueba.json`, `estilos.html`, `index.html`, `js/lesson/leccion.js`, `package.json` (dependencia de desarrollo), `scripts/verificar.mjs`.

**Verificación realizada:**
- Prueba de gráficos: 8 de 8. Cubre `role="img"` con resumen, tabla en cada gráfico, detalle en barras y líneas, leyenda solo con más de una serie, redibujo al cambiar el ancho y ningún error.
- Capturas en 1280 y 360 px, claro y oscuro. A partir de ellas se corrigieron la escala de 1 a 5, las etiquetas del eje que se pisaban y la grilla que cruzaba los nombres en mobile.
- Pruebas de actividades y estados sin cambios. `npm run verificar` completo: 348 capturas (29 pantallas, ahora con el paso de gráficos), sin problemas de axe-core, sin scroll, sin errores de consola, sin animaciones con movimiento reducido y con las áreas táctiles en regla.

**Pendientes o riesgos:** ninguno.

## D-029 | 2026-11-18 | Etapa 2, parte 5: guion de la animación piloto

**Solicitado:** escribir primero el guion y el storyboard de la animación piloto (cómo un modelo predice el próximo token) y anotar en este registro qué se va a animar, antes de construirla (sección 5, "Proceso").

**Decisión y motivo:** el guion está en `animaciones/guiones/01-prediccion-de-tokens.md`. Sigue un caso concreto: Ana le pide a un asistente, a las 23:40, que la ayude a avisarle a su jefa que mañana llega tarde porque tiene turno con el médico. Son 5 escenas en unos 80 segundos:

1. el mensaje a las 23:40;
2. el asistente lee en fragmentos (tokens);
3. la respuesta empieza a escribirse, con la probabilidad de cada continuación (valores ilustrativos, y la pantalla lo dice);
4. elige, suma y vuelve a calcular, hasta completar el mensaje;
5. otra versión de la respuesta, y una tercera que inventa "un paro de colectivos" que nadie mencionó ("Probable no es lo mismo que verdadero").

Cada escena tiene texto en pantalla, qué se mueve, narración y descripción para lectores de pantalla. También están definidos los controles, la versión fija para "reducir movimiento", el diseño con los tokens y el proceso para el MP4 de facilitadores.

**Archivos afectados:** `animaciones/guiones/01-prediccion-de-tokens.md`.

**Verificación realizada:** revisión del texto: voseo moderado, sin rayas largas ni puntos medios, sin personajes ni metáforas de robots.

**Pendientes o riesgos:** **la animación y su motor por escenas se construyen después de que Lourdes apruebe el guion.** El MP4 se genera cuando apruebe la animación terminada.

## D-030 | 2026-11-18 | Barra de la lección arriba del paso

**Solicitado:** **Cambio:** ubicar la barra flotante de la lección (Anterior, Escuchar y Siguiente) arriba de la tarjeta del paso, en lugar de al pie. **Motivo inferido:** al pie, la barra cambiaba de lugar según el largo de cada paso (en los pasos cortos subía junto con el contenido) y había que buscarla cada vez. **Alcance:** lecciones, las 4 clases de ventana y los dos modos.

**Decisión y motivo:** la barra va entre el encabezado de la lección y el paso, y queda fija debajo de la barra superior al hacer scroll. Así está siempre en el mismo lugar y visible. Para que el foco nunca quede tapado por las dos barras fijas (WCAG 2.4.11), `scroll-padding-top` pasó a 152 px (144 px en mobile).

**Archivos afectados:** `js/lesson/leccion.js`, `css/lesson.css`.

**Verificación realizada:** capturas en 1280 y 390 px con scroll: la barra queda fija debajo de la barra superior. `npm run verificar:rapido` sin problemas (174 capturas) y prueba del motor de lecciones completa.

**Pendientes o riesgos:** ninguno.

## D-031 | 2026-11-18 | Etapa 2, parte 5: motor de animaciones y animación piloto

**Solicitado:** construir el motor de animaciones explicativas por escenas y la animación piloto (cómo un asistente escribe prediciendo el próximo token), según el guion de D-029, para que Lourdes la revise antes de producir las demás.

**Decisión y motivo:**
- **Contenido separado del dibujo:**
  - los textos de cada escena (texto en pantalla, narración, descripción y duración) y los datos del ejemplo están en `content/animaciones/prediccion-tokens.json`;
  - el dibujo está en `js/animaciones/prediccion-tokens.js`. Cada escena devuelve una función que dibuja su estado para un avance de 0 a 1. Así se puede pausar, saltar de escena y, más adelante, grabar el MP4 cuadro a cuadro.
- **Reproductor:**
  - Reproducir y pausar, escena anterior y siguiente, una barra dividida en 5 escenas que también sirve para saltar, velocidad (0,75; 1 y 1,25) y "Narración" con la voz del navegador.
  - Con narración, cada escena espera a que termine de hablar antes de pasar a la siguiente.
  - No empieza sola y no se repite en bucle: al final ofrece "Ver de nuevo".
  - Antes de reproducir, se ve la primera escena completa como portada.
  - Al saltar de escena en pausa, la escena se muestra completa.
- **Accesibilidad:**
  - el SVG tiene `role="img"` y su nombre es el título más la descripción de la escena actual;
  - la descripción se anuncia al cambiar de escena (`aria-live="polite"`);
  - la transcripción completa está debajo;
  - todos los controles funcionan con teclado y tienen área táctil de 48 px;
  - con "reducir movimiento", se muestran las escenas fijas y completas, con las flechas para avanzar y sin reproducción.
- **Diseño:** usa los tokens del sistema, así que funciona en modo claro y oscuro. El lienzo es horizontal (16:9) cuando el reproductor mide 600 px o más, y vertical (4:5) en pantallas angostas, con la letra más grande. El movimiento usa curvas que aproximan los springs de M3.
- **Dónde se ve:** un paso nuevo de la lección de prueba ("Una animación para explicar"). Una vez aprobada, va al Módulo 2.
- **Ajustes después de revisar las capturas:** los recuadros de los tokens se pisaban (más separación entre filas y columnas); el espacio por completar quedaba fuera de la burbuja; el ícono de advertencia salía como texto; la letra del lienzo horizontal era chica; el movimiento de los dos pedazos de "médico" pisaba a los vecinos y se reemplazó por la nota "una palabra, dos fragmentos".

**Archivos afectados:** `js/animacion.js`, `js/animaciones/prediccion-tokens.js`, `content/animaciones/prediccion-tokens.json`, `css/animacion.css`, `content/modulo-prueba.json`, `js/lesson/leccion.js`, `index.html`, `estilos.html`, `scripts/verificar.mjs`.

**Verificación realizada:**
- Prueba del reproductor: 16 de 16. Cubre portada, reproducir, pausar, foco, velocidad, escena anterior y siguiente, salto desde la barra, descripción anunciada, transcripción, nombre accesible, "Ver de nuevo" al final, teclado, versión fija con movimiento reducido y ningún error.
- Capturas de las 5 escenas en 390, 1280 y 1600 px, en claro y oscuro, terminadas y a mitad del movimiento.
- `npm run verificar` completo: ver D-033.

**Pendientes o riesgos:** **la animación espera la aprobación de Lourdes.** Después: llevarla al Módulo 2, generar el MP4 con subtítulos para facilitadores y producir las otras nueve animaciones con el mismo motor.

## D-032 | 2026-11-18 | Alineación de actividades según el design system

**Solicitado:** **Cambio:** corregir desalineaciones en las actividades y ordenar los botones por prioridad, según el design system. Problemas señalados:
- en el clasificador, los selectores "Mover a" quedaban a distinta altura según el largo del texto de cada tarjeta;
- en el comparador, los títulos de los paneles tenían un espacio de más arriba;
- en el constructor de flujos, el selector de tipo no alineaba con los botones de ícono;
- las filas de botones no seguían un orden ni una alineación común.

**Alcance:** todas las actividades, las 4 clases de ventana y los dos modos.

**Decisión y motivo:**
- **Clasificador:** cada tarjeta es una columna con el selector anclado abajo; en una misma fila, los selectores quedan a la misma altura.
- **Títulos de nivel 5 y 6:** el reset de márgenes del sistema cubría solo de h1 a h4, así que los títulos de los paneles (h5) tenían el margen por defecto del navegador. El reset ahora incluye h5 y h6. Corrige el comparador y los encabezados de las columnas del clasificador.
- **Campos:** 56 px de alto, como indica el design system para todos los campos. Se aplicó a los selectores del clasificador y del flujo, y al campo del mapa de impactos. Quedan centrados con los botones de ícono de 48 px.
- **Botones** (design system, Button y Dialog):
  - el ancho sigue al contenido (la única excepción sigue siendo "Agregar tarea");
  - las acciones van alineadas al final;
  - hay un solo botón relleno por actividad, ubicado último, a la derecha; antes quedan las acciones de menor prioridad.
- **Orden resultante:**

| Actividad | Orden (de izquierda a derecha) |
|---|---|
| Constructor de prompt | Vaciar, Completar con el ejemplo; abajo: Abrir en Claude, ChatGPT, Gemini o Copilot, Copiar |
| Brief | Vaciar, Completar con el ejemplo; abajo: Copiar, Descargar |
| Constructor de flujos | Descargar diagrama, Agregar paso, Revisar mi flujo |
| Storyboard | Imprimir o guardar como PDF, Agregar escena |
| Mapa de impactos | Ver ideas para comparar, Guardar mapa |
| Error de lección | Volver a Mi recorrido, Reintentar |
| Comparador | "Ver qué cambió y por qué" alineado a la derecha |
| Ajustes, Tus datos | Borrar mis datos, Importar progreso, Exportar mi progreso |
| Mis prompts | Eliminar, Copiar |
| Cierre del módulo | Repasar desde el principio, Volver a Mi recorrido, Ir al módulo siguiente |

**Archivos afectados:** `css/components.css`, `css/activities.css`, `css/layout.css`, `js/activities/produccion.js`, `js/lesson/leccion.js`, `js/views/otras.js`, `estilos.html`.

Se revisaron todas las filas de botones del sitio. Las filas con una sola acción visible (Comprobar o Reintentar, Continuar, Guardar) y la navegación (Anterior y Siguiente, módulo anterior y siguiente) ya cumplían la regla.

**Verificación realizada:**
- Medición de la posición de los selectores del clasificador en 1440, 1280 y 390 px: alineados en cada fila.
- Capturas de los pasos de actividades en 1440, 1280 y 390 px.
- Pruebas de actividades, estados, gráficos y animación sin cambios.
- `npm run verificar` completo: ver el resultado al cierre de la etapa 2 (D-033).

**Pendientes o riesgos:** ninguno.

## D-033 | 2026-11-18 | Cierre de la etapa 2: verificación

**Solicitado:** verificar el producto completo antes de presentar la etapa 2 (motor de lecciones, actividades, estados, video, gráficos y animación piloto).

**Decisión y motivo:** la etapa 2 se presenta a Lourdes. Queda pendiente su aprobación de la animación piloto (D-031) antes de producir las demás y de pasar a la etapa 3.

**Archivos afectados:** todos los de la etapa 2.

**Verificación realizada:**
- `npm run verificar` completo: 360 capturas (30 pantallas, 6 anchos, claro y oscuro), sin problemas de axe-core, sin scroll horizontal, sin errores de consola, sin animaciones con movimiento reducido y sin rayas largas ni puntos medios. Encontró un problema, ya corregido: en mobile, los botones de las escenas de la animación medían 40 px de ancho; ahora la barra de escenas va en su propia fila. Después, `npm run verificar:rapido` sin problemas (180 capturas).
- Pruebas automáticas:
  - teclado del entorno: 45 de 45;
  - riel: 9 de 9;
  - motor de lecciones: completo;
  - actividades en 1280, 768 y 390 px: completas (arrastrar y soltar se comprobó con un movimiento real del mouse);
  - estados: 24 de 24;
  - gráficos: 8 de 8;
  - reproductor de la animación: 16 de 16.

**Pendientes o riesgos:**
- Lo automático detecta solo una parte de los problemas de accesibilidad: falta probar con un lector de pantalla (NVDA en Windows) y con personas usuarias.
- Consultas abiertas: D-009 (título de la barra entre 600 y 680 px) y D-013 (ruta "Taller completo").
