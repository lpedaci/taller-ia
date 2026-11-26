# Rúbrica de revisión de paráfrasis y traducción | Taller - IA

Borrador para revisar (tarea 8 del plan). Sale de las secciones 2 ("Regla de contenido") y 5 ("Convenciones de texto" y "Contenido que viene de otro idioma") de `BRIEF_taller-ia.md`. Si el brief cambia, esta rúbrica se actualiza con él: el brief manda.

## Para qué sirve

La usa el modelo en el paso de revisión con IA. Le dice qué mirar, cómo puntuar y qué cuenta como falla, para que no devuelva opiniones vagas.

El taller casi no tiene citas traducidas: está redactado en español a partir de fuentes en inglés. Por eso esta rúbrica revisa sobre todo **paráfrasis**, **títulos traducidos** y **terminología**. Las citas, cuando las haya, siguen las mismas reglas.

## Lo que el modelo NO revisa

Ya lo revisan los scripts, sin IA y sin costo. Repetirlo solo agrega ruido al informe:

- rayas largas, puntos medios, espacios dobles y ortografía con reglas (`npm run textos`);
- texto en inglés sin traducir y citas sin original o sin etiqueta (`npm run textos`);
- enlaces rotos (`npm run enlaces`);
- accesibilidad y contraste (`npm run verificar`).

## Qué recibe el modelo en cada revisión

1. El fragmento del módulo (texto, ruta en el JSON y módulo).
2. El texto de la fuente que ese fragmento sintetiza, leído en la URL de la referencia.
3. El glosario del taller (`content/glosario.json`).
4. Esta rúbrica y los ejemplos ancla (al final).

Si no pudo leer la fuente, no puntúa el criterio 1 y lo informa como "no verificable". **Nunca completa de memoria lo que no pudo leer.** Es la misma regla que ya aplicaste en D-073.

## Criterios

Cada criterio se puntúa de 1 a 3: **3** cumple, **2** se puede mejorar, **1** falla.

### 1. Fidelidad al sentido de la fuente

El fragmento dice lo mismo que la fuente: no agrega, no exagera, no recorta.

- **3:** la idea es la de la fuente, con palabras propias.
- **2:** la idea es correcta pero pierde un matiz que cambia poco (un ejemplo, un orden).
- **1:** afirma algo que la fuente no dice; generaliza lo que la fuente limita ("siempre" donde dice "a veces"); omite una condición que cambia el sentido (un plan, un país, una fecha); o atribuye a la fuente una opinión propia.

Gravedad si falla: **error**.

### 2. Traducción oficial primero

Si la fuente tiene versión oficial en español, se usa y se cita esa versión. Ejemplos del brief: documentos de UNESCO, OCDE y la Unión Europea (EUR-Lex), páginas de ayuda de las herramientas en español, ediciones en castellano.

- **3:** se cita la versión oficial en español, o no existe y el texto lo refleja.
- **2:** existe una versión oficial en español y se cita la versión en inglés, aunque la paráfrasis sea correcta.
- **1:** existe una traducción oficial, el taller usa una traducción propia que la contradice.

Gravedad si falla: **mejora** (2) o **error** (1). El modelo propone la versión oficial que encontró como fuente de reemplazo, con su URL y su referencia en APA 7.

### 3. Terminología consistente con el glosario

- **3:** cada término técnico usa la forma del glosario. La primera aparición de un término en inglés va en español con el original entre paréntesis y en cursiva, salvo los de uso habitual en LATAM (*prompt*, *token*), que van en cursiva con enlace al glosario.
- **2:** se usa un sinónimo aceptable pero distinto del glosario, o falta el original en la primera aparición.
- **1:** se usa un término que contradice el glosario o un calco que cambia el sentido.

Gravedad si falla: **mejora**.

### 4. Naturalidad en español (contexto, no solo concepto)

El texto se lee como escrito en español, no como traducido.

- **3:** sintaxis propia del español; nada delata el inglés de origen.
- **2:** hay calcos menores: gerundios de título ("Construyendo..."), voz pasiva innecesaria, posesivos en exceso ("tu cuenta, tu archivo, tu chat"), mayúsculas de título en inglés.
- **1:** hay falsos amigos que cambian el sentido ("eventualmente" por *eventually*, "asumir" por *assume*, "aplicación" por *application* en contexto de solicitud) o frases que no se entienden sin conocer el original.

Gravedad si falla: **mejora** (2) o **error** (1).

### 5. Registro y público

Español con voseo rioplatense moderado, registro académico profesional, comprensible en toda LATAM, para personas adultas.

- **3:** cumple. Oraciones cortas, un concepto por párrafo, términos técnicos explicados la primera vez.
- **2:** algún modismo muy local, una oración demasiado larga o un término sin explicar.
- **1:** registro inadecuado para el público (infantilizado, coloquial de más o excesivamente técnico sin aviso).

Gravedad si falla: **mejora**.

### 6. Títulos traducidos de las fuentes

Aplica a los títulos de `content/fuentes.json` con `"idioma": "en"`.

- **3:** el título en español transmite el sentido del original y suena natural; la referencia APA conserva el título original.
- **2:** traducción literal que se entiende pero suena forzada.
- **1:** el título en español promete algo distinto de lo que trata la fuente.

Gravedad si falla: **mejora** (2) o **error** (1).

### 7. Datos que cambian rápido

Del brief: nombres de modelos, precios y límites no van en el texto principal; si hacen falta, van en una nota con fecha.

- **3:** no hay datos de ese tipo en el texto principal, o están en una nota fechada.
- **1:** hay un dato de ese tipo en el texto principal sin fecha.

Gravedad si falla: **desactualizado** si el dato ya no coincide con la fuente, **mejora** si coincide pero no tiene fecha.

## Formato de salida

El modelo devuelve un JSON por fragmento. Solo se informan los criterios con puntaje 1 o 2: lo que cumple no ocupa lugar en el Issue.

```json
{
  "fragmento": "content/modulo-11.json > pasos[2].bloques[0].md",
  "fuente": "https://support.claude.com/...",
  "fuente_leida": true,
  "hallazgos": [
    {
      "criterio": 1,
      "puntaje": 1,
      "gravedad": "error",
      "evidencia_taller": "frase exacta del taller",
      "evidencia_fuente": "frase exacta de la fuente que la contradice",
      "sugerencia": "redacción propuesta, en el registro del taller"
    }
  ]
}
```

Reglas del formato:

- **La evidencia es textual**, de los dos lados. Un hallazgo sin evidencia de la fuente no se informa.
- **La sugerencia respeta las convenciones del taller:** voseo moderado, sin rayas largas, sin "·".
- **El modelo propone, no corrige.** Nada se cambia en el repo sin tu revisión.

## Ejemplos ancla

Calibran al modelo. **Los tenés que elegir y validar vos** (tarea 10): estos dos son solo para mostrar el formato.

**Bueno (tomado del taller, a confirmar):**
- Original: *What is ChatGPT doing… and why does it work?*
- Taller: "Qué hace ChatGPT y por qué funciona"
- Por qué: transmite el sentido, suena natural y no arrastra la estructura del inglés.

**Malo frente a bueno (el malo es inventado para ilustrar; el bueno es el que ya usa el taller):**
- Original: *Building effective agents*
- Traducción literal, que el taller no usa: "Construyendo agentes efectivos". El gerundio de título es un calco del inglés (criterio 4, puntaje 2).
- Lo que dice el taller: "Cómo construir agentes efectivos". Mismo sentido, estructura del español (criterio 4, puntaje 3).

Faltan: dos buenos y dos malos más, idealmente uno de cada tipo (paráfrasis, título y término).
