# ProgressIndicator
Indicadores de progreso de M3 (versión 2024 en adelante): la barra activa y la pista quedan separadas por un espacio, y la pista termina en un punto.

- **Lineal (`lin`):** objetivos demostrados y avance de un módulo. Lleva `role="progressbar"` con valor y etiqueta.
- **Anillo (`ring`):** el avance de cada módulo en "Continuar donde dejaste". Al llegar al 100% muestra un tilde.
- **Animación:** la barra crece con un spring *spatial* y respeta el movimiento reducido.
