# Taller - IA

Design system del entorno de aprendizaje del Taller - IA, construido con la metodología de **Material Design 3 Expressive** de Google. Autora: Lourdes Pedaci, Experience Designer.

Es un entorno académico y profesional para personas adultas de Argentina y LATAM. Se usa en mobile, tablet y desktop, en modo claro y oscuro, y solo en español.

## Cómo usar este sistema

- **Los valores salen de los tokens:** color, tipografía, forma, espaciado, elevación y movimiento. No se usan colores ni medidas sueltas en el código.
- **Los nombres de los tokens son los de M3:** `--md-sys-color-*`, `--md-sys-shape-corner-*` y `--md-sys-typescale-*`. Los tokens propios del taller llevan el prefijo `--app-*`.
- **El color no se edita a mano.** Se generó con `@material/material-color-utilities`, el mismo método de Material Theme Builder: color semilla `#1F5FA8`, esquema **Vibrant**, contraste estándar y alto. Para cambiar la paleta, se cambia la semilla y se regenera.
- **Cuando una decisión de diseño no está acá,** se sigue la documentación oficial de m3.material.io y se registra en `DECISIONES.md`.

## Principios

1. **Claridad antes que decoración.** Cada elemento ayuda a aprender o a orientarse. Lo expresivo de M3 (formas, movimiento, color) se usa para jerarquizar y dar feedback, no para adornar.
2. **El criterio humano en el centro.** El tono es sobrio y académico, y le habla a una persona adulta que decide por sí misma.
3. **Medir lo que se aprende, no el tiempo.** Se muestran objetivos demostrados, evidencias y competencias. Nunca horas en la plataforma, rachas ni días de inactividad.
4. **Accesible por defecto:** WCAG 2.2 AA en los dos modos, teclado completo, movimiento reducido y lectura en voz alta.

## Contenido y voz

- **Idioma:** español, con voseo rioplatense moderado y registro académico profesional, comprensible en toda LATAM. Se evitan los modismos muy locales.
- **Signos y separadores:**
  - No se usa raya larga (em dash).
  - No se usa "·" como separador. En títulos y etiquetas va "|" (por ejemplo, "Bloque 2 | Módulo 6"); en texto corrido, comas o puntos.
- **Cantidades:** "6 de 21", no "6/21", porque se lee mejor y suena natural en lectores de pantalla.
- **Mensajes de espera:** dicen qué se está haciendo. Ejemplo: "Preparando tu panel: módulos, agenda y registro de actividad".
- **Sin culpa ni presión:** nunca "perdiste tu racha" ni "hace 3 días que no entrás".
- **Contenido de otro idioma:**
  - Se traduce, con la traducción oficial si existe.
  - Las citas textuales muestran el original debajo, en tamaño chico.
  - Los términos técnicos van en español con el original entre paréntesis y en cursiva la primera vez.
- **Firma:** "Lourdes Pedaci. Experience Designer, Lic. en Tecnología Educativa, Prof. de Informática."

## Fundamentos visuales

### Color

**La paleta**
Se generó con `@material/material-color-utilities`, el método de Material Theme Builder, a partir de la semilla **`#1F5FA8`** con el esquema **Vibrant**. Se hizo un ajuste: la paleta **secundaria** usa el mismo tono (hue) que la semilla, con croma bajo, para que toda la selección quede en la familia azul. Además, las **superficies** (fondo, tarjetas, navegación) usan una paleta neutra de croma 4, casi gris, para que el azul funcione como acento y no como ambiente. La **terciaria** es un tono cálido "miel" (tono HCT 75, croma 28): se usa con moderación para lo relacionado con el tiempo (agenda, pendientes, próximo cierre) y el avatar. Se eligió ese tono para que no se confunda con el naranja de atención ni con el de las entregas.

| Paleta | Familia | Para qué se usa |
|---|---|---|
| Primary | Azul | Acción principal ("Continuar"), progreso, enlaces, foco |
| Secondary | Azul grisáceo | **Toda selección:** indicador de navegación, botones tonales, chips seleccionados |
| Tertiary | Violeta | Acento mínimo: solo el nivel "En desarrollo". Nunca para selección ni navegación |
| Neutral y neutral variant | Grises azulados | Superficies, textos, bordes |
| Error | Rojo | Prohibido o error |

**Colores de estado (semánticos)**
- Cada uno tiene cuatro roles: color, texto sobre el color, contenedor y texto sobre el contenedor.
- Se generan como paletas tonales propias, **sin armonizar** con la semilla, para que nunca se confundan entre sí.
- **Siempre van con ícono y texto:** el color solo nunca alcanza.

| Estado | Token | Ícono | Uso |
|---|---|---|---|
| Prohibido o error | `md-sys-color-error` | `block`, `error` | Acción destructiva, dato inválido, entrega vencida |
| Atención o alerta | `app-color-warning` | `warning` | Vence hoy, revisar antes de seguir |
| Positivo o permitido | `app-color-success` | `check_circle` | Logrado, guardado, respuesta correcta |
| Información | `app-color-info` | `info` | Notas, aclaraciones, novedades |
| Deshabilitado | `app-color-disabled-content` y `-container` | El del control | Controles no disponibles: on-surface al 38% y al 12%, según la regla de M3 |

**Contraste:** todos los colores de estado superan 4.5:1 sobre las tarjetas y sobre sus contenedores, en los dos modos.

**Superficies**
- **Roles de superficie del entorno (`app-color-*`):** son alias de roles M3, distintos por modo.
  - `app-color-background`: fondo gris muy suave, con una textura de puntos al 4%.
  - `app-color-card`: tarjetas blancas en modo claro.
  - `app-color-card-item`: elementos dentro de las tarjetas.
  - `app-color-chrome`: el mismo color para la navegación lateral, la barra superior con scroll y la barra inferior.
- **Barra superior arriba de todo:** es transparente y deja ver el fondo. Solo toma `app-color-chrome` al hacer scroll.

**Categorías de eventos de la agenda**
- Son categóricos, no estados.
- Cada una tiene su contenedor, su color de texto y su acento: `app-event-entrega-*`, `app-event-eval-*`, `app-event-vivo-*` y `app-event-workshop-*`.
- Siempre van con ícono y texto.

**Temas:** claro y oscuro, con contraste estándar, medio y alto. El modo automático sigue al sistema, y la persona puede fijar uno en Ajustes.

### Tipografía
- **Familia:** Roboto Flex, gratuita y servida desde Google Fonts, con la escala tipográfica base de M3 (display, headline, title, body y label).
- **Variantes enfáticas de M3 Expressive** (peso 650): solo para los números clave y las fechas.
- **Lectura:** el texto largo usa `body-large`, con un ancho de línea de 60 a 75 caracteres.

### Forma
Usa la escala de esquinas de M3 Expressive:
- **Completa (`full`):** botones, búsqueda e indicadores.
- **`large`:** tarjetas, e indicador activo del riel.
- **`medium`:** eventos de agenda e íconos de tarjeta.
- **Grupo de botones conectados:** los extremos son redondos y las uniones van en `small`. El botón seleccionado se vuelve completamente redondo.

### Elevación
- **Nivel 1:** riel modal y barra superior con scroll.
- **Nivel 2:** hover de las tarjetas de módulo.
- **Nivel 3:** snackbar.
- Todo lo demás es plano y tonal.

### Movimiento
Se usa el sistema de springs de M3 Expressive, aproximado en CSS:

| Tipo | Para qué se usa | Tokens |
|---|---|---|
| *Spatial* (con un rebote leve) | Posición y tamaño: el riel que se expande, el botón que cambia de forma, el progreso que crece | `--md-sys-motion-spring-fast-spatial` (350 ms), `--md-sys-motion-spring-default-spatial` (500 ms) |
| *Effects* (sin rebote) | Color y opacidad | `--md-sys-motion-spring-fast-effects` (150 ms), `--md-sys-motion-spring-default-effects` (200 ms) |

Con `prefers-reduced-motion` todo pasa a ser instantáneo. Estos valores viven en `css/tokens.css` del proyecto, porque el formato de tokens de este sistema no tiene una familia de movimiento.

### Espaciado y layout

**Base**
- **Espaciado:** escala de 4 px (`app-space-1` a `app-space-10`). Los tamaños de los componentes son múltiplos de 4.
- **Sin grilla de columnas fija.** M3 dejó atrás la grilla responsiva de 12 columnas de M2. El layout se arma con **clases de tamaño de ventana, paneles, márgenes y espaciadores** (*spacers*), siguiendo los layouts canónicos.

**Márgenes y espaciadores**
- **Márgenes de página:** 16 px en Compact y 24 px desde Medium.
- **Entre paneles:** un espaciador de 24 px.
- **Entre tarjetas de un mismo panel:** 16 px.

**Inicio: layout canónico "panel de apoyo" (*supporting pane*)**
- **Panel principal flexible**, alrededor del 70%: continuar, competencias, registro y módulos.
- **Panel de apoyo**, alrededor del 30% y con un mínimo de 320 px: agenda del día, pendientes y próximos eventos.
- **En Medium y Compact:** los paneles se apilan, con lo más accionable primero.

**Mi recorrido y Biblioteca: layout canónico "feed"**
- Una grilla adaptable de tarjetas con un ancho mínimo de 230 px.
- Hay tantas columnas como entren: el layout no fija la cantidad.

| Clase | Ancho | Navegación | Inicio |
|---|---|---|---|
| Compact | menos de 600 px | Barra inferior (Inicio, Recorrido, Agenda, Aprendizaje y Más) y hoja "Más" | Un panel; la agenda va debajo del resumen |
| Medium | 600 a 839 px | Riel colapsado; expandido es modal | Un panel |
| Expanded | 840 a 1199 px | Riel colapsado; expandido es modal | Un panel en dos columnas |
| Large y Extra-large | 1200 px o más | Riel expandido no modal, colapsable, que recuerda la preferencia | Contenido principal y panel de agenda a la derecha (320 a 360 px) |

**Navegación**
- **Riel en lugar de drawer:** M3 Expressive reemplazó el *navigation drawer* por el **riel de navegación expandido**. El botón de menú alterna entre colapsado y expandido.
- **Cabecera:** solo el botón de menú y la etiqueta "Menú". La marca va en la barra superior.
- **Inicio** va solo, arriba de las secciones.
- **Secciones desplegables:** Aprender, Recursos y Soporte, cada una con su ícono (`school`, `library_books`, `support`).
  - Todas aparecen plegadas, excepto la de la página actual, que se abre con su destino activo.
  - La sección que contiene la página actual siempre se marca, aunque esté plegada.
  - Con el riel colapsado se ven los destinos de Aprender. Recursos y Soporte aparecen como íconos que expanden el riel con esa sección abierta.
- **"Continuar: Módulo X"** no va en el riel: es un botón relleno en la barra superior (ver Barra superior).
- **Scroll:** la navegación no tiene scroll propio salvo que el contenido no entre.

**Barra superior**
- A la izquierda, la marca (logo y "Taller - IA") como enlace al inicio, y fuera de Inicio el título de la sección.
- A la derecha: buscador, botón relleno "Continuar: Módulo X" (separado 24 px del buscador; "Continuar" en tablet y solo ícono en mobile), tema, avisos y avatar.
- Transparente en reposo, sobre el fondo con textura.
- Al hacer scroll toma `app-color-chrome`, el mismo color del riel, con elevación 1.
- El avatar abre el **menú de usuario**.

## Inventario de componentes

Estado de cada componente de M3 Expressive en el taller.
- **Implementado:** está en el prototipo y en este sistema.
- **A construir:** lo necesita el brief.
- **No se usa:** no aplica a este producto.

**Acciones**

| Componente | Estado | Uso en el taller |
|---|---|---|
| Botones comunes (5 tamaños, de XS a XL) | Implementado S y M | Acciones de tarjeta, formularios, "Continuar" |
| Grupo de botones conectados (reemplaza a los *segmented buttons*) | Implementado | Día, Semana y Mes; tema; contraste |
| Botón de ícono | Implementado | Barra superior, navegación del calendario |
| FAB y FAB extendido | No se usa | "Continuar" es un botón relleno en la barra superior |
| Split button | A construir | "Exportar portafolio" en PDF o JSON |
| FAB menu | No se usa | Hay una sola acción principal |

**Navegación**

| Componente | Estado | Uso en el taller |
|---|---|---|
| Riel de navegación (colapsado y expandido) | Implementado | Navegación desde 600 px |
| Barra de navegación flexible | Implementado | Navegación en mobile |
| Barra superior (*app bar*) con búsqueda | Implementado | Título, búsqueda, tema, avisos y usuario |
| Pestañas (*tabs*) | A construir | Secciones dentro de un módulo: lección, actividad, recursos |
| *Toolbar* flotante | A construir | Anterior, Escuchar y Siguiente dentro de una lección |

**Contención**

| Componente | Estado | Uso en el taller |
|---|---|---|
| Tarjetas (rellena y delineada) | Implementado | Paneles, módulos, eventos |
| Listas (ítem interactivo completo, en contenedor) | Implementado | Continuar donde dejaste, evidencias, próximos eventos, pendientes |
| Divisores | Implementado | Listas y menú |
| Hoja inferior (*bottom sheet*) | Implementado | "Más" en mobile |
| Hoja lateral (*side sheet*) | A construir | Glosario y diario junto a la lección en Expanded o más |
| Carrusel | A construir | Videos y recursos destacados de un módulo |

**Comunicación**

| Componente | Estado | Uso en el taller |
|---|---|---|
| Insignias (*badges*) | Implementado | Eventos de hoy en Agenda, avisos |
| Diálogos | Implementado | Confirmar "Borrar mis datos" |
| Indicadores de progreso (lineal y circular) | Implementado | Objetivos, módulos |
| Indicador de carga (*loading indicator*) | A construir | Esperas cortas, de 200 ms a 5 s |
| Snackbar | Implementado | Confirmaciones breves |
| Mensajes de estado (error, atención, positivo, información) | Implementado | Feedback de actividades, avisos de agenda, notas |
| Tooltips | A construir | Íconos sin etiqueta visible |

**Selección y entrada**

| Componente | Estado | Uso en el taller |
|---|---|---|
| Chips (filtro y asistencia) | Implementado | Filtros de agenda, tipos de evento |
| Menús | Implementado | Menú de usuario |
| Campos de texto (56 px de alto, como indica M3) | Implementado | Agregar tarea: texto a todo el ancho; abajo, fecha y botón M (56 px) en la misma fila |
| Búsqueda (barra y vista) | Implementado la barra; falta la vista a pantalla completa en mobile | Buscar módulos y glosario |
| Checkbox | Implementado | Pendientes |
| Radio, *switch* y *slider* | A construir | Actividades, ajustes, velocidad de lectura |
| Selectores de fecha y hora | A construir | Fecha límite de tareas propias |

### Patrones que no son componentes de M3

Algunos patrones habituales en otros sistemas no son componentes de M3. Se resuelven así:

**Acordeón**
- **Qué es en M3:** M3 no tiene un componente acordeón. Se usa una lista con ítems desplegables.
- **Dónde se usa:** las secciones del riel, las preguntas de Ayuda y el temario de cada módulo.
- **Cómo se construye:** encabezado `button` con `aria-expanded`, ícono propio y chevron que rota.

**Ruta de migas (*breadcrumb*)**
- **Qué es en M3:** no es un componente de M3.
- **Dónde se usa:** dentro de una lección, desde Expanded, como "Mi recorrido > Bloque 2 > Módulo 6 > Paso 4".
- **En mobile:** se reemplaza por la flecha "Atrás" de la barra superior.

**Paginación numerada**
- **Qué es en M3:** no es un componente de M3.
- **Lecciones:** se avanza por pasos ("Paso 4 de 7", con Anterior y Siguiente).
- **Listas largas** (Biblioteca, glosario): búsqueda, filtros y un botón "Cargar más".

## Iconografía
- **Material Symbols Rounded** (fuente variable): relleno 0 cuando está inactivo y 1 cuando está activo, grosor 400 y tamaño óptico 24.
- **Tamaños:** 24 px por defecto y 20 px dentro de botones y metadatos.
- **Los íconos acompañan, no reemplazan.** En la navegación siempre van con etiqueta. Los íconos decorativos llevan `aria-hidden="true"`.

## Accesibilidad
- **Contraste:** texto de 4.5:1 en los cuatro temas; 3:1 para íconos, bordes de controles y anillos de foco.
- **Foco visible:** contorno de 3 px en `primary`.
- **Áreas táctiles:** 48 x 48 px como mínimo.
- **Gráficos:** siempre tienen una alternativa en texto o tabla (por ejemplo, el registro de actividad).
- **Estados de carga:** usan `aria-busy` y `aria-live`.

## Métricas de aprendizaje (decisión de producto)

El panel de seguimiento sigue la práctica actual de learning experience design: progreso basado en **competencias y evidencias**, no en completitud ni en tiempo.

- **Objetivos demostrados:** "13 de 38 objetivos de aprendizaje demostrados con evidencias".
- **Dominio por competencia:** en 4 niveles (Sin evidencia, Inicial, En desarrollo, Logrado), con la cantidad de evidencias que lo respaldan.
- **Próximo paso sugerido,** según la competencia con menos evidencia.
- **Registro de actividad:** cuenta actividades completadas por día. No mide tiempo de conexión ni rachas.
