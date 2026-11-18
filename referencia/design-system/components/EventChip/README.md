# EventChip
Chips y tarjetas de evento para la agenda, los pendientes y los próximos eventos.

**Grupos de tipos de evento**

| Grupo | Tipos |
|---|---|
| `entrega` | Cierres y entregas |
| `eval` | Aperturas, parciales y finales |
| `vivo` | Videollamadas y tutorías |
| `workshop` | Workshops |

**Colores:** cada grupo usa sus tokens `app-event-<grupo>-container`, `-on-container` y `-accent`, ya validados en los cuatro temas.

**Siempre con ícono y texto:** el color nunca es la única señal del tipo de evento.

**Estados de la tarjeta de evento (`evt`)**
- Normal.
- En curso (`now`): borde `primary`.
- Finalizado (`past`): opacidad 0,6.
