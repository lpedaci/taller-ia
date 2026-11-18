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
