# StatusMessage
Mensajes y estados semánticos: prohibido o error, atención, positivo, información y deshabilitado.

**Anatomía**
- Contenedor del estado (`*-container`) con esquina `medium` (12 px).
- Ícono propio del estado.
- Título en `title-small`, y texto que explica qué pasó y qué hacer.

**Íconos por estado**

| Estado | Ícono |
|---|---|
| Prohibido o error | `block` o `error` |
| Atención | `warning` |
| Positivo | `check_circle` |
| Información | `info` |

**Variantes de uso**
- **Feedback de actividades:** correcto en éxito; incorrecto en error, con la explicación de por qué.
- **Avisos de agenda:** vence hoy en atención; vencido en error.
- **Notas de lección:** información.
- **Texto suelto con estado** (por ejemplo, "Vence hoy, 23:59"): se usa el color del estado sobre la tarjeta, sin contenedor.

**Deshabilitado:** contenido on-surface al 38% y contenedor al 12%. Siempre se explica por qué un control está deshabilitado, cerca del control.

**Accesibilidad**
- Nunca se depende solo del color.
- Los avisos que aparecen después de una acción se anuncian con `role="status"`; los errores, con `role="alert"`.
