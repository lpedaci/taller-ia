# Brief para Claude Code | Taller de IA: learning environment

Autora del proyecto: Lourdes Pedaci, Experience Designer.

Este documento es la especificación completa. Leelo entero antes de escribir código. La sección 10 explica cómo trabajar con Lourdes y cómo verificar cada cambio: aplicala desde el primer pedido. Si algo no está definido acá, elegí la opción más simple y anotala en `DECISIONES.md`.

---

## 0. Decisiones a confirmar con Lourdes antes de arrancar

Estos valores son supuestos. Preguntá si siguen vigentes antes de construir; si no hay respuesta, usá el valor por defecto.

| Tema | Valor por defecto |
|---|---|
| Nombre del taller | "Taller - IA" (decidido por Lourdes) |
| Público principal | Personas adultas y profesionales de Argentina y LATAM sin formación técnica en IA |
| Público secundario | Docentes y capacitadores que quieran enseñar IA; estudiantes mayores de 18 años (por ejemplo, de 7mo año de escuela técnica o de nivel terciario y universitario) |
| Edad | Solo mayores de 18 años. Todo el contenido, los ejemplos y los casos están pensados para personas adultas |
| Modalidad | Autoasistido online, y material para clases online sincrónicas individuales o grupales |
| Duración estimada | 21 módulos en 7 bloques, entre 45 y 75 minutos cada uno. Cada bloque se puede cursar como un curso independiente |
| Repositorio | `taller-ia`, publicado en `lpedaci.github.io/taller-ia` |
| Idioma | Solo español, sin versión en inglés: no implementes internacionalización |
| Registro | Académico profesional, para toda LATAM. Voseo rioplatense moderado, porque la autora es argentina; evitá modismos locales difíciles de entender en otros países |
| Design system | Material Design 3 Expressive de Google (ver sección 5) |

---

## 1. Objetivo del producto

Un **learning environment** web, no una página de lectura. La persona entra, sabe en qué punto de su recorrido está, aprende con actividades interactivas, practica con IA real y se va con un producto propio (su biblioteca de prompts y un plan de clase con IA).

Doble función:
1. **Aprender:** que cualquier persona adquiera las bases para usar IA generativa con criterio.
2. **Enseñar:** que Lourdes (y otros docentes) puedan usarlo para dar clases, con una guía para facilitadores.

### Resultados de aprendizaje (Backward Design)

Al terminar, la persona puede:
1. Explicar con sus palabras qué es la IA generativa, cómo funciona un modelo de lenguaje y por qué se equivoca.
2. Decidir qué tareas conviene delegar a la IA, cuáles no, y en qué modalidad.
3. Aplicar técnicas de ingeniería de prompts, de básicas a avanzadas, e iterar según el resultado.
4. Evaluar críticamente lo que produce la IA: precisión, sesgos, alucinaciones y pertinencia.
5. Usar IA de forma responsable: privacidad, autoría, transparencia y cuidado de las personas.
6. Analizar los dilemas éticos de la IA y cuidar los datos personales propios y ajenos según el marco legal vigente.
7. Elegir y usar ChatGPT, Claude, Gemini y Copilot según la tarea, sabiendo en qué se parecen y en qué se diferencian.
8. Usar asistentes y agentes de programación para crear proyectos simples, aun sin saber programar, revisando lo que producen.
9. Generar y editar imagen, audio, música, video y animación con IA, respetando derechos y consentimiento.
10. Diseñar flujos simples de automatización.
11. Diseñar actividades, ejercicios y materiales de formación que integren IA de forma intencional.

### Línea del recorrido: de lo general a lo particular

El orden es deliberado y cada bloque se apoya en el anterior:

1. **Comprender:** qué es la IA y cómo funciona.
2. **Criterio:** el marco 4D completo, incluida la ingeniería de prompts.
3. **Ética y datos:** los dilemas de la IA a nivel social y el cuidado de los datos personales.
4. **Asistentes:** los cuatro asistentes principales, el modo de voz y su uso en el trabajo.
5. **Crear con IA:** código, imagen, audio y música, video y animación.
6. **Automatizar:** de la conversación a los flujos y agentes.
7. **Aplicar:** diseñar formación con IA y proyecto final.

**Rutas sugeridas** (se muestran en el panel de inicio y permiten usar el taller por partes en clases o cursos cortos):
- **Ruta esencial:** bloques 1, 2 y 3, más los módulos 11 y 12.
- **Ruta creativa:** bloques 1 y 2, más los módulos 15 a 17.
- **Ruta técnica:** bloques 1 y 2, más los módulos 14 y 18.
- **Ruta idiomas y accesibilidad:** bloques 1 y 2, más los módulos 10 y 12.
- **Ruta formadores:** ruta esencial más el bloque 7.

El marco y las técnicas se enseñan **antes** que las herramientas a propósito: las herramientas cambian todo el tiempo, el criterio no. En cada módulo de herramientas, conectá explícitamente con las 4D vistas antes.

---

## 2. Marco pedagógico

- **Eje conceptual:** el marco 4D de AI Fluency de Anthropic (Delegación, Descripción, Discernimiento, Diligencia), desarrollado con Rick Dakan y Joseph Feller. Es la columna del recorrido.
- **Complementos:**
  - El marco de prompting en 5 pasos y las estrategias de iteración del curso Google Prompting Essentials, presentados como una mirada complementaria dentro del módulo de Descripción.
  - Los marcos de competencias en IA de la UNESCO (2024) para docentes y estudiantes, que orientan los módulos de Diligencia y de IA en educación.
- **Diseño instruccional:** cada lección sigue los eventos de Gagné en forma liviana:
  1. Gancho (situación o pregunta).
  2. Objetivo visible.
  3. Activación de saberes previos.
  4. Contenido breve.
  5. Práctica guiada.
  6. Feedback inmediato.
  7. Evaluación corta.
  8. Transferencia ("¿cómo lo usarías en tu trabajo o en tu aula?").
- **Evaluación:** cada módulo cierra con un chequeo formativo. El cierre final es un proyecto aplicado, con rúbrica. Tomá a Kirkpatrick como referencia solo para los niveles 1 y 2 (reacción y aprendizaje), con una encuesta de cierre opcional.

### Regla de contenido (importante)

- Todo el contenido es **original, redactado en español**, y sintetiza las fuentes oficiales con palabras propias.
- No copies textos, videos, ejercicios ni evaluaciones de los cursos de Anthropic, Google, OpenAI ni de ninguna otra fuente. Explicá la idea con tus palabras, citala y enlazá la fuente original para profundizar.
- Las citas textuales tienen que ser excepcionales y cortas.
- Cada lección termina con "Para profundizar": 1 a 3 enlaces a fuentes oficiales.
- Las referencias van en formato **APA 7ma edición**.
- Todo el contenido en otro idioma se traduce según las reglas de "Contenido que viene de otro idioma" (sección 5).
- La práctica es con herramientas reales, pero el taller no depende de ninguna: toda consigna tiene que poder hacerse con cualquiera de los cuatro asistentes, en su versión gratuita cuando sea posible.
- **Verificá cada URL antes de publicarla.** Si un enlace no responde, marcá en `DECISIONES.md` que hay que revisarlo, en lugar de inventar uno.
- No pongas datos que cambian rápido (nombres de modelos, precios, límites) en el texto principal. Si hacen falta, van en una nota con fecha ("dato de noviembre de 2026").

---

## 3. Estructura de contenidos

### Bloque 1 | Comprender

#### Módulo 0 | Bienvenida y punto de partida
- Cómo funciona el entorno, cómo se guarda el progreso y qué te llevás al final.
- Mapa del recorrido en 5 bloques: por qué va de lo general a lo particular.
- **Autodiagnóstico inicial:** 10 preguntas sobre uso actual, herramientas conocidas y confianza. El resultado se guarda para compararlo al cierre.
- Primer registro en el diario de aprendizaje: "¿para qué querés usar IA?".

#### Módulo 1 | ¿Qué es la inteligencia artificial?
- IA, aprendizaje automático, aprendizaje profundo e IA generativa: cómo se relacionan (diagrama de círculos concéntricos en SVG).
- Breve recorrido histórico hasta los asistentes actuales, sin sobrecargar de fechas.
- IA generativa por tipo de salida: texto, imagen, audio, video y código.
- **Actividad:** clasificar ejemplos cotidianos (recomendaciones de una plataforma de streaming, filtro de spam, chatbot, generador de imágenes, etc.) según el tipo de IA.

#### Módulo 2 | Cómo funciona un modelo de lenguaje
- Entrenamiento con grandes volúmenes de texto y predicción del próximo token.
- Ajuste posterior para que el modelo siga instrucciones y converse.
- Ventana de contexto, memoria de la conversación y fecha de corte de conocimiento.
- Multimodalidad: modelos que leen imágenes, documentos y audio.
- Por qué un LLM no "busca" ni "sabe" como una persona.
- **Actividad interactiva:** un "predictor de palabras" de juguete. La persona completa frases y ve cómo cambian las probabilidades. Es una simulación didáctica con datos fijos, no un modelo real.

#### Módulo 3 | Capacidades, límites y riesgos
- **Qué hace bien:** redactar, resumir, reformular, generar ideas, programar, analizar texto.
- **Qué hace mal:** datos exactos sin fuente, hechos recientes, cálculos sin herramientas, alucinaciones, sesgos.
- **Tipos de uso:** chatbot, asistente con herramientas (búsqueda, archivos, código) y agente.
- **Actividad:** "¿Verdadero o alucinación?". Tarjetas con respuestas de IA (ejemplos escritos para el taller) para clasificar y justificar.

### Bloque 2 | Criterio: el marco 4D

#### Módulo 4 | Delegación
- Presentación del marco 4D completo (Delegación, Descripción, Discernimiento, Diligencia), con un SVG propio que se retoma en todo el taller.
- Decidir qué hacer, qué delegar y cómo. Las tres modalidades de interacción: **automatización**, **aumentación** y **agencia**. Explicalas con tus palabras a partir del curso de Anthropic.
- Antes de delegar, conocer tres cosas: el problema, la plataforma y las propias capacidades.
- **Actividad:** clasificador con 12 tareas reales de profesionales y capacitadores en tres columnas: "lo hago yo", "lo hago con IA" y "lo delego a la IA". El feedback explica por qué, no solo "correcto/incorrecto".

#### Módulo 5 | Ingeniería de prompts I: fundamentos (Descripción)
- Describir el producto, el proceso y el comportamiento esperado.
- **Componentes de un buen prompt:** tarea, contexto, rol, ejemplos, formato de salida y restricciones.
- Ser claro y directo. Explicar el porqué de cada instrucción.
- El marco de 5 pasos de Google como mirada complementaria: mostrá las coincidencias con el enfoque de Anthropic.
- **Laboratorio de prompts:**
  - Un editor guiado por campos que arma el prompt completo.
  - Botones "Copiar" y "Abrir en Claude / ChatGPT / Gemini / Copilot" (enlace a la web, sin API).
  - Comparador "antes / después" con un prompt pobre y uno mejorado.
- **Biblioteca personal de prompts:** cada prompt bueno se puede guardar con nombre y etiquetas, y exportar como Markdown o JSON.

#### Módulo 6 | Ingeniería de prompts II: técnicas avanzadas
- Ejemplos múltiples (few-shot) para fijar estilo y formato.
- Pedir que razone paso a paso antes de responder.
- Estructurar prompts largos con secciones o etiquetas (por ejemplo, etiquetas XML para separar instrucciones, documentos y ejemplos).
- Encadenar prompts: dividir una tarea compleja en etapas.
- Meta-prompting: pedirle a la IA que mejore o genere un prompt.
- Plantillas reutilizables con variables.
- Instrucciones persistentes: instrucciones personalizadas, proyectos y asistentes personalizados (GPTs, Gems, Projects). Explicá el concepto general, sin detalles de interfaz que cambian.
- **Actividad:** "Subí de nivel". Un prompt básico que la persona mejora en tres rondas aplicando una técnica por ronda. Cada ronda muestra qué cambió y por qué.

#### Módulo 7 | Discernimiento: evaluar e iterar
- Evaluar el producto (¿es correcto, completo, pertinente?), el proceso (¿cómo llegó?) y el comportamiento (¿respondió como se pidió?).
- El ciclo descripción-discernimiento: iterar en lugar de aceptar la primera respuesta.
- Verificación de fuentes, detección de sesgos y contraste con otras fuentes.
- **Actividad:** "Corregí a la IA". Un texto generado (escrito para el taller) con 5 errores escondidos: un dato falso, una cita inventada, un sesgo, una omisión y un formato incumplido. La persona marca y justifica cada uno.
- **Checklist descargable** de evaluación de respuestas.

#### Módulo 8 | Diligencia: uso responsable
- Responsabilidad sobre lo que se usa y se publica.
- Transparencia y autoría: cuándo y cómo declarar el uso de IA.
- Privacidad y datos: qué no cargar (personales, de clientes, de estudiantes, confidenciales de la empresa). Diferencias entre cuentas personales y corporativas, explicadas en general.
- Sesgos, impacto en las personas y enfoque centrado en lo humano (UNESCO).
- **Actividad:** dilemas ramificados. 4 escenarios breves con decisiones y consecuencias:
  - una capacitadora con datos de participantes;
  - un informe laboral;
  - un trabajo final de un posgrado;
  - una imagen generada para una campaña.

### Bloque 3 | Ética y datos

#### Módulo 9 | Ética de la inteligencia artificial
- **Sesgos y discriminación:** de dónde vienen (datos, diseño, uso) y qué efectos tienen en decisiones sobre personas, por ejemplo en selección de personal o en créditos.
- **Desinformación y contenido sintético:** deepfakes, voces clonadas, noticias falsas y estafas. Cómo reconocer señales y verificar.
- **Propiedad intelectual y autoría:** entrenamiento con obras protegidas, debates y litigios abiertos, quién es autor de un contenido generado. Presentalo como debate abierto, con las posturas principales, sin dar asesoramiento legal.
- **Trabajo:** tareas que cambian, tareas nuevas, y la importancia de la formación continua.
- **Impacto ambiental:** consumo de energía y agua de los centros de datos, en términos generales y con fuentes.
- **Transparencia, explicabilidad y concentración del poder tecnológico.**
- **Autonomía humana:** dependencia, pensamiento crítico y relaciones emocionales con asistentes.
- **Marcos de referencia:** la Recomendación sobre la Ética de la IA de la UNESCO (2021) y los Principios de IA de la OCDE.
- **Actividad "Mapa de impactos":** a partir de un caso (una empresa que usa IA para preseleccionar CV), la persona identifica a los actores afectados, los beneficios, los riesgos y las salvaguardas, en un tablero interactivo.
- **Actividad de debate:** 3 posiciones sobre un tema abierto (por ejemplo, autoría de una ilustración generada). La persona elige una y la argumenta en su diario. En clase, sirve como debate grupal.

#### Módulo 10 | Protección de datos personales y marco legal
- Qué es un dato personal y qué es un dato sensible (salud, origen étnico, opiniones políticas, convicciones religiosas, vida sexual, datos biométricos). Los datos inferidos.
- **Qué pasa con lo que le cargás a una IA:**
  - almacenamiento;
  - uso para entrenamiento y cómo desactivarlo cuando la herramienta lo permite;
  - revisión humana;
  - diferencias entre cuentas personales y corporativas.

  Explicalo en general y mandá los detalles por herramienta a `herramientas.json`.
- **Argentina:**
  - Ley 25.326 de Protección de los Datos Personales y su decreto reglamentario 1558/2001.
  - Hábeas data (artículo 43 de la Constitución Nacional).
  - La Agencia de Acceso a la Información Pública (AAIP) como autoridad de aplicación.
  - Los derechos de acceso, rectificación y supresión.
  - Mencioná que hay proyectos de reforma en debate, sin dar por aprobado ninguno.
- **Referencias internacionales:** el Reglamento General de Protección de Datos de la Unión Europea (RGPD) y el Reglamento de IA de la UE (2024), como marcos que influyen en la región. Agregá una tarjeta breve sobre otros países de LATAM, con fecha, en un archivo de datos aparte (`/content/marco-legal.json`).
- **Buenas prácticas:**
  - anonimizar antes de cargar;
  - no subir datos de terceros sin base legal ni consentimiento;
  - revisar la configuración de privacidad;
  - seguir las políticas de la organización.
- **Aviso visible:** este módulo es informativo y no reemplaza el asesoramiento legal.
- **Actividad "¿Lo cargarías?":** 15 tarjetas de información (un CV con datos de contacto, una planilla de sueldos, un texto propio, una foto de un DNI, etc.) para clasificar en "nunca", "solo anonimizado" y "sin problema". Cada tarjeta lleva feedback.
- **Actividad "Anonimizá este texto":** un correo laboral ficticio con datos personales inventados. La persona marca lo que hay que quitar o reemplazar antes de pedirle un resumen a la IA.

### Bloque 4 | Asistentes

#### Módulo 11 | Los cuatro asistentes: ChatGPT, Claude, Gemini y Copilot
- **Qué tienen en común:** todos son asistentes conversacionales sobre modelos de lenguaje, y todo lo visto en los bloques 1 y 2 aplica igual.
- **En qué se diferencian, por ecosistema y por funciones** (no por nombre de modelo ni precio):
  - OpenAI con ChatGPT;
  - Anthropic con Claude;
  - Google con Gemini y su integración con Google Workspace;
  - Microsoft con Copilot y su integración con Microsoft 365.
- Funciones que conviene conocer en cualquiera de ellos:
  - subir archivos;
  - búsqueda web;
  - generación de imágenes;
  - análisis de datos;
  - proyectos o espacios de trabajo;
  - memoria;
  - asistentes personalizados.
- Criterios para elegir: tarea, ecosistema de trabajo, privacidad y políticas de la organización.
- **Actividad "Misma tarea, cuatro asistentes":** una consigna fija (por ejemplo, resumir un documento y proponer 3 preguntas de repaso). La persona la prueba en las herramientas que tenga y registra las diferencias en una tabla comparativa dentro del entorno.
- **Regla:** las funciones, nombres y planes de estas herramientas cambian seguido. Todo dato concreto va en una tarjeta "Actualizado a: noviembre de 2026" con enlace a la ayuda oficial de cada herramienta, en un archivo de datos aparte (`/content/herramientas.json`) fácil de actualizar.

#### Módulo 12 | Conversar con la IA por voz
- **Qué es el modo de voz:** un diálogo hablado y en tiempo real con el asistente. Se puede interrumpir, pedir que hable más lento o cambiar de tema.
- **Diferencias con dictar un texto o con escuchar una respuesta leída.**
- **Ejemplos por herramienta:** el modo de voz de ChatGPT, Gemini Live, el modo de voz de Claude y Copilot Voice. Disponibilidad, idiomas y planes van en `herramientas.json`, con fecha.
- **Usos para el aprendizaje personal:**
  - **Práctica oral de idiomas (speaking):** conversaciones guiadas por nivel del Marco Común Europeo (A2 a C1), juegos de rol (entrevista de trabajo, reunión, viaje), corrección de errores al final o en el momento, vocabulario por tema y práctica de pronunciación.
  - **Repaso de contenidos:** la IA hace preguntas y la persona responde en voz alta.
  - **Preparar presentaciones y entrevistas:** ensayo con preguntas difíciles y devolución.
  - **Pensar en voz alta:** ordenar ideas para un proyecto mientras se camina o se viaja.
- **Usos de accesibilidad:**
  - personas con baja visión o ceguera;
  - dificultades motrices que complican escribir;
  - dislexia u otras dificultades de lectura y escritura;
  - personas que se expresan mejor hablando.

  En todos los casos, presentalo como una opción más y no como reemplazo de los apoyos profesionales.
- **Límites y cuidados:**
  - Reconocimiento de acentos y modismos regionales: probá con el español de tu país.
  - Errores de transcripción.
  - Respuestas que suenan seguras aunque estén mal: el Discernimiento también aplica a lo que se escucha.
  - **La voz es un dato personal:** revisar qué se guarda y por cuánto tiempo, y no conversar sobre datos de terceros. Retomá el Módulo 10.
  - El asistente no reemplaza a un profesor de idiomas ni a un profesional de la salud.
- **Actividad "Armá tu sesión de speaking":** un formulario que genera el prompt inicial para pegar en el modo de voz. Pide idioma, nivel, situación, rol de la IA, cuándo corregir, duración y si se quiere un resumen escrito de errores al final. Se guarda en la biblioteca de prompts.
- **Actividad "Plan de práctica":** la persona arma un plan semanal de 3 sesiones cortas de voz, con objetivo y forma de registrar su avance en el diario.
- **Actividad "Escenarios de accesibilidad":** 5 situaciones con una persona y una necesidad concreta. La persona elige qué configuración y qué tipo de interacción por voz le serviría más, y recibe feedback.

#### Módulo 13 | IA generativa aplicada al trabajo
- Casos por área, cada uno con un prompt modelo para guardar en la biblioteca:
  - redacción y comunicación;
  - investigación y síntesis;
  - análisis de datos y planillas;
  - presentaciones;
  - atención al cliente;
  - recursos humanos y capacitación.
- IA dentro de las suites de oficina (Gemini en Workspace, Copilot en Microsoft 365): qué cambia cuando la IA vive dentro de tus documentos.
- Multimodalidad en la práctica: trabajar con imágenes, PDF, capturas y audio.
- **Actividad:** la persona elige su área, recibe 3 casos guiados y arma su propio "kit" de prompts de trabajo.

### Bloque 5 | Crear con IA

Regla para todo el bloque: los nombres de herramientas son ejemplos que cambian. Van en `herramientas.json` con fecha y enlace oficial. El texto de las lecciones explica conceptos y procesos que sirven con cualquier herramienta.

#### Módulo 14 | IA para programar
- **Del autocompletado a los agentes**, tres niveles:
  - sugerencias de código en el editor;
  - chat que escribe código;
  - agentes que planifican, editan archivos, ejecutan comandos y verifican.
- **Panorama de herramientas,** agrupado por tipo:
  - agentes de programación como Claude Code (Anthropic), Codex (OpenAI) y Google Antigravity;
  - asistentes en el editor como GitHub Copilot y Cursor;
  - generadores de apps desde el navegador.
- Conceptos mínimos para no perderse, sin necesidad de saber programar:
  - archivo, carpeta y repositorio;
  - terminal;
  - qué es un "diff";
  - control de versiones con Git;
  - publicar un sitio (por ejemplo, en GitHub Pages).
- **"Vibecoding" y desarrollo asistido:** qué se puede hacer sin programar, y dónde está el límite.
- **Cómo darle contexto a un agente:** un brief claro y archivos de instrucciones del proyecto (como CLAUDE.md o AGENTS.md). Trabajar por etapas, revisar y probar cada una.
- **Discernimiento aplicado al código:**
  - probar lo que se construyó;
  - leer los cambios antes de aceptarlos;
  - no confiar en "ya está funcionando".
- **Seguridad:**
  - no compartir contraseñas ni claves de API;
  - revisar permisos;
  - cuidado con comandos que borran o publican;
  - datos personales dentro de las apps que se construyen.
- **Actividad "Tu primer brief":** la persona redacta, con un formulario guiado, el brief de una página simple (por ejemplo, un portfolio o una landing de un emprendimiento). El entorno lo exporta como archivo para dárselo a un agente. Incluye una guía paso a paso opcional para publicarlo.
- **Actividad "Leé el agente":** una conversación simulada con un agente de programación (escrita para el taller), con plan, cambios y verificación. La persona identifica en qué momentos tendría que revisar o frenar al agente.

#### Módulo 15 | IA para imagen
- Cómo funcionan los modelos de imagen, en términos simples.
- Generar desde texto, editar una imagen existente, ampliar, quitar fondos y mantener un estilo consistente.
- **Prompt visual:**
  - sujeto;
  - estilo;
  - composición y encuadre;
  - luz;
  - paleta;
  - formato y proporción;
  - qué evitar.
- **Usos en el trabajo:** piezas para redes, ilustraciones para materiales, bocetos, mockups.
- **Derechos y límites:**
  - estilos de artistas vivos;
  - personajes y marcas protegidas;
  - imágenes de personas reales sin consentimiento;
  - licencias de uso comercial de cada herramienta.
- **Procedencia y etiquetado:** credenciales de contenido (estándar C2PA) y marcas de agua invisibles (como SynthID de Google). Por qué es difícil "detectar" una imagen generada.
- **Actividad "Constructor de prompt visual":** campos guiados que arman el prompt, con un ejemplo de antes y después. El resultado se guarda en la biblioteca de prompts.

#### Módulo 16 | IA para audio, voz y música
- Texto a voz, transcripción, traducción y doblaje, limpieza de audio.
- Para conversar con la IA por voz, ver el Módulo 12. Este módulo trata la voz como contenido que se produce.
- Clonación de voz: usos legítimos (accesibilidad, contenidos propios) y riesgos (estafas telefónicas, suplantación). Consentimiento explícito y por escrito.
- Música generativa: crear canciones, pistas de fondo y efectos. Debates y litigios sobre derechos en esta área, presentados como un tema abierto.
- **Usos en el trabajo:** podcasts y cápsulas de capacitación, narración de videos, resúmenes en audio de documentos.
- **Actividad "Guion para voz":** la persona escribe un guion de 30 a 60 segundos para una cápsula, con marcas de pausa y énfasis. Recibe una checklist de calidad (claridad, ritmo, pronunciación de nombres propios) y una matriz de "usos permitidos o no permitidos" de la voz.

#### Módulo 17 | IA para video y animación
- Texto a video, imagen a video, avatares que hablan, animación y edición asistida (subtítulos, recortes, reencuadre).
- **Del guion al video:** idea, guion, storyboard, generación por escenas, edición y revisión. La IA sirve en cada paso, y el criterio sigue siendo humano.
- **Límites técnicos actuales,** explicados en general:
  - coherencia entre escenas;
  - manos y texto dentro de la imagen;
  - duración de los clips.
- **Ética:**
  - deepfakes;
  - uso de la imagen de personas reales;
  - etiquetar el contenido sintético;
  - contexto electoral y de noticias.
- **Actividad "Storyboard":** un constructor de 4 a 6 escenas con descripción visual, texto en pantalla, voz y prompt por escena. Se exporta como documento imprimible.

### Bloque 6 | Automatizar

#### Módulo 18 | De la conversación a la automatización
- Diferencias entre usar un chat, armar un flujo automatizado y delegar en un agente.
- Conceptos clave explicados sin código:
  - disparador, acción y condición;
  - integraciones entre aplicaciones;
  - APIs (qué son, en términos simples);
  - agentes que usan herramientas;
  - el humano en el circuito (human-in-the-loop).
- Panorama de herramientas sin código: Zapier, Make, n8n, Power Automate y Google Apps Script, a nivel conceptual. Las funciones concretas van en `/content/herramientas.json`.
- Cuándo **no** automatizar: tareas con alto riesgo, datos sensibles o que requieren criterio humano. Retomá la Delegación y la Diligencia.
- **Actividad "Diseñá tu flujo":** un constructor visual simple, armado con bloques dentro del entorno (no se ejecuta). La persona arma un flujo de 3 a 5 pasos para una tarea repetitiva propia, marca dónde interviene la IA y dónde revisa una persona. El resultado se exporta como diagrama.

### Bloque 7 | Aplicar

#### Módulo 19 | Diseñar formación con IA
- Usar IA para diseñar actividades, ejercicios, materiales, evaluaciones y retroalimentación, siempre con revisión humana.
- Los marcos de competencias en IA de la UNESCO para docentes y estudiantes: dimensiones y niveles de progresión, explicados con palabras propias.
- **Enseñar IA a personas adultas:**
  - partir de problemas reales de su trabajo;
  - practicar más de lo que se expone;
  - trabajar los miedos y las expectativas sobre la IA.
- Formatos: sesiones individuales y grupales, sincrónicas y asincrónicas.
- Evaluación en tiempos de IA: tareas difíciles de tercerizar, evaluar procesos y no solo productos.
- **Actividad:** "Rediseñá una consigna". Una consigna tradicional que la IA resuelve sola, para transformarla en una que use la IA como apoyo del aprendizaje.

#### Módulo 20 | Proyecto final
- Elegir una de tres opciones:
  - **(a)** diseñar una sesión de formación sobre IA para un público adulto concreto;
  - **(b)** resolver un problema real del propio trabajo con IA, incluyendo un flujo de automatización;
  - **(c)** crear una pieza o un proyecto con IA: una página web construida con un agente, o una pieza multimedia (imagen, audio o video).
- Las tres opciones aplican el marco 4D completo e incluyen una reflexión ética y de datos.
- **Plantilla guiada:**
  - objetivo;
  - qué se delega y por qué;
  - herramienta elegida y justificación;
  - prompts;
  - flujo (si corresponde);
  - cómo se evalúa lo producido;
  - consideraciones éticas.
- Rúbrica visible desde el inicio, con 5 criterios y 3 niveles.
- **Autodiagnóstico final:** las mismas preguntas del Módulo 0, con un gráfico de comparación.
- Exportación del proyecto como documento imprimible (o PDF desde el navegador).
- **Certificado de finalización** simple, generado en el navegador con el nombre que la persona ingresa, firmado por Lourdes Pedaci. Tiene que decir claramente que es un certificado del taller, no de Anthropic, Google, OpenAI ni Microsoft.

### Secciones transversales
- **Glosario:** 30 a 40 términos, con buscador. Ejemplos: token, LLM, alucinación, prompt, ventana de contexto, agente, sesgo, fine-tuning, RAG.
- **Mi aprendizaje:** el tablero de seguimiento personal (sección 4).
- **Biblioteca de prompts:** la del Módulo 5, que también reúne los prompts visuales y de los kits de trabajo, accesible siempre.
- **Diario de aprendizaje:** reflexiones al cierre de cada módulo, exportable.
- **Fuentes y referencias:** la Biblioteca del taller (ver sección 7), con todas las fuentes en APA 7 y filtros.
- **Guía para facilitadores:** página aparte (`/facilitadores`) con, para cada módulo:
  - Duración sugerida para clase online sincrónica, en dos versiones: individual (tutoría 1 a 1) y grupal.
  - Objetivos.
  - Secuencia de clase (inicio, desarrollo, cierre).
  - Preguntas para debatir.
  - Dinámicas para clases online (salas, pizarra compartida, demostración en pantalla).
  - Adaptaciones para estudiantes mayores de 18 que cursan su último año de escuela técnica: ejemplos ligados a la vida laboral y a las prácticas profesionalizantes.
  - Errores frecuentes.

---

## 4. Experiencia de usuario: que se sienta un learning environment

### Navegación y estructura
- **Panel de inicio (dashboard):** se describe en el apartado "Entorno y panel de inicio", más abajo. El recorrido como mapa visual (módulos como estaciones, con su estado) vive en la sección "Mi recorrido".
- **La navegación se adapta al tamaño de pantalla** según las clases de ventana de Material 3 (detalle en la sección 5).
- **Escuchar la lección:** un botón que lee en voz alta el texto del paso actual con la Web Speech API del navegador (`speechSynthesis`). Elegí una voz en español si existe; si no, avisá. Tiene que incluir controles de pausa y velocidad. Es gratis, funciona sin servidor y suma accesibilidad.
- Dentro de cada lección: progreso por pasos ("Paso 3 de 7") y botones Anterior y Siguiente.
- Los módulos no se bloquean (cada persona elige su camino), pero se sugiere el orden.
- **Retomar donde dejaste:** al volver, botón "Continuar" que lleva al último paso visitado.

### Interacción
- Cada lección tiene al menos una actividad interactiva. Nada de páginas de solo texto.
- Feedback inmediato, explicativo y amable. Siempre dice por qué, también cuando la respuesta es correcta.
- Microevaluaciones de 3 a 5 preguntas con reintento.
- Insignias simples por módulo completado, sobrias y sin infantilizar.

### Entorno y panel de inicio
**Referencias obligatorias:**
- `referencia/prototipo-entorno.html`: el prototipo funcional del entorno aprobado por Lourdes.
- `css/tokens.css`: los tokens de M3 generados.
- `referencia/design-system/`: el design system "Taller - IA" (README con fundamentos y reglas, `tokens.json`, y una carpeta por componente con su README y una vista previa). `components/bundle.css` es el CSS de referencia de esos componentes: tomalo como guía, no como hoja de estilos final.

Con respecto al prototipo: Respetá su estructura, jerarquía y comportamiento responsive. Podés mejorar detalles, pero cualquier cambio de estructura se consulta antes y se registra en `DECISIONES.md`.

**Estructura general**
- **Superficies (definidas en `css/tokens.css`):**
  - Fondo de página `app-color-background`: gris muy suave, con una textura de puntos sutil. En modo claro es `surface-container-low` aclarado un 10% hacia el blanco (`color-mix(in srgb, surface-container-low 90%, #fff)`).
  - Tarjetas `app-color-card`: blancas en modo claro.
  - Elementos internos `app-color-card-item`.
  - Navegación y barra superior con scroll: el mismo color, `app-color-chrome`, para que se lean como un solo marco.
- **Riel de navegación de M3 Expressive** (el *navigation drawer* quedó en desuso en M3 Expressive). Sigue el tema: claro en modo claro y oscuro en modo oscuro, sobre `app-color-chrome` y sin borde, con el indicador activo en `secondary-container`.
  - **Secciones desplegables,** cada una con su ícono y su botón:
    - **Inicio** (`home`): va solo, arriba de las secciones, sin pertenecer a ninguna.
    - Aprender (`school`): Mi recorrido, Agenda, Mi aprendizaje.
    - Recursos (`library_books`): Biblioteca, Mis prompts, Glosario, Facilitadores.
    - Soporte (`support`): Ayuda, Ajustes.
  - **Sección que contiene la página actual:** se marca siempre. Con el riel plegado, su botón (Recursos o Soporte) lleva el indicador activo. Con el riel desplegado y la sección cerrada, el encabezado lleva el indicador; con la sección abierta, el encabezado va en `primary` y el destino lleva el indicador. El nombre accesible agrega "contiene la página actual".
  - **Comportamiento de las secciones:** todas aparecen plegadas, excepto la sección de la página actual, que se muestra abierta con su destino activo marcado. Al cambiar de página, la sección anterior se pliega y se abre la nueva. La persona puede abrir otra sección a mano, pero eso no se recuerda.
  - **Cabecera del riel:** solo el botón de menú con la etiqueta "Menú" (debajo del ícono con el riel colapsado, a la derecha con el riel expandido). La marca no va en el riel.
  - **Geometría común:** los íconos quedan centrados a 48 px del borde izquierdo con el riel plegado o desplegado, para que no se desplacen al cambiar de estado. En los dos estados: filas de 60 px separadas por 12 px, cabecera de 68 px y separador antes de Recursos. Plegado, entre Inicio y Mi recorrido hay un separador en el lugar del encabezado Aprender.
  - **Indicador activo con el riel colapsado:** envuelve el ícono y el nombre del destino (72 px de ancho, esquina grande, `secondary-container`, nombre en negrita), y el estado *hover* cubre el mismo bloque. Entre destinos hay 12 px.
  - **Colapsado (96 px):** botón de menú, los destinos de Aprender, y los íconos de Recursos y Soporte, que expanden el riel con esa sección abierta.
  - **Expandido (280 px):** suma la marca y las secciones con sus títulos.
  - **Vista previa al dejar el cursor:** con el riel colapsado y usando mouse, si el cursor queda 700 ms sobre el riel, se despliega por encima del contenido sin moverlo.
    - Al sacar el cursor, se oculta.
    - Si se toca el botón de menú durante la vista previa, queda fijo expandido.
    - No se activa en pantallas táctiles.
  - **Desktop (1200 px o más):** expandido y no modal, colapsable con el botón de menú. La preferencia se recuerda.
  - **Tablet:** colapsado; al expandirse se abre como panel modal con *scrim*, y se cierra con Escape.
  - **Mobile:** barra de navegación flexible inferior (64 px) con "Más" en una *bottom sheet*.
  - **Scroll:** el riel ocupa el alto de la ventana y no genera scroll propio, salvo que su contenido no entre.
- **Barra superior:**
  - **Marca a la izquierda:** logo y "Taller - IA", como enlace al inicio. Fuera de Inicio la sigue un divisor vertical y el título de la sección. Entre 600 y 839 px, fuera de Inicio, la marca muestra solo el logo. En mobile muestra solo el logo y el título de la sección se oculta visualmente (la pantalla ya tiene su título grande en el contenido).
  - Título y subtítulo de la sección (en Inicio se ocultan solo visualmente, porque el saludo ya identifica la pantalla; el `h1` sigue para lectores de pantalla), buscador (módulos, temas y glosario), botón "Continuar", botón de modo claro u oscuro, avisos y avatar.
  - **Botón "Continuar: Módulo X":** es la acción principal de todo el entorno y va en la barra superior, a la derecha del buscador, como botón relleno M3 (S, 40 px), separado del buscador por 24 px.
    - 1200 px o más: "Continuar: Módulo X".
    - 600 a 1199 px: "Continuar".
    - Menos de 600 px: solo el ícono, en un botón de 40 px.
    - El nombre accesible es siempre "Continuar: Módulo X": el texto que se oculta se oculta solo visualmente.
    - No hay FAB en el riel ni FAB flotante en mobile.
  - Arriba de todo es transparente. Al hacer scroll toma `app-color-chrome`, el mismo color del riel, con elevación 1.
- **Menú de usuario (avatar):** es un menú M3 con:
  - encabezado con nombre, cohorte y ruta;
  - Mi aprendizaje, Mi portafolio, Cambiar de ruta, Ajustes y accesibilidad;
  - Exportar mi progreso e Importar progreso;
  - Ayuda;
  - Borrar mis datos, que pide confirmación en un diálogo M3.

  No hay "Cerrar sesión" porque no hay cuentas. Navegación completa por teclado.
- **Listas:** cada ítem es interactivo en toda la fila, como indica M3: el `<a>` envuelve el elemento inicial, los textos y el ícono final, con capas de estado y un alto mínimo de 72 px. Se usa en Continuar donde dejaste, Evidencias y los próximos días de la Agenda. Nunca hay un enlace solo en el título.
- **Botones:** siguen los tamaños de M3 Expressive (S de 40 px y M de 56 px) con ancho según el contenido, capas de estado (*hover*, foco y presionado) y cambio de forma al presionar. Las acciones de las tarjetas son botones de texto alineados al final, no filas de enlace.
- **Layout:** layout canónico "panel de apoyo" de M3. Panel principal flexible de alrededor del 70% y panel de apoyo de alrededor del 30% (mínimo 320 px), con 24 px entre paneles y 16 px entre tarjetas. No se usa una grilla de 12 columnas: M3 trabaja con clases de ventana, paneles, márgenes y espaciadores.
- **Componentes:** el design system "Taller - IA" tiene el inventario de componentes M3 (implementados y a construir) y la solución para los patrones que no son de M3 (acordeón, migas de pan, paginación).
- **Ajustes y accesibilidad:** tema (automático, claro u oscuro) y contraste (estándar, medio o alto), con grupos de botones conectados.

**Paneles del inicio**
1. **Saludo y acción principal:** saludo según la hora, con el nombre de la persona en `primary`, fecha, resumen del día ("Tenés 3 eventos más hoy y 4 tareas pendientes") y el botón "Continuar: Módulo X".
2. **Resumen (4 tarjetas):** módulos completados, objetivos de aprendizaje demostrados, evidencias en el portafolio y próximo cierre. Cada tarjeta enlaza a su detalle.
3. **Continuar donde dejaste:** módulos en curso y recientes, con un anillo de progreso y el paso actual.
4. **Dominio de competencias** (reemplaza al "progreso por bloque", que solo medía completitud):
   - **Resumen:** "X de Y objetivos de aprendizaje demostrados con evidencias", con su barra de progreso.
   - **Nivel por competencia:** una escala de 4 niveles (Sin evidencia, Inicial, En desarrollo, Logrado), con tres segmentos de intensidad y una etiqueta de texto.
   - **Próximo paso sugerido:** según la competencia con menos evidencia.
   - **Cálculo:** el nivel sale de las actividades evaluadas y las evidencias, no de las páginas vistas.
   - **Competencias:**
     - comprender cómo funciona la IA;
     - Delegación;
     - Descripción;
     - Discernimiento;
     - Diligencia;
     - ética y datos personales;
     - crear y automatizar con IA;
     - diseñar formación con IA.
   - Cada objetivo de aprendizaje de cada módulo se vincula a una competencia en los archivos de contenido.
5. **Registro de actividad,** estilo GitHub:
   - Una cuadrícula de días donde el color indica cuántas **actividades, lecturas o evaluaciones se completaron** ese día.
   - Lleva una nota que lo aclara y una alternativa en tabla por mes.
   - **Tabla por mes:** columnas Mes, Actividades completadas ("36 de 59": completadas de las disponibles ese mes) y Avance (barra y porcentaje).
   - La cantidad de semanas se adapta al ancho disponible.
   - En el inicio no lleva la tabla por mes: esa alternativa accesible está en "Mi aprendizaje", al que lleva "Ver detalle". En el inicio, el gráfico tiene un resumen en `aria-label`.
6. **Mis módulos:** tarjetas de los próximos módulos, con su bloque y sus pasos.
7. **Agenda:** es un panel lateral propio. Ver "Distribución del inicio" más abajo.
8. **Pendientes:**
   - Tareas con fecha y hora límite, marcadas como urgentes si vencen en menos de 24 horas.
   - Se pueden tildar y agregar tareas propias.
   - **Agregar tarea:** un botón tonal M3 tamaño M "Agregar tarea" (56 px de alto, ícono de 24 px, etiqueta Title Medium) al pie de la lista, a todo el ancho de la tarjeta en todos los anchos, abre un diálogo "Nueva tarea". No hay formulario dentro de la tarjeta.
     - Campos con etiqueta visible: Tarea (obligatorio), Fecha límite y Hora, precargadas con mañana a las 23:59. Campos de 56 px.
     - Tablet y desktop: diálogo básico de M3 (480 px), con Cancelar y Agregar abajo a la derecha.
     - Mobile: diálogo de pantalla completa de M3, con botón de cerrar, título y "Agregar" arriba.
     - Si falta la tarea: borde y mensaje de error ("Escribí la tarea para poder agregarla."), con `aria-invalid`, y el foco vuelve al campo.
     - Al agregar o cancelar (también con Escape), el diálogo se cierra y el foco vuelve al botón. Se actualiza el contador "N por hacer".
     - Fecha y hora llevan un ícono Material visible (`calendar_today`, `schedule`) en `on-surface-variant` en lugar del ícono nativo del navegador, que es tenue; el área del ícono sigue abriendo el selector. Los controles nativos siguen el modo claro u oscuro.
     - Botones de los diálogos: Cancelar con borde visible (`outline`) y la acción principal rellena. Las acciones destructivas (Eliminar, Borrar) van en rojo sólido (`error`).
   - **Eliminar una tarea:** solo las tareas propias (las que agregó la persona) llevan la etiqueta "Propia" y un botón de ícono `delete` (48 px) con nombre accesible "Eliminar la tarea: [nombre]". Las tareas de la cursada vienen de la agenda y no se eliminan desde acá.
     - Antes de eliminar, un diálogo de confirmación: "¿Eliminar esta tarea?", con el nombre de la tarea y "Se quita de tus pendientes. No se puede deshacer."; Cancelar (con el foco inicial) y Eliminar (rojo).
     - Escape o Cancelar cierran sin borrar y devuelven el foco al botón. Al eliminar, el foco pasa a la tarea siguiente (o al botón "Agregar tarea") y aparece el aviso "Tarea eliminada".
   - Las tareas de la cursada vienen de la agenda; las propias se guardan en el navegador.
9. **Próximos eventos:** ya no es un panel aparte. Forma parte del panel Agenda (punto 7).

**Distribución del inicio** (layout canónico M3 "panel de apoyo": contenido principal flexible y un panel dedicado)
- **Panel de agenda, a la derecha (1200 px o más):**
  - Ocupa 320 a 360 px, empieza a la altura del saludo y va separado del contenido por 24 px.
  - Tiene su altura natural y se desplaza junto con la página. **No tiene scroll propio ni barra de desplazamiento.**
  - Es una superficie `app-color-card` con esquina extragrande (28 px), para que se lea como parte del dashboard pero dedicada a las fechas.
  - Contiene, separados por divisores:
    1. **Calendario del mes:** días de lunes a domingo; hoy en un círculo `primary`; puntos de color por tipo de evento, con leyenda; los días con eventos y hoy son enlaces a la Agenda en ese día, con `aria-label` completo ("Jueves 19 de noviembre, 1 evento"); "Ver mes".
    2. **Hoy:** línea de tiempo con la marca "Ahora" y los botones segmentados Día, Semana y Mes.
    3. **Próximos 7 días:** la lista agrupada por día descrita arriba. Los títulos ocupan hasta dos líneas.
       - Muestra los **3 próximos eventos**. Si hay más, abajo va un botón de texto "Ver N más" (con chevron) que despliega el resto en el mismo lugar y pasa a "Ver menos".
       - El botón lleva `aria-expanded` y `aria-controls`. Al desplegar, el foco pasa al primer evento nuevo.
       - Si un día queda entero fuera de los 3, se oculta también su encabezado.
- **Contenido principal (a la izquierda):**
  - Saludo.
  - Resumen en 4 tarjetas, en una fila si el ancho lo permite (860 px o más del área principal) y si no en 2 por 2.
  - Paneles en dos columnas independientes, para que no queden huecos: Continuar donde dejaste y Dominio de competencias a la izquierda; Pendientes y Próximos módulos a la derecha. Registro de actividad abajo, a todo el ancho.
  - Si el área principal mide menos de 640 px, los paneles van en una columna. Usá *container queries*, no solo el ancho de la ventana.
- **Menos de 1200 px (tablet y mobile):** la agenda pasa a ser un panel a todo el ancho, debajo del resumen y antes de los demás.
  - **Sin calendario del mes:** se ve completo en la Agenda.
  - **Cabecera del panel:** el selector Día, Semana y Mes reemplaza al enlace "Calendario". En mobile ocupa todo el ancho, con tres botones iguales.
  - **Panel de 600 px o más:** Hoy y Próximos 7 días en dos columnas parejas, separadas por un divisor vertical.
  - **Mobile:** una columna, con Hoy arriba y Próximos 7 días abajo.
- **Orden en una columna:** saludo, resumen, agenda, Continuar donde dejaste, Pendientes, Dominio de competencias, Registro de actividad y Próximos módulos.

**Métricas: qué se mide y qué no (decisión de Lourdes)**
- **Se mide:** lo que la persona **completa y produce**: pasos, actividades, evaluaciones, evidencias y nivel de competencias.
- **No se mide ni se muestra:** tiempo en la plataforma, horas de estudio, rachas semanales, días seguidos de conexión ni días "inactivos". Estar más o menos tiempo en la plataforma no indica cuánto se aprende: se puede leer, mirar un video o practicar fuera de ella.
- No uses mensajes de culpa ni de presión ("perdiste tu racha", "hace 3 días que no entrás").

**Agenda completa (sección Agenda)**
- **Eventos que ya pasaron:** en las vistas Día, Semana y Mes se atenúan y llevan "Finalizado" con un ícono de tilde (en Mes, el tilde y un texto para lectores de pantalla), con el mismo criterio que la Agenda del inicio. Nunca se indica solo con color.
- **Vistas:** Día, Semana y Mes. Incluye navegación anterior y siguiente, un botón "Hoy" y filtros por tipo.
- **En mobile:** la semana se muestra como lista por día, y el mes como grilla con puntos de color, con el detalle al tocar un día.
- **Tipos de evento,** cada uno con ícono, etiqueta y color (nunca solo color):

| Grupo | Tipos de evento |
|---|---|
| Entregas y cierres | Cierre de actividad, entrega |
| Evaluaciones | Apertura de evaluación, parcial, final |
| Videollamadas | Encuentro sincrónico, tutoría |
| Workshops | Talleres en vivo |

- **Origen de los datos:**
  - Las fechas de la cursada se cargan en `/content/agenda.json`, por cohorte. Cada evento tiene título, tipo, inicio, fin opcional, enlace opcional (por ejemplo a la videollamada) y módulo relacionado.
  - En modo autoasistido, sin cohorte, la agenda muestra un estado vacío con la opción de agregar eventos propios.
  - Los eventos y tareas propios se guardan en el navegador.
- **Exportar al calendario:** botón para descargar los eventos en formato `.ics`, para Google Calendar, Outlook o el calendario del celular. Cuando la descarga no esté disponible, ofrecé copiar el contenido.

### Estados de carga y espera
Cada vez que algo tarda, la persona tiene que saber **qué está pasando, cuánto falta (si se puede saber) y qué va a aparecer**. Nunca una pantalla en blanco ni un ícono girando sin contexto.

**Patrones de Material 3 según el caso**

| Situación | Patrón | Detalle |
|---|---|---|
| Primera carga del sitio | Pantalla de inicio breve (*splash*) con el nombre del taller y un indicador de progreso lineal | Si la carga dura menos de 300 ms, no se muestra. Nunca se agrega una espera artificial. |
| Abrir un módulo o una lección | *Skeleton* con la forma real del contenido: título, bloques de texto, tarjeta de actividad | Evita saltos de layout. Usa los colores de `surface-container`, con una animación sutil que se apaga con `prefers-reduced-motion`. |
| Cargar contenido largo (Biblioteca, glosario, Mi aprendizaje) | *Skeleton* de lista o de tarjetas, y después carga progresiva | Primero lo visible en pantalla y después el resto. |
| Proceso con duración conocida (exportar el portafolio o el PDF, importar progreso, generar el certificado) | Indicador de progreso **determinado** (lineal o circular) con porcentaje y el paso actual | Por ejemplo: "Armando tu portafolio, paso 2 de 3: reuniendo tus evidencias". |
| Proceso con duración desconocida (cargar un video, una animación o la voz del navegador) | Indicador **indeterminado** con un mensaje que explica qué se espera | Por ejemplo: "Cargando el video de Google Cloud Tech (en inglés, 5 min)". |
| Videos con fachada | La miniatura y el botón se ven enseguida; al hacer clic, un indicador dentro del marco del video | El layout no se mueve. |
| Gráficos y animaciones | *Skeleton* con la forma del gráfico (ejes, barras grises) o la primera escena estática | Después aparecen los datos con una transición breve. |
| Guardado automático del progreso | *Snackbar* breve o indicador discreto ("Guardado") | No interrumpe ni bloquea la actividad. |

**Mensajes de espera**
- Texto en español, concreto y amable. Dice qué se está haciendo y qué va a aparecer, no "Cargando..." a secas.
- Si la espera supera unos 3 segundos, el mensaje se actualiza ("Ya casi está, preparando las actividades").
- Si supera unos 10 segundos, se ofrece una salida: reintentar, volver o seguir con otra cosa.

**Errores y falta de conexión**
- Si algo no carga, el estado de error explica qué pasó en lenguaje simple, qué puede hacer la persona (reintentar, revisar la conexión, seguir con el texto de la lección) y nunca pierde el progreso guardado.
- **Sin conexión:** si un video o un recurso externo no carga, la lección sigue disponible con el resumen en español y un aviso: "Este video necesita conexión. Podés seguir con la lección y verlo después".

**Estados vacíos**
Las secciones que todavía no tienen contenido de la persona (biblioteca de prompts, diario, evidencias, Mi aprendizaje al empezar) muestran:
- una ilustración simple en SVG;
- una línea que explica para qué sirve;
- un botón que lleva a la primera acción.

**Accesibilidad**
- Los contenedores que cargan llevan `aria-busy="true"` mientras esperan.
- Los mensajes de progreso y de error se anuncian con una región `aria-live` (`polite` para progreso, `assertive` solo para errores).
- El foco no salta mientras se carga. Al terminar, va al contenido nuevo cuando corresponde (por ejemplo, al título de la lección).
- Los indicadores de progreso usan `role="progressbar"` con `aria-valuenow` cuando el proceso es determinado.

**Diseño**
Todos estos estados se diseñan como pantallas propias, no como un agregado de último momento. Mostralos en `estilos.html`, en mobile, tablet y desktop y en los modos claro y oscuro. Para revisarlos, sumá un parámetro de desarrollo, como `?simular=lento` o `?simular=error`, que fuerce cada estado.

### Mi aprendizaje: seguimiento personal
Una sección propia, "Mi aprendizaje", accesible desde la navegación principal. Es el tablero personal de cada persona.

**Qué muestra**
- **Progreso:** por bloque y por módulo, con el tiempo estimado dedicado (calculado por pasos completados, sin cronómetros invasivos).
- **Competencias:** el nivel en cada dimensión del marco 4D y en las áreas del taller (fundamentos, prompts, ética y datos, herramientas, creación, automatización, formación). Se calcula con los resultados de las actividades y las autoevaluaciones, en tres niveles: inicial, en desarrollo y logrado. Se muestra con un gráfico accesible, con alternativa en tabla.
- **Autodiagnóstico:** comparación entre el inicial y el final, con un gráfico de antes y después.
- **Objetivos personales:** la persona define de 1 a 3 objetivos al empezar (por ejemplo, "usar IA para preparar mis clases") y los revisa al cerrar cada bloque.
- **Evidencias:** los productos que fue creando, enlazados en un solo lugar (prompts guardados, kit de trabajo, brief, storyboard, flujo, proyecto final).
- **Diario de aprendizaje:** las reflexiones de cierre de cada módulo, en orden cronológico.
- **Próximo paso sugerido:** según lo que falta y la ruta elegida.

**Exportación**
- Todo se exporta como un **portafolio de aprendizaje** imprimible o en PDF desde el navegador. Sirve para presentarlo en un trabajo o en una institución.
- También se exporta como JSON, para importarlo en otro dispositivo.

**Privacidad**
- Todo queda en el navegador de la persona.
- Si se usa el taller en una clase, la persona decide si comparte el portafolio exportado con quien facilita. No hay envío automático.

### Persistencia
- Progreso, respuestas, biblioteca de prompts y diario se guardan en `localStorage`. Todas las lecturas y escrituras van envueltas en `try/catch`, con un fallback en memoria si falla.
- **Exportar e importar progreso** como archivo JSON, para cambiar de dispositivo.
- Botón "Borrar mis datos" con confirmación propia dentro de la interfaz (no uses `alert` ni `confirm` del navegador).
- **No hay backend, login ni analítica de terceros.** Ningún dato sale del navegador.

---

## 5. Diseño visual: Material Design 3 Expressive

### Qué versión usar
La versión vigente del design system de Google es **Material Design 3 (M3)** con su extensión **M3 Expressive**, presentada en 2025. **No existe un "Material 4".** Usá la documentación oficial de m3.material.io como fuente de verdad.

### Cómo implementarlo en este proyecto
- **Tokens como variables CSS:** color, tipografía, forma, elevación y movimiento, con los nombres del sistema (`--md-sys-color-primary`, `--md-sys-typescale-body-large-size`, `--md-sys-shape-corner-large`, etc.).
- **Paleta y estados:**
  - **Paleta:** semilla `#1F5FA8`, esquema Vibrant, con la secundaria en el mismo tono de la semilla. Toda la selección (navegación, chips, botones tonales) va en `secondary-container`, de la familia azul. La terciaria violeta se usa solo como acento mínimo.
  - **Colores de estado:** `md-sys-color-error` (prohibido o error), `app-color-warning` (atención), `app-color-success` (positivo o permitido) y `app-color-info` (información), cada uno con sus cuatro roles. Para deshabilitado, `app-color-disabled-*`.
  - Siempre van con ícono y texto. El detalle está en el design system.
- **Color:** ya está generado en `css/tokens.css` con `@material/material-color-utilities`, la librería oficial que usa Material Theme Builder.
  - Semilla `#1F5FA8`, esquema Vibrant.
  - **Secundaria** en el mismo tono que la semilla (la selección queda en azul).
  - **Superficies casi neutras** (paleta neutra de croma 4): fondo, tarjetas, riel y barra superior son grises casi neutros, así el azul funciona como acento y no como ambiente.
  - **Terciaria cálida "miel"** (tono HCT 75, croma 28), usada con moderación para lo relacionado con el tiempo: ícono de la Agenda, Pendientes, la tarjeta "Próximo cierre" y el avatar. Lo de aprendizaje y progreso sigue en azul. No se usa para estados: no reemplaza al naranja de atención ni al de entregas.
  - Modos claro y oscuro, con contraste estándar, medio y alto.
  - Para cambiar la paleta, regenerá desde la semilla con esa librería; no edites colores a mano.
- **No dependas de librerías de componentes de terceros** para M3 en web. La implementación web oficial tiene soporte limitado. Construí los componentes en HTML y CSS siguiendo las especificaciones de M3 (anatomía, estados, medidas y accesibilidad):
  - botones, *button groups* y FAB;
  - tarjetas;
  - chips;
  - barra y riel de navegación;
  - riel de navegación colapsado y expandido (no uses *navigation drawer*);
  - barra superior;
  - diálogos y *bottom sheets*;
  - *snackbars*;
  - indicadores de progreso lineales y circulares;
  - *segmented buttons*;
  - campos de texto;
  - *switches*;
  - *tooltips*.
- **Usá el lado expresivo con criterio, no como decoración:**
  - Escala de formas y transiciones de forma (*shape morph*) para estados importantes, como completar un módulo.
  - Tipografía enfática en títulos y números clave.
  - Contenedores de color para jerarquizar.
  - En lecciones y lectura larga, priorizá la calma y la legibilidad.
- **Tipografía:**
  - Escala tipográfica de M3 (display, headline, title, body, label) con una familia libre de Google Fonts con buen soporte para español.
  - Una sola familia o dos como máximo.
  - Texto de lectura con interlineado amplio y un ancho de línea de 60 a 75 caracteres.
- **Iconos:** Material Symbols (variable font, estilo Rounded u Outlined, uno solo para todo el sitio).

### Modo claro y oscuro
- Los dos esquemas salen de Theme Builder, con los roles de color de M3 (`surface`, `surface-container`, `on-surface`, `primary-container`, etc.). **Nunca uses colores sueltos fuera de los tokens.**
- Al entrar, respetá `prefers-color-scheme`. Sumá un selector visible (claro, oscuro, sistema) que se recuerde en `localStorage`.
- Los gráficos, diagramas y SVG también cambian de tema: tienen que usar los tokens, no colores fijos.
- Opción de **contraste alto** con el esquema de contraste alto de Theme Builder.

### Responsive: mobile, tablet y desktop
Usá las **clases de tamaño de ventana de Material 3** y adaptá la navegación y el layout en cada una:

| Clase | Ancho | Navegación | Layout de lección |
|---|---|---|---|
| Compact (mobile) | menos de 600 px | Barra de navegación inferior y barra superior | Una columna; actividades a pantalla completa; *bottom sheets* para el glosario y las notas |
| Medium (tablet vertical) | 600 a 839 px | Riel de navegación | Una columna con márgenes amplios; paneles que se abren por encima |
| Expanded (tablet horizontal, laptop chica) | 840 a 1199 px | Riel de navegación | Dos paneles: contenido y panel lateral (índice del módulo, glosario o diario) |
| Large y Extra-large (desktop) | 1200 px o más | Riel expandido no modal, colapsable | Dos o tres paneles con ancho de lectura limitado; nunca texto a todo el ancho |

- **Áreas táctiles** de 48 x 48 px como mínimo.
- **Layout fluido** con grid y `clamp()` para tipografía y espacios.
- **Probá cada pantalla en 360, 412, 768, 1024, 1280 y 1920 px de ancho,** en vertical y horizontal, más zoom al 200%.
- Las actividades de arrastrar, los tableros y los constructores tienen que tener un layout propio para mobile (por ejemplo, listas con botones "mover a" en lugar de columnas lado a lado).

### Animaciones
- **Sistema de movimiento de M3 Expressive** con springs basados en física (*spatial* y *effects*), implementado con transiciones y animaciones CSS, View Transitions API donde haya soporte, y la Web Animations API para casos puntuales.
- **Las animaciones explican, no decoran:**
  - transiciones entre pasos que muestran dirección (avanzar y retroceder);
  - feedback de acierto y error;
  - progreso que se llena;
  - diagramas que se construyen paso a paso (por ejemplo, cómo un modelo predice tokens, el ciclo descripción-discernimiento o el recorrido de un flujo de automatización).
- **Animaciones didácticas en SVG** con controles de reproducir, pausar y paso a paso, para que la persona maneje el ritmo.
- **Respetá `prefers-reduced-motion`:** en ese caso, transiciones instantáneas o fundidos cortos, y los diagramas animados se muestran como secuencia de pasos estáticos.
- **Duración y curvas** según los tokens de movimiento de M3. Nada de animaciones en bucle que distraigan de la lectura.

### Gráficos y visualización de datos
- **Hechos en SVG propio** con JavaScript, o con una librería liviana cargada con versión fija si hace falta.
- **Cada gráfico tiene:**
  - título;
  - unidad;
  - fuente (en APA, si son datos externos);
  - leyenda solo cuando hay más de una serie;
  - etiquetas directas cuando se puede;
  - una alternativa en texto o tabla para lectores de pantalla.
- **El tipo de gráfico se elige según la pregunta:**
  - barras para comparar;
  - líneas para evolución;
  - gráfico de puntos o mancuernas para el antes y el después del autodiagnóstico.

  Evitá tortas con muchas porciones y efectos 3D.
- **Color:**
  - paleta categórica derivada de los tokens, validada en los dos modos;
  - nunca el color como única forma de distinguir datos;
  - contraste de 3:1 como mínimo para elementos gráficos.
- **Responsive:** en mobile, los gráficos se simplifican (menos etiquetas, orientación horizontal de barras) y se pueden ampliar.
- **Usos previstos:**
  - autodiagnóstico inicial y final;
  - progreso por bloque;
  - comparación de herramientas;
  - datos citados en los módulos de ética (por ejemplo, impacto ambiental), siempre con fuente y fecha.

### Videos y animaciones explicativas (microlearning)
Los videos se incluyen solo cuando ayudan a entender algo que con texto cuesta: procesos, funcionamiento interno o demostraciones. No son relleno.

**Videos oficiales o de autor**
- **Fuentes válidas:** canales oficiales de organizaciones y autores reconocidos. Por ejemplo:
  - Anthropic, Google, Google DeepMind, Google Cloud Tech, Microsoft, Microsoft Learn, OpenAI;
  - UNESCO;
  - DeepLearning.AI y Andrew Ng;
  - 3Blue1Brown;
  - Andrej Karpathy.

  No uses reuploads, recortes de terceros ni canales que resumen contenido ajeno.
- **Duración, estilo microlearning:**
  - Ideal: de 2 a 6 minutos.
  - Máximo: 10 minutos.
  - Si un video valioso es largo, insertá solo el fragmento útil, con minuto de inicio y de fin (parámetros `start` y `end` del reproductor), y aclará en pantalla de qué parte se trata.
  - Como máximo, 1 o 2 videos por lección.
- **Verificación obligatoria:** antes de incluir un video, comprobá que exista, que sea del canal oficial, que se pueda insertar y su duración. **Nunca inventes enlaces ni identificadores de video.** Si no podés verificarlo, no lo incluyas: usá una animación propia (ver abajo) y anotalo en `DECISIONES.md`.
- **Registro:** cada video va en `/content/videos.json` con:
  - título traducido y título original;
  - canal y autor;
  - URL;
  - duración total y del fragmento;
  - idioma;
  - subtítulos disponibles (español, automáticos o ninguno);
  - módulo;
  - fecha de verificación;
  - referencia APA.
- **Inserción:**
  - Usá `youtube-nocookie.com` (modo de privacidad mejorada) o el reproductor oficial de la plataforma.
  - Cargalo con una "fachada": se muestra una miniatura con botón de reproducir, y el reproductor real carga recién al hacer clic. Así la página es más liviana y no se cargan rastreadores antes de tiempo.
  - Usá un contenedor responsive de 16:9.
  - No descargues ni vuelvas a subir videos de terceros.
- **Idioma:** si el video está en inglés, mostralo con la etiqueta "En inglés" e indicá si tiene subtítulos en español (o automáticos). Debajo agregá un **resumen propio en español** de 3 a 5 puntos con las ideas clave. No transcribas ni traduzcas el video completo.
- **No es para mirar pasivamente:**
  - **Antes del video:** una pregunta guía ("Mientras mirás, prestá atención a...").
  - **Después del video:** 1 o 2 preguntas de comprensión con feedback, o una conexión con la actividad siguiente.

**Animaciones propias en formato motion graphics**
Si no existe un video oficial adecuado, o si el que existe es largo o demasiado técnico, creá una **animación explicativa propia**.
- **Estilo:**
  - motion graphics profesional y académico, sobrio y claro;
  - colores, tipografía, formas y curvas de movimiento de los tokens de M3, y que funcione en modo claro y oscuro;
  - formas geométricas, íconos de Material Symbols, diagramas y texto en pantalla;
  - sin personajes caricaturescos, sin robots y sin efectos llamativos innecesarios.
- **Formato principal:** animación en SVG con CSS y la Web Animations API, dentro de la página. Es liviana, nítida en cualquier pantalla y se adapta al tema.
  - Controles de reproducir, pausar, avanzar y retroceder por escenas, y velocidad.
  - Barra de progreso por escenas.
- **Duración:** de 45 a 120 segundos, dividida en 3 a 6 escenas con un concepto por escena.
- **Texto en pantalla:** breve y en español. Debajo, una transcripción completa (que en este caso es contenido propio). Narración opcional con el botón "Escuchar" (Web Speech API).
- **Accesibilidad:**
  - con `prefers-reduced-motion`, la animación se muestra como una secuencia de escenas estáticas con flechas para avanzar;
  - cada escena tiene una descripción en texto para lectores de pantalla.
- **Versión en video para clases:** para facilitadores, generá también un archivo MP4 de cada animación. Grabá la animación con Playwright y convertila con ffmpeg como herramienta de desarrollo, sin que el sitio dependa de eso.
  - Resolución 1920x1080, versión en modo claro.
  - Subtítulos en un archivo `.vtt` en español.
  - Se ofrece como descarga en la guía para facilitadores.
- **Proceso:**
  1. Escribí primero un **guion y storyboard** breve: objetivo, escenas, texto en pantalla y qué se mueve. Guardalo en `/animaciones/guiones/`.
  2. Anotá en `DECISIONES.md` qué se va a animar.
  3. Construí la animación.
  4. Verificala en mobile, tablet y desktop, en los dos modos.
- **Animaciones prioritarias** (si no hay un video oficial breve que las resuelva mejor):
  1. Cómo un modelo de lenguaje predice el próximo token.
  2. Entrenamiento y ajuste de un modelo, de los datos al asistente.
  3. Qué es la ventana de contexto y qué pasa cuando se llena.
  4. El marco 4D y el ciclo descripción-discernimiento.
  5. Qué pasa con los datos cuando los cargás en una IA.
  6. Cómo un modelo de imagen genera a partir de ruido (difusión), en términos simples.
  7. Cómo funciona un agente: planificar, usar herramientas, verificar.
  8. RAG: buscar información y responder con fuentes.
  9. El recorrido de un flujo de automatización con revisión humana.
  10. Cómo funciona el modo de voz: voz, texto, modelo, texto y voz de nuevo.

**Videos candidatos a verificar** (no los incluyas sin comprobar el canal, la disponibilidad y la duración):
- 3Blue1Brown: la explicación breve de los modelos de lenguaje y la serie sobre redes neuronales y transformers.
- Andrej Karpathy: "Intro to Large Language Models". Es largo: usá solo fragmentos.
- Google Cloud Tech: "Introduction to Generative AI" y videos cortos sobre conceptos de IA.
- Anthropic: videos del canal oficial y de los cursos de Anthropic Academy que sean públicos.
- Microsoft: videos breves de Microsoft Learn y de Microsoft 365 sobre Copilot.
- OpenAI: videos oficiales de OpenAI Academy que sean públicos.
- DeepLearning.AI: fragmentos de "Generative AI for Everyone" que estén publicados en abierto.

### Ilustraciones, accesibilidad y estilo
- **Evitá el "AI slop":**
  - nada de gradientes violeta-azul genéricos, emojis decorativos, robots ni cerebros brillantes;
  - nada de tarjetas idénticas en grilla infinita ni frases de marketing vacías.
- **Ilustraciones y diagramas:** SVG propios y simples, con los tokens de color. No uses logos ni personajes de marcas.
- **Tono visual:** académico profesional, sobrio y cálido. Tiene que dar confianza a una persona adulta de cualquier país de LATAM.
- **Accesibilidad WCAG 2.2 AA:**
  - contraste suficiente en los dos modos;
  - navegación completa por teclado;
  - foco visible;
  - roles y etiquetas ARIA en las actividades;
  - alternativa sin arrastre para todo drag-and-drop;
  - textos alternativos;
  - subtítulos o transcripciones para cualquier audio o video;
  - `prefers-reduced-motion`.

### Uso de skills instaladas
Si en esta instalación de Claude Code hay skills de UX, anatomía de componentes, frontend, accesibilidad, design system o visualización de datos, **cargalas y seguilas en la etapa correspondiente**:
- frontend y design system en la etapa 1;
- anatomía de componentes al construir cada componente M3;
- visualización de datos para los gráficos;
- UX y accesibilidad en la revisión.

Si una skill contradice este brief, avisá la diferencia en `DECISIONES.md` y seguí el brief.

### Convenciones de texto (obligatorias)
- Español con voseo rioplatense moderado, registro académico profesional y comprensible en toda LATAM. Evitá modismos muy locales.
- **No uses rayas largas (em dash "—") en ningún texto.** Usá comas, dos puntos o punto.
- **No uses "·" como separador.** En títulos y encabezados usá "|"; en texto corrido, comas o puntos.
- Pie de página en una sola línea: "© 2026 Lourdes Pedaci, Experience Designer". En el prototipo se agrega "| Prototipo del entorno: los datos de esta pantalla son de ejemplo."
- Lenguaje claro: oraciones cortas y un concepto por párrafo. Los términos técnicos se explican la primera vez y enlazan al glosario.

### Contenido que viene de otro idioma (obligatorio)
Muchas fuentes del taller están en inglés. Todo lo que la persona lee en el entorno tiene que estar en español, y debe quedar claro qué vino de otro idioma.

**Orden de preferencia para traducir**
1. **Traducción oficial:** si la fuente tiene una versión oficial en español, usala siempre y citá esa versión. Por ejemplo:
   - documentos de UNESCO, OCDE y de la Unión Europea (el RGPD y el Reglamento de IA tienen versión oficial en español en EUR-Lex);
   - páginas de ayuda de las herramientas en español;
   - ediciones publicadas de libros en castellano.
2. **Traducción propia:** si no hay versión oficial, traducí con cuidado, al sentido y no palabra por palabra, con terminología consistente con el glosario. Marcala como traducción propia.

**Citas textuales traducidas:** usá un componente específico, `<cita-traducida>` o equivalente, que muestre:
- **Arriba:** el texto en español, en tamaño normal.
- **Abajo, en tamaño chico y color atenuado:** el texto en el idioma original, con el atributo `lang="en"` (u otro idioma) para que los lectores de pantalla lo pronuncien bien.
- **Una etiqueta:** "Traducción oficial" o "Traducción propia del inglés" (o del idioma que corresponda).
- **La referencia APA.** Cuando la traducción es propia, en APA se cita la obra original y se aclara "(traducción propia)".

**Reglas para las citas**
- Las citas textuales son excepcionales y breves, de una o dos oraciones como máximo, y en todo el taller hay muy pocas por fuente. La regla es parafrasear.
- Una paráfrasis de una fuente en inglés no lleva el texto original abajo, pero sí la referencia, y en la Biblioteca la fuente se marca con su idioma.

**Términos técnicos**
- La primera vez que aparece un término en inglés, va en español con el original entre paréntesis y en cursiva. Por ejemplo: "ingeniería de instrucciones (*prompt engineering*)" o "alucinación (*hallucination*)".
- Si el término en inglés es el uso habitual en LATAM (como *prompt* o *token*), se mantiene en cursiva, con su explicación y enlace al glosario.
- El glosario incluye el término en español, el original y una definición propia.

**Enlaces, videos y documentos en otro idioma**
- Llevan una etiqueta visible, como "En inglés", junto al enlace.
- Si el recurso tiene subtítulos o traducción automática disponible, indicalo.

**Capturas e interfaces**
- Si una herramienta se muestra en inglés, explicá en español qué dice cada botón o sección.
- Siempre que se pueda, usá la interfaz configurada en español.

---

## 6. Stack técnico

- **HTML, CSS y JavaScript vanilla**, sin paso de build. Tiene que funcionar publicado tal cual en **GitHub Pages** (hosting gratuito, es un requisito).
- **Contenido separado del código:** cada módulo es un archivo de datos (`/content/modulo-01.json` o Markdown con frontmatter) que el motor renderiza. Así Lourdes puede editar contenidos pidiéndole cambios a Claude sin tocar la lógica.
- **Componentes de actividad reutilizables,** cada uno configurable desde el contenido:
  - quiz de opción múltiple;
  - verdadero/falso con justificación;
  - clasificador (drag-and-drop accesible);
  - marcar errores en un texto;
  - escenario ramificado;
  - editor de prompts guiado;
  - reflexión abierta (diario);
  - comparador antes/después;
  - tabla comparativa editable;
  - constructor de flujos por bloques;
  - constructor guiado de prompts visuales y de briefs;
  - storyboard por escenas;
  - cita traducida (texto en español, original en chico y etiqueta de traducción);
  - video con fachada, pregunta guía, resumen y preguntas posteriores;
  - animación por escenas con controles, transcripción y versión estática;
  - tablero de mapa de impactos.
- **Enrutamiento** con hash (`#/modulo/3/paso/2`), así funciona en GitHub Pages sin configuración extra.
- **Estilos:** `css/tokens.css` (tokens M3 ya generados: no se editan a mano), `css/components.css` (componentes M3) y `css/layout.css` (clases de ventana y paneles).
- **Dependencias:** cero o mínimas. Si hace falta una librería (por ejemplo para gráficos), cargala desde un CDN confiable con versión fija, o mejor resolvelo con SVG propio.

### Estructura sugerida
```
taller-ia/
├── index.html
├── facilitadores.html
├── css/
│   ├── tokens.css
│   ├── components.css
│   └── layout.css
├── js/
│   ├── app.js          (enrutamiento y estado)
│   ├── storage.js      (localStorage con fallback)
│   ├── render.js       (motor de lecciones)
│   └── activities/     (un archivo por tipo de actividad)
├── referencia/                  (material de referencia; no se publica como parte del taller)
│   ├── prototipo-entorno.html   (prototipo aprobado)
│   └── design-system/           (README, tokens.json y componentes)
├── content/
│   ├── modulo-00.json … modulo-20.json
│   ├── herramientas.json
│   ├── videos.json
│   ├── agenda.json
│   ├── marco-legal.json
│   ├── glosario.json
│   └── fuentes.json
├── assets/
│   ├── svg/
│   └── video/          (MP4 y VTT de las animaciones propias, para facilitadores)
├── animaciones/
│   └── guiones/        (guiones y storyboards)
├── README.md
└── DECISIONES.md
```

---

## 7. Fuentes y autores de referencia

### Reglas de uso
- **Cada módulo tiene una sección "Lecturas y recursos"** con 3 a 6 fuentes. Cada fuente lleva una etiqueta de nivel:
  - **Inicial:** divulgación, sin requisitos.
  - **Profundización:** libros y guías extensas.
  - **Técnica:** papers y textos con matemática o código. Se marcan como opcionales.
- **Se combinan tres tipos de fuentes:**
  1. **Académicas:** libros de autores reconocidos y papers fundacionales.
  2. **Oficiales de la industria:** Anthropic, Google, Microsoft, OpenAI.
  3. **Organismos:** UNESCO, OCDE, AAIP, Unión Europea.
- **Voces de Argentina y LATAM:** sumá al menos una por bloque cuando exista.
- **Los libros se citan y se recomiendan, no se reproducen.** El taller explica las ideas con palabras propias y remite a la obra.
- **Ediciones:** si existe edición en español, citala. Verificá editorial y año antes de publicar. Si no estás seguro de una edición, citá la original en inglés.
- **Formato:** todas las referencias en APA 7, en `/content/fuentes.json`, con los campos `modulos`, `nivel`, `idioma` y `acceso` (libre, pago o requiere registro).
- **Verificá cada URL.** Para libros, alcanza con la referencia completa, sin enlace de compra.

### Referencia académica: qué toma el ITBA
El ITBA es una referencia local en IA. En el posgrado y la formación ejecutiva usa, entre otros:
- Haykin (*Neural Networks and Learning Machines*).
- Mitchell (algoritmos genéticos).
- Deisenroth y otros (*Mathematics for Machine Learning*).
- Zhang y otros (*Dive into Deep Learning*).
- En el programa de agentes: Vaswani y otros (2017), Huyen (*AI Engineering*), Wei y otros (2022, chain-of-thought), Lewis y otros (2020, RAG) y Yao y otros (2022, ReAct).

Los que tienen sentido para este público están incluidos abajo como lecturas técnicas opcionales.

### Por bloque

**Bloque 1 | Comprender**
- Russell, S. y Norvig, P. (2021). *Artificial intelligence: A modern approach* (4.ª ed.). Pearson. Es el manual de referencia en las universidades. *Profundización.*
- Mitchell, M. (2019). *Artificial intelligence: A guide for thinking humans*. Farrar, Straus and Giroux. Verificá la edición en español. *Inicial.*
- Sigman, M. y Bilinkis, S. (2023). *Artificial: La nueva inteligencia y el contorno de lo humano*. Debate. Autores argentinos. *Inicial.*
- Wolfram, S. (2023). *What is ChatGPT doing… and why does it work?* Wolfram Media. Tiene una versión libre en su sitio. *Profundización.*
- Karpathy, A. Videos de divulgación sobre LLM en su canal oficial de YouTube. *Inicial.*
- 3Blue1Brown (G. Sanderson). Serie de videos sobre redes neuronales y transformers. *Inicial.*
- Ng, A. *AI for Everyone* y *Generative AI for Everyone*. DeepLearning.AI y Coursera. *Inicial.*
- University of Helsinki y MinnaLearn. *Elements of AI*. Gratuito, en español. *Inicial.*
- Microsoft Learn. Ruta *Fundamentos de IA* (base de la certificación AI-900). *Inicial.*
- Google. *Machine Learning Crash Course*. *Técnica.*
- Vaswani, A. y otros. (2017). Attention is all you need. *Advances in Neural Information Processing Systems, 30*. El paper del transformer. *Técnica.*
- Zhang, A., Lipton, Z. C., Li, M. y Smola, A. J. *Dive into deep learning*. Libre en d2l.ai. *Técnica.*

**Bloque 2 | Criterio: marco 4D y prompts**
- Dakan, R. y Feller, J., con Anthropic. *AI Fluency: Framework & Foundations*. Anthropic Academy. *Inicial.*
- Mollick, E. (2024). *Co-intelligence: Living and working with AI*. Portfolio. Verificá la edición en español. *Inicial.*
- Anthropic. *Prompt engineering overview* y *Prompting best practices*. Documentación oficial. *Profundización.*
- Google. *Google Prompting Essentials* y la guía oficial de prompts para Gemini en Workspace. *Inicial.*
- OpenAI. Guía de prompt engineering (documentación para desarrolladores) y cursos de OpenAI Academy. *Inicial.*
- Microsoft. Guías oficiales de prompts para Copilot (support.microsoft.com y Microsoft Learn). *Inicial.*
- Wei, J. y otros. (2022). Chain-of-thought prompting elicits reasoning in large language models. *Técnica.*
- Huyen, C. (2025). *AI engineering: Building applications with foundation models*. O'Reilly. Capítulos de prompt engineering y evaluación. *Técnica.*
- Narayanan, A. y Kapoor, S. (2024). *AI snake oil*. Princeton University Press. Para el módulo de Discernimiento: distinguir lo que la IA puede hacer de lo que se promete. *Profundización.*

**Bloque 3 | Ética y datos**
- UNESCO. (2021). *Recomendación sobre la ética de la inteligencia artificial*. *Inicial.*
- OCDE. *Principios de IA de la OCDE*. *Inicial.*
- Crawford, K. (2021). *Atlas of AI*. Yale University Press. Hay edición en español; verificá la editorial. *Profundización.*
- O'Neil, C. (2016). *Weapons of math destruction*. Crown. Hay edición en español; verificá la editorial. *Inicial.*
- Buolamwini, J. (2023). *Unmasking AI*. Random House. Y Buolamwini, J. y Gebru, T. (2018), "Gender Shades", sobre sesgos en reconocimiento facial. *Inicial.*
- Bender, E. M., Gebru, T., McMillan-Major, A. y Shmitchell, S. (2021). On the dangers of stochastic parrots. *Proceedings of FAccT '21*. *Técnica.*
- Zuboff, S. (2019). *The age of surveillance capitalism*. PublicAffairs. Hay edición en español. *Profundización.*
- Russell, S. (2019). *Human compatible*. Viking. Sobre alineación y control. *Profundización.*
- Christian, B. (2020). *The alignment problem*. W. W. Norton. *Profundización.*
- Costa, F. (2021). *Tecnoceno: Algoritmos, biohackers y nuevas formas de vida*. Taurus. Autora argentina. *Profundización.*
- Corvalán, J. G. y el Laboratorio de Innovación e Inteligencia Artificial (IALAB) de la Facultad de Derecho de la UBA. Publicaciones sobre IA, derecho y Estado. Verificá títulos y años en el sitio de IALAB. *Profundización.*
- **Fuentes oficiales de la industria sobre IA responsable:**
  - Anthropic: Bai, Y. y otros (2022), *Constitutional AI*; la constitución de Claude; la Responsible Scaling Policy; la política de uso.
  - Google: AI Principles.
  - Microsoft: Responsible AI Standard y sus seis principios.
  - OpenAI: Model Spec y políticas de uso.
- **Datos personales:** Ley 25.326 y Decreto 1558/2001 (InfoLEG); guías de la AAIP; RGPD; Reglamento (UE) 2024/1689.

**Bloque 4 | Asistentes**
- Centros de ayuda oficiales de ChatGPT, Claude, Gemini y Microsoft Copilot (para `herramientas.json`).
- Microsoft Learn. Rutas sobre Microsoft 365 Copilot.
- Google. Recursos oficiales de Gemini para Google Workspace.
- OpenAI Academy. *AI Foundations* y *Applied AI Foundations*.

**Bloque 5 | Crear con IA**
- **Código:**
  - Documentación oficial de Claude Code (Anthropic), Codex (OpenAI), Google Antigravity, GitHub Copilot y GitHub Pages.
  - Para contextualizar el término "vibe coding": Karpathy, que lo acuñó en 2025. Citá la publicación original si la encontrás verificada.
- **Imagen, audio y video:**
  - Páginas oficiales de los modelos de imagen y video de Google DeepMind y de OpenAI.
  - Políticas de uso y licencias de cada herramienta incluida en `herramientas.json`.
- **Procedencia del contenido:** C2PA y Content Authenticity Initiative (Adobe); SynthID (Google DeepMind).

**Bloque 6 | Automatizar**
- Anthropic. (2024). *Building effective agents* (blog de ingeniería).
- Model Context Protocol (MCP). Documentación oficial en modelcontextprotocol.io.
- Yao, S. y otros. (2022). ReAct: Synergizing reasoning and acting in language models. *Técnica.*
- Lewis, P. y otros. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. *NeurIPS*. Para explicar RAG en términos simples. *Técnica.*
- Documentación oficial de Zapier, Make, n8n, Power Automate y Google Apps Script.

**Bloque 7 | Aplicar (formación con IA)**
- UNESCO. (2023). *Guidance for generative AI in education and research*. *Inicial.*
- UNESCO. (2024). *AI competency framework for teachers* y *AI competency framework for students*. *Profundización.*
- Mollick, E. y Mollick, L. (2023). *Assigning AI: Seven approaches for students, with prompts*. SSRN. *Inicial.*
- Anthropic. Curso *AI Fluency for Educators* en Anthropic Academy. Verificá que siga disponible.
- OpenAI Academy. *ChatGPT Foundations for Teachers*.
- OCDE. *Digital Education Outlook* (edición más reciente). *Profundización.*

### Biblioteca del taller
Sumá una sección **"Biblioteca"** accesible desde el menú, con todas las fuentes y estos filtros:
- por bloque;
- por nivel;
- por idioma;
- por tipo: libro, paper, curso, documentación o normativa.

Cada ficha muestra la referencia APA 7, una línea con "por qué leerlo" redactada para el taller, y el enlace cuando corresponde.

## 8. Plan de trabajo por etapas

Trabajá en este orden. Al cerrar cada etapa, mostrá el resultado y esperá el OK de Lourdes antes de seguir.

1. **Esqueleto y sistema de diseño M3.**
   - Usar `css/tokens.css` tal cual: modos claro y oscuro, con contraste estándar, medio y alto.
   - Componentes M3 base.
   - Navegación adaptable a las 4 clases de ventana.
   - Enrutamiento, estado y persistencia.
   - Panel de inicio con el mapa de recorrido.
   - Una página `estilos.html` que muestre todos los tokens y componentes en los dos modos.
2. **Motor de actividades, gráficos y animaciones.**
   - Todos los tipos de actividad funcionando con contenido de prueba, accesibles por teclado y probados en mobile, tablet y desktop.
   - El componente de gráficos.
   - El componente de animación didáctica paso a paso.
   - El botón "Escuchar la lección".
   - Todos los estados de carga, error, sin conexión y vacíos, con el parámetro `?simular=` para revisarlos.
   - El componente de video con fachada y el motor de animaciones por escenas, con una animación piloto (la de predicción de tokens) aprobada por Lourdes antes de producir las demás.
3. **Bloque 1** (módulos 0 a 3) con contenido completo.
4. **Bloque 2** (módulos 4 a 8). Incluye el laboratorio y la biblioteca de prompts.
5. **Bloque 3** (módulos 9 y 10). Incluye `marco-legal.json`.
6. **Bloque 4** (módulos 11 a 13). Incluye `herramientas.json`, la tabla comparativa y el generador de sesiones de voz.
7. **Bloque 5** (módulos 14 a 17). Incluye los constructores de brief, prompt visual y storyboard.
8. **Bloques 6 y 7** (módulos 18 a 20). Incluye el constructor de flujos, el proyecto final, el autodiagnóstico comparado y el certificado.
9. **Transversales.** Glosario, fuentes, diario, exportar/importar y guía para facilitadores.
10. **Revisión final:**
   - accesibilidad (contraste, teclado, lector de pantalla);
   - prueba en mobile;
   - enlaces verificados;
   - búsqueda de "—" y "·" en todo el texto;
   - revisión de que no quede texto en inglés sin traducir, y de que cada cita traducida tenga el original y su etiqueta;
   - ortografía;
   - capturas de cada clase de ventana en los dos modos para que Lourdes las revise;
   - README con instrucciones para publicar en GitHub Pages y para editar contenidos.

## 9. Criterios de aceptación

- Funciona abriendo `index.html` publicado en GitHub Pages, sin servidor ni build.
- Una persona puede recorrer el taller completo en el celular, en una tablet y en desktop, y cada pantalla usa la navegación y el layout que le corresponden según las clases de ventana de M3.
- Los modos claro, oscuro y contraste alto se ven correctamente en todas las pantallas, incluidos los gráficos y los SVG.
- Todos los colores, formas, tipografías y tiempos de animación salen de los tokens M3.
- Con `prefers-reduced-motion` activado no hay animaciones de movimiento.
- Cada gráfico tiene una alternativa en texto o tabla.
- El panel de inicio y la agenda respetan el prototipo de referencia en las 4 clases de ventana, y no muestran métricas de tiempo de conexión ni rachas.
- Ninguna espera deja la pantalla en blanco ni muestra solo un ícono girando. Cada carga, error, falta de conexión y estado vacío tiene su diseño, su mensaje en español y su anuncio accesible, sin saltos de layout.
- Todos los videos están verificados (canal oficial, disponibilidad y duración), registrados en `videos.json` con fecha, cargan con fachada y tienen pregunta guía, resumen en español y preguntas posteriores.
- Cada animación propia tiene guion, controles, transcripción, versión estática para movimiento reducido y su MP4 con subtítulos para facilitadores.
- No hay texto en otro idioma sin traducir. Cada cita traducida muestra el original en chico, con `lang` correcto y la etiqueta de traducción oficial o propia.
- El progreso se mantiene al cerrar y volver a abrir el navegador.
- Todas las actividades se pueden completar solo con teclado.
- Ningún texto contiene "—" ni "·".
- `npm run verificar` corre sin errores críticos de accesibilidad, sin scroll horizontal y sin errores de consola, en todos los anchos y modos.
- `DECISIONES.md` tiene una entrada por cada pedido y decisión, con el apartado "Solicitado" (solo la versión reformulada), la decisión y la verificación.
- "Mi aprendizaje" muestra progreso, competencias, autodiagnóstico, objetivos y evidencias, y exporta el portafolio.
- Todas las fuentes tienen referencia APA 7 y un enlace verificado.
- Los datos que cambian (funciones, planes, nombres) están solo en `herramientas.json` y `marco-legal.json`, con fecha de actualización.
- Ningún contenido, ejemplo ni actividad está dirigido a menores de edad.
- Ninguna actividad pide cargar datos personales reales: todos los ejemplos usan datos inventados.
- El contenido es original: no hay fragmentos copiados de los cursos de referencia.
- La guía para facilitadores permite dar cada módulo como clase presencial sin preparar material extra.

---

## 10. Forma de trabajo con Lourdes

### Reformular cada pedido antes de ejecutarlo
Lourdes va a pedir cambios rápido y con lenguaje coloquial (por ejemplo: "achicá el espacio entre cards"). Antes de tocar código, **traducí el pedido a una especificación profesional, técnica y breve**, como la escribiría un diseñador y desarrollador web con criterio UX/UI. Pensá qué quiso lograr, no solo qué palabras usó.

Para cada pedido:
1. **Interpretá la intención** de diseño o de producto. ¿Qué problema ve? ¿Densidad, jerarquía, legibilidad, ritmo visual?
2. **Ubicá el alcance:**
   - qué componente o pantalla;
   - qué clases de ventana;
   - qué modos (claro u oscuro);
   - qué token de M3 está en juego.
3. **Proponé el cambio concreto,** respetando el design system. Por ejemplo, cambiar un token de espaciado y no un valor suelto, y mantener la escala de 4 y 8 px.
4. **Revisá los efectos secundarios:** si el cambio, aplicado tal cual, empeora otra cosa (por ejemplo, áreas táctiles por debajo de 48 px, contraste o lectura en mobile), proponé la alternativa correcta y explicá por qué en una línea.
5. **Si el pedido es ambiguo y el resultado cambia mucho según cómo se lea,** hacé **una** pregunta concreta antes de ejecutar. Si es menor, ejecutá la interpretación más razonable y dejala anotada.

**Ejemplo**

Pedido rápido: "achicá el espacio entre cards".

| Solicitado (así queda en el registro) |
|---|
| **Cambio:** reducir la separación entre tarjetas de módulos en el panel de inicio, de 24 px a 16 px, cambiando el token de espaciado del grid. Se mantienen los márgenes de página. **Alcance:** clases Medium, Expanded y Large; en Compact se mantienen 12 px porque ya es denso. **Motivo inferido:** mostrar más módulos sin hacer scroll y agrupar visualmente cada bloque. **Verificación:** que se distingan los límites entre tarjetas en los modos claro y oscuro, y que no se rompa la grilla en 768 y 1024 px. |

### `DECISIONES.md`: registro de desarrollo
Es el registro del proyecto, escrito como lo llevaría un estudio de diseño y desarrollo: claro, técnico sin ser complejo y fácil de leer para alguien no programador. **Cada entrada tiene:**
- **Fecha y título breve.**
- **Solicitado:** la especificación reformulada de arriba. **No copies el pedido textual de Lourdes** en el registro: va solo la versión profesional.
- **Decisión y motivo,** en 1 a 3 líneas.
- **Archivos o componentes afectados.**
- **Verificación realizada:** pantallas, modos y chequeos de accesibilidad, con el resultado.
- **Pendientes o riesgos,** si quedan.

**Otras reglas del registro**
- Registrá también las decisiones que tomes por tu cuenta (librerías, interpretaciones del brief, enlaces que no se pudieron verificar).
- Mantené al principio del archivo un **índice de decisiones vigentes**. Si una decisión reemplaza a otra, marcá la anterior como reemplazada en lugar de borrarla.

### Verificación completa después de cada cambio
Nada se da por terminado sin verificar el producto completo, no solo la línea de código que cambió.

**Herramientas de verificación (solo para desarrollo)**
Lourdes no tiene aplicaciones de testing instaladas. Usá herramientas que se instalan como dependencias de desarrollo del proyecto y que no se publican en el sitio:
- **Playwright** con Chromium, para abrir el sitio y sacar capturas automáticas.
- **axe-core** (por ejemplo con `@axe-core/playwright`), para el chequeo automático de accesibilidad.
- Opcional: **Lighthouse** por línea de comandos, para rendimiento, accesibilidad y buenas prácticas.

Configuralas en un `package.json` solo para desarrollo, con `node_modules/` en `.gitignore`. El sitio publicado sigue siendo HTML, CSS y JS sin build. Documentá en el README cómo correr los chequeos con un solo comando, por ejemplo `npm run verificar`.

**Qué hace `npm run verificar`**
1. Levanta un servidor local.
2. Recorre las pantallas principales:
   - inicio;
   - una lección de cada tipo de actividad;
   - Mi aprendizaje;
   - Biblioteca;
   - glosario;
   - facilitadores.
3. Saca capturas en 360, 412, 768, 1024, 1280 y 1920 px, en modo claro y oscuro. Las guarda en `/verificacion/capturas/` (fuera del sitio publicado).
4. Corre axe-core en cada pantalla y en cada modo. Genera `/verificacion/reporte-accesibilidad.md` con los problemas encontrados, en español y agrupados por gravedad.
5. Comprueba:
   - que los estados simulados (`?simular=lento`, `?simular=error`) se vean bien en todos los anchos;
   - que no haya scroll horizontal en ningún ancho;
   - que las áreas táctiles midan 48 px como mínimo en mobile;
   - que no haya errores en la consola;
   - que `prefers-reduced-motion` desactive las animaciones de movimiento.

**Revisión visual y manual (además de lo automático)**
- **Mirá las capturas vos mismo** y revisá:
  - jerarquía;
  - alineación;
  - espacios;
  - cortes de texto;
  - superposiciones;
  - estados vacíos;
  - consistencia con M3.
- **Probá con teclado** el flujo completo de una lección: Tab, Shift+Tab, Enter, Espacio, flechas y Escape en diálogos. Verificá el orden del foco y que el foco sea visible.
- **Revisá la estructura semántica:** encabezados en orden, *landmarks*, nombres accesibles, `lang` en citas en otro idioma, textos alternativos y alternativas en tabla de los gráficos.

**Panel de accesibilidad dentro del sitio**
Para que Lourdes pueda revisar sin instalar nada, sumá un modo de diagnóstico que se activa con `?diagnostico=1` en la URL. Ese modo:
- carga axe-core desde un CDN con versión fija;
- muestra en un panel lateral los problemas de la pantalla actual, en español;
- tiene un botón para ver el sitio en los anchos de mobile, tablet y desktop dentro de un marco.

Este modo no se carga para el resto de las personas.

**Aclaración honesta en el reporte**
Las herramientas automáticas detectan solo una parte de los problemas de accesibilidad. El reporte tiene que listar qué se revisó a mano y qué conviene probar con personas usuarias reales o con un lector de pantalla (NVDA en Windows, VoiceOver en iOS o TalkBack en Android) cuando haya oportunidad.

### Cierre de cada tarea
Al terminar cada pedido o etapa, respondé con:
- qué se hizo (en 2 a 4 líneas);
- qué se verificó y con qué resultado;
- las capturas más relevantes (mobile, tablet y desktop);
- qué decisión necesita a Lourdes, si hay alguna.

Sin jerga innecesaria: si usás un término técnico, explicalo en pocas palabras.
