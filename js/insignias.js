/* Taller - IA | Insignias (D-078)
   Cada módulo tiene su insignia: una base común (forma por bloque, color del bloque, cinta con el nombre)
   y un emblema propio del tema, al estilo de las insignias de las capacitaciones de Google.
   Se dibujan en SVG con los tokens --app-insignia-b1 a b7 (un color por bloque) y --app-insignia-logro (recorrido completo), así se ven bien en claro, oscuro y contraste alto.
   insigniaSVG(id, { estado, titulo }) devuelve el SVG; id es el número de módulo o "recorrido". */

const W = 240, H = 240, CX = 120, CY = 108, R = 96;

/* ---------- Formas de M3 Expressive, una por bloque ---------- */
// Se dibujan por muestreo polar: r(θ) define la forma y el contorno queda suave
function formaPolar(fn, n = 240) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2, r = fn(t);
    d += `${i ? "L" : "M"}${(CX + r * Math.cos(t)).toFixed(1)},${(CY + r * Math.sin(t)).toFixed(1)}`;
  }
  return d + "Z";
}
// Polígono regular con esquinas redondeadas: mezcla del polígono con el círculo
const poligono = (lados, suave = 0.35, giro = 0) => t => {
  const seg = (Math.PI * 2) / lados, a = ((t + Math.PI / 2 - giro) % seg + seg) % seg - seg / 2;
  const poly = (R * Math.cos(Math.PI / lados)) / Math.cos(a);
  return poly * (1 - suave) + R * 0.93 * suave;
};
const FORMAS = {
  1: () => R * 0.97,                                  // Comprender: círculo
  2: t => R * (0.93 + 0.06 * Math.cos(8 * t)),         // Criterio: galleta de 8 ondas
  3: poligono(6, 0.4),                                 // Ética y datos: hexágono suave
  4: t => R * (0.9 + 0.08 * Math.cos(4 * t)),          // Asistentes: trébol de 4 lóbulos
  5: t => R * (0.93 + 0.05 * Math.cos(12 * t)),        // Crear: sol de 12 rayos suaves
  6: poligono(4, 0.32, Math.PI / 4),                   // Automatizar: cuadrado redondeado
  7: poligono(5, 0.38),                                // Aplicar: pentágono suave
  recorrido: poligono(8, 0.3, Math.PI / 8)          // Recorrido completo: octógono suave (elegido por Lourdes)
};

/* ---------- Emblemas: un dibujo propio por módulo ---------- */
// Trazos redondeados de 4 px. Colores: a = acento, o = texto sobre el contenedor, c = contenedor
// El destello de cuatro puntas es el símbolo de la IA en todas las insignias
const brillo = (x, y, r, color) => {
  const k = r * 0.22;
  return `<path d="M${x} ${y - r} Q${x + k} ${y - k} ${x + r} ${y} Q${x + k} ${y + k} ${x} ${y + r} Q${x - k} ${y + k} ${x - r} ${y} Q${x - k} ${y - k} ${x} ${y - r}Z" fill="${color}"/>`;
};
// Engranaje: dientes trapezoidales alrededor de un círculo, con un agujero al centro
const engranaje = (cx, cy, r, dientes, color, hueco) => {
  let d = "";
  for (let i = 0; i < dientes * 4; i++) {
    const t = (i / (dientes * 4)) * Math.PI * 2, rr = (i % 4 === 1 || i % 4 === 2) ? r + 7 : r;
    d += `${i ? "L" : "M"}${(cx + rr * Math.cos(t)).toFixed(1)} ${(cy + rr * Math.sin(t)).toFixed(1)}`;
  }
  return `<path d="${d}Z" fill="${color}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.38).toFixed(1)}" fill="${hueco}"/>`;
};
const EMBLEMAS = {
  // Bienvenida y punto de partida: un pin de ubicación y un camino de puntos hasta una bandera
  0: ({ a, o, c }) => `
    <ellipse cx="96" cy="148" rx="15" ry="4.5" fill="${o}" fill-opacity=".25"/>
    <path d="M96 146 C82 128 72 114 72 100 a24 24 0 0 1 48 0 c0 14 -10 28 -24 46z" fill="${a}"/>
    <circle cx="96" cy="100" r="9" fill="${c}"/>
    <path d="M112 150 C134 150 146 136 158 128 S172 120 176 118" fill="none" stroke="${o}" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="0.1 10"/>
    <path d="M172 120 v-34" stroke="${o}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M173 86 l18 6 -18 6z" fill="${o}"/>`,
  // ¿Qué es la inteligencia artificial?: una lupa que examina el destello de la IA
  1: ({ a, o, c }) => `
    <circle cx="110" cy="98" r="36" fill="${c}" stroke="${o}" stroke-width="6"/>
    ${brillo(110, 98, 24, a)}
    ${brillo(152, 64, 9, a)}
    <path d="M136 124 L162 150" stroke="${o}" stroke-width="11" stroke-linecap="round"/>`,
  // Capacidades, límites y riesgos: un triángulo de advertencia y el destello de la IA
  3: ({ a, o, c }) => `
    <path d="M114 58 L166 148 H62 Z" fill="${a}" stroke="${a}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M114 88 v30" stroke="${c}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="114" cy="134" r="5.5" fill="${c}"/>
    ${brillo(164, 70, 13, o)}`,
  // Ingeniería de prompts I: una barra de prompt con el cursor y el botón de enviar
  5: ({ a, o, c }) => `
    ${brillo(120, 64, 13, a)}
    <rect x="56" y="88" width="128" height="46" rx="23" fill="${c}" stroke="${o}" stroke-width="4"/>
    <rect x="76" y="106" width="42" height="9" rx="4.5" fill="${o}"/>
    <path d="M124 100 v22" stroke="${a}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="160" cy="111" r="15" fill="${a}"/>
    <path d="M160 119 v-15 M153 110 l7 -7 7 7" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="76" y="144" width="88" height="7" rx="3.5" fill="${o}" fill-opacity=".35"/>`,
  // Ingeniería de prompts II: pasos numerados que se encadenan sobre una barra de prompt
  6: ({ a, o, c }) => `
    ${[[74, "1"], [120, "2"], [166, "3"]].map(([x, n]) => `<circle cx="${x}" cy="78" r="15" fill="${o}"/><text x="${x}" y="84" text-anchor="middle" font-size="16" font-weight="650" fill="${c}">${n}</text>`).join("")}
    <path d="M92 78 h10 M138 78 h10" stroke="${a}" stroke-width="4" stroke-linecap="round"/>
    <path d="M99 73 l5 5 -5 5 M145 73 l5 5 -5 5" fill="none" stroke="${a}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="58" y="110" width="124" height="40" rx="20" fill="${c}" stroke="${o}" stroke-width="4"/>
    <rect x="76" y="126" width="54" height="8" rx="4" fill="${o}"/>
    <circle cx="160" cy="130" r="12" fill="${a}"/>
    <path d="M160 136 v-12 M155 129 l5 -5 5 5" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  // Discernimiento: evaluar la respuesta, una lupa con un tilde sobre un documento
  7: ({ a, o, c }) => `
    <rect x="64" y="58" width="76" height="98" rx="8" fill="${c}" stroke="${o}" stroke-width="4"/>
    <path d="M78 80 h48 M78 96 h36 M78 112 h44 M78 128 h28" stroke="${o}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="142" cy="118" r="26" fill="${c}" stroke="${a}" stroke-width="6"/>
    <path d="M130 118 l9 9 15 -16" fill="none" stroke="${a}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M161 137 L178 154" stroke="${a}" stroke-width="10" stroke-linecap="round"/>`,
  // Diligencia: hacerse cargo de lo que se publica, un documento firmado y la lapicera
  8: ({ a, o, c }) => `
    <rect x="62" y="56" width="86" height="104" rx="8" fill="${c}" stroke="${o}" stroke-width="4"/>
    <path d="M76 78 h56 M76 94 h44 M76 110 h52" stroke="${o}" stroke-width="4" stroke-linecap="round"/>
    <path d="M76 140 c8 -14 14 8 22 -4 s12 8 20 -2" fill="none" stroke="${a}" stroke-width="3.5" stroke-linecap="round"/>
    <g transform="rotate(38 156 112)">
      <rect x="150" y="70" width="13" height="50" rx="3" fill="${o}"/>
      <path d="M150 120 l6.5 14 6.5 -14z" fill="${a}"/>
    </g>`,
  // Ética de la inteligencia artificial: una balanza
  9: ({ a, o }) => `
    <circle cx="120" cy="62" r="7" fill="${a}"/>
    <path d="M120 68 v76 M98 150 h44 M72 80 h96" stroke="${o}" stroke-width="5" stroke-linecap="round"/>
    <path d="M72 80 L58 116 M72 80 L86 116 M168 80 L154 116 M168 80 L182 116" stroke="${o}" stroke-width="2.5"/>
    <path d="M54 116 q18 18 36 0z M150 116 q18 18 36 0z" fill="${a}"/>`,
  // Los cuatro asistentes: cuatro globos de chat, cada uno con su marca
  11: ({ a, o, c }) => {
    const globo = (x, y, color, marca) => `<path d="M${x + 10} ${y} h30 a10 10 0 0 1 10 10 v20 a10 10 0 0 1 -10 10 h-22 l-10 9 v-9 h-8 a10 10 0 0 1 -10 -10 v-20 a10 10 0 0 1 10 -10z" fill="${color}"/>${marca}`;
    return globo(62, 58, a, `<circle cx="87" cy="78" r="7" fill="${c}"/>`) +
      globo(128, 58, o, brillo(153, 78, 10, c)) +
      globo(62, 110, o, `<rect x="80" y="123" width="14" height="14" rx="2" transform="rotate(45 87 130)" fill="${c}"/>`) +
      globo(128, 110, a, `<path d="M153 121 l9 16 h-18z" fill="${c}"/>`);
  },
  // Conversar con la IA por voz: un micrófono con ondas de sonido
  12: ({ a, o }) => `
    <rect x="104" y="56" width="32" height="58" rx="16" fill="${a}"/>
    <path d="M90 98 a30 30 0 0 0 60 0" fill="none" stroke="${o}" stroke-width="5" stroke-linecap="round"/>
    <path d="M120 128 v16 M104 148 h32" stroke="${o}" stroke-width="5" stroke-linecap="round"/>
    <path d="M78 78 q-9 18 0 36 M64 68 q-16 28 0 56 M162 78 q9 18 0 36 M176 68 q16 28 0 56" fill="none" stroke="${o}" stroke-width="4" stroke-linecap="round"/>`,
  // IA generativa aplicada al trabajo: un maletín con el destello de la IA
  13: ({ a, o, c }) => `
    <path d="M100 82 v-10 a6 6 0 0 1 6 -6 h28 a6 6 0 0 1 6 6 v10" fill="none" stroke="${o}" stroke-width="5"/>
    <rect x="62" y="82" width="116" height="70" rx="10" fill="${o}"/>
    <path d="M62 110 h116" stroke="${c}" stroke-width="4"/>
    <rect x="111" y="102" width="18" height="16" rx="4" fill="${a}"/>
    ${brillo(170, 66, 14, a)}`,
  // IA para programar: una ventana de código con </>
  14: ({ a, o, c }) => `
    <rect x="58" y="62" width="124" height="94" rx="10" fill="${c}" stroke="${o}" stroke-width="4"/>
    <path d="M60 82 h120" stroke="${o}" stroke-width="4"/>
    <circle cx="72" cy="72" r="3.5" fill="${o}"/><circle cx="84" cy="72" r="3.5" fill="${o}"/><circle cx="96" cy="72" r="3.5" fill="${o}"/>
    <path d="M98 104 l-16 15 16 15 M142 104 l16 15 -16 15" fill="none" stroke="${a}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M128 98 l-16 42" stroke="${o}" stroke-width="5" stroke-linecap="round"/>`,
  // IA para imagen: un cuadro con un paisaje y el destello de la IA
  15: ({ a, o, c }) => `
    <rect x="58" y="66" width="108" height="84" rx="8" fill="${c}" stroke="${o}" stroke-width="4"/>
    <path d="M62 146 l30 -36 18 20 14 -14 38 30z" fill="${a}"/>
    <circle cx="138" cy="90" r="9" fill="${a}"/>
    ${brillo(170, 64, 16, o)}`,
  // IA para audio, voz y música: notas musicales sobre una onda de audio
  16: ({ a, o }) => `
    <path d="M100 66 L146 56 v14 L100 80z" fill="${o}"/>
    <path d="M100 74 v50 M146 64 v50" stroke="${o}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="89" cy="124" rx="13" ry="10" transform="rotate(-20 89 124)" fill="${o}"/>
    <ellipse cx="135" cy="114" rx="13" ry="10" transform="rotate(-20 135 114)" fill="${o}"/>
    ${[6, 14, 22, 12, 26, 16, 8, 20, 10, 4].map((h, i) => `<path d="M${66 + i * 12} ${150 - h / 2} v${h}" stroke="${a}" stroke-width="5" stroke-linecap="round"/>`).join("")}`,
  // IA para video y animación: una claqueta de cine con el botón de reproducir
  17: ({ a, o, c }) => `
    <rect x="62" y="92" width="116" height="64" rx="8" fill="${o}"/>
    <g transform="rotate(-12 64 90)">
      <rect x="62" y="70" width="116" height="20" rx="4" fill="${c}" stroke="${o}" stroke-width="4"/>
      <path d="M82 72 l-10 16 M106 72 l-10 16 M130 72 l-10 16 M154 72 l-10 16" stroke="${o}" stroke-width="7"/>
    </g>
    <path d="M110 108 v32 l26 -16z" fill="${a}"/>`,
  // De la conversación a la automatización: dos engranajes y un globo de chat
  18: ({ a, o, c }) => `
    ${engranaje(102, 108, 28, 8, o, c)}
    ${engranaje(150, 76, 16, 6, a, c)}
    <path d="M146 116 h30 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-18 l-8 8 v-8 h-4 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8z" fill="${a}"/>
    <circle cx="152" cy="132" r="3" fill="${c}"/><circle cx="161" cy="132" r="3" fill="${c}"/><circle cx="170" cy="132" r="3" fill="${c}"/>`,
  // Diseñar formación con IA: una pizarra en su atril, con un gráfico y el destello de la IA
  19: ({ a, o, c }) => `
    <path d="M88 130 l-12 28 M152 130 l12 28 M120 130 v22" stroke="${o}" stroke-width="5" stroke-linecap="round"/>
    <rect x="60" y="58" width="120" height="74" rx="6" fill="${c}" stroke="${o}" stroke-width="4"/>
    <path d="M80 116 v-16 M96 116 v-28 M112 116 v-20" stroke="${a}" stroke-width="9" stroke-linecap="round"/>
    <path d="M76 120 h48" stroke="${o}" stroke-width="3" stroke-linecap="round"/>
    ${brillo(152, 94, 16, a)}`,
  // Proyecto final: un cohete despegando
  20: ({ a, o, c }) => `
    <path d="M120 52 c20 16 26 40 23 70 h-46 c-3 -30 3 -54 23 -70z" fill="${c}" stroke="${o}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="120" cy="88" r="10" fill="${a}" stroke="${o}" stroke-width="3"/>
    <path d="M97 100 l-16 24 v14 l16 -12z M143 100 l16 24 v14 l-16 -12z" fill="${o}"/>
    <path d="M106 124 q14 38 14 38 q0 0 14 -38z" fill="${a}"/>`,
  // Cómo funciona un modelo de lenguaje: un globo de diálogo (el lenguaje) con una red neuronal adentro (el modelo)
  2: ({ a, o, c }) => {
    const capas = [[88, [92, 116]], [120, [80, 104, 128]], [152, [92, 116]]];
    let lineas = "";
    for (let k = 0; k < capas.length - 1; k++) for (const y1 of capas[k][1]) for (const y2 of capas[k + 1][1])
      lineas += `<path d="M${capas[k][0]} ${y1} L${capas[k + 1][0]} ${y2}" stroke="${o}" stroke-width="2.5" stroke-opacity=".55"/>`;
    const nodos = capas.map(([x, ys], k) => ys.map(y => `<circle cx="${x}" cy="${y}" r="${k === 1 ? 8 : 7}" fill="${k === 1 ? a : o}" stroke="${c}" stroke-width="2.5"/>`).join("")).join("");
    return `<path d="M71 60 h98 a14 14 0 0 1 14 14 v62 a14 14 0 0 1 -14 14 h-59 l-20 16 v-16 h-19 a14 14 0 0 1 -14 -14 v-62 a14 14 0 0 1 14 -14z" fill="${c}" stroke="${o}" stroke-width="4" stroke-linejoin="round"/>
      ${lineas}${nodos}`;
  },
  // Delegación: una lista de tareas, cada una asignada a una persona o a la IA (el destello), y tildadas
  4: ({ a, o, c }) => {
    const persona = y => `<circle cx="88" cy="${y - 4}" r="5" fill="${o}"/><path d="M80 ${y + 8} q0 -8 8 -8 q8 0 8 8z" fill="${o}"/>`;
    const ia = y => `<path d="M88 ${y - 11} q2 7 9 9 q-7 2 -9 9 q-2 -7 -9 -9 q7 -2 9 -9z" fill="${a}"/>`;
    const fila = (y, quien) => `${quien(y)}<path d="M104 ${y} h32" stroke="${o}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M144 ${y - 1} l5 5 9 -10" fill="none" stroke="${a}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<rect x="68" y="60" width="104" height="104" rx="10" fill="${c}" stroke="${o}" stroke-width="4"/>
      <rect x="100" y="52" width="40" height="16" rx="5" fill="${o}"/>
      ${fila(88, persona)}${fila(114, ia)}${fila(140, persona)}`;
  },
  // Datos personales y marco legal: un documento con datos tapados y un escudo que lo protege
  10: ({ a, o, c }) => `
    <path d="M70 62 h52 l18 18 v70 a6 6 0 0 1 -6 6 h-64 a6 6 0 0 1 -6 -6 v-82 a6 6 0 0 1 6 -6z" fill="${c}" stroke="${o}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M122 62 v18 h18" fill="none" stroke="${o}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M78 92 h30" stroke="${o}" stroke-width="4" stroke-linecap="round"/>
    <rect x="76" y="102" width="46" height="10" rx="3" fill="${o}"/>
    <path d="M78 122 h22" stroke="${o}" stroke-width="4" stroke-linecap="round"/>
    <rect x="76" y="132" width="34" height="10" rx="3" fill="${o}"/>
    <path d="M150 100 l26 9 v20 c0 18 -12 28 -26 34 c-14 -6 -26 -16 -26 -34 v-20z" fill="${a}"/>
    <path d="M139 130 l8 8 15 -16" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  // Recorrido completo: un birrete mitad clásico (con su borla) y mitad red neuronal. Idea de Lourdes (D-078)
  recorrido: ({ a, o, c }) => {
    const id = "rc" + Math.random().toString(36).slice(2, 7);
    const tabla = "M44 94 L118 64 L198 96 L124 126 Z", cuerpo = "M78 108 L78 138 Q122 160 168 138 L168 110 L124 126 Z";
    // Malla de la mitad derecha: nodos y conexiones entre los más cercanos
    const nodos = [[121, 66], [140, 74], [160, 82], [180, 90], [196, 96], [124, 90], [146, 92], [168, 100], [130, 110], [152, 112], [124, 124],
      [126, 136], [146, 130], [164, 124], [132, 150], [152, 146], [166, 138]];
    const lineas = [];
    nodos.forEach(([x1, y1], i) => nodos.forEach(([x2, y2], j) => { if (j > i && Math.hypot(x2 - x1, y2 - y1) < 27) lineas.push(`M${x1} ${y1} L${x2} ${y2}`); }));
    return `<defs><clipPath id="${id}"><rect x="121" y="40" width="100" height="140"/></clipPath></defs>
      <g transform="translate(123 110) scale(.92) translate(-124.5 -114)">
      <path d="${cuerpo}" fill="${o}"/>
      <path d="${tabla}" fill="${o}" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>
      <g clip-path="url(#${id})">
        <path d="${cuerpo}" fill="${a}"/><path d="${tabla}" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
        <path d="${lineas.join(" ")}" stroke="${c}" stroke-width="1.6" stroke-opacity=".85"/>
        ${nodos.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 2.6 : 3.6}" fill="${c}"/>`).join("")}
      </g>
      <ellipse cx="118" cy="92" rx="9" ry="4" fill="${o}" stroke="${c}" stroke-width="1.5"/>
      <path d="M112 93 Q72 92 62 108 L62 128" fill="none" stroke="${o}" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="57" y="126" width="10" height="5" rx="1.5" fill="${a}"/>
      <path d="M57 131 L51 164 Q62 168 73 164 L67 131 Z" fill="${o}"/>
      <path d="M57 140 L55 162 M62 140 L62 165 M67 140 L69 162" stroke="${c}" stroke-width="1.2" stroke-opacity=".5"/>
      </g>`;
  }
};

/* Centrado medido: cada emblema se corre [dx, dy] para que el centro de su caja quede en (120, 108), el centro
   de la forma. Los valores salen de medir la caja de cada emblema en el navegador; npm run verificar lo comprueba (D-078) */
const AJUSTE = { 0: [-11.5, -6.2], 1: [2, 5.5], 2: [0, -5], 3: [0.5, 5.5], 5: [0, 7], 6: [0, 1.5], 7: [-1, 1], 8: [-4.7, 0], 9: [0, 5.5], 10: [0, -4.5], 11: [5, -0.5], 12: [0, 6], 13: [-3, 6], 14: [0, -1], 15: [-2, 9], 16: [0, -1.5], 17: [2.1, 6.6], 18: [-5.8, 3.5], 20: [0, 1], "recorrido": [-0.1, -2.2] };

const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

/**
 * Dibuja una insignia.
 * id: número de módulo o "recorrido". bloque: número de bloque del módulo.
 * estado: "ganada" (a color) o "pendiente" (solo el contorno, en gris). titulo y cinta: textos.
 */
export function insigniaSVG({ id, bloque, titulo, cinta, estado = "ganada", tam = 160, etiqueta }) {
  const esRecorrido = String(id).startsWith("recorrido");
  const k = esRecorrido ? "recorrido" : bloque;
  const forma = formaPolar(FORMAS[k] || FORMAS[1]);
  const v = esRecorrido ? "logro" : `b${bloque}`;
  const ganada = estado === "ganada";
  const col = ganada
    ? { a: `var(--app-insignia-${v}-accent)`, o: `var(--app-insignia-${v}-on)`, c: `var(--app-insignia-${v}-container)` }
    : { a: "var(--md-sys-color-outline)", o: "var(--md-sys-color-outline)", c: "var(--md-sys-color-surface-container-highest)" };
  const fondo = col.c;
  const emblema = EMBLEMAS[id] ? EMBLEMAS[id](col) : `<text x="120" y="122" text-anchor="middle" font-size="44" font-weight="650" fill="${col.o}">${esc(id)}</text>`;
  const num = esRecorrido ? "" : `<circle cx="120" cy="22" r="17" fill="${col.a}"/><text x="120" y="28.5" text-anchor="middle" font-size="17" font-weight="650" fill="${ganada ? col.c : "var(--md-sys-color-surface)"}">${esc(id)}</text>`;
  const t = esc(cinta || titulo || "");
  const largo = t.length > 18 ? 12.5 : 14;
  return `<svg class="insignia${ganada ? "" : " is-pend"}" viewBox="0 0 ${W} ${H}" width="${tam}" height="${tam}" role="img" aria-label="${esc(etiqueta || titulo || "")}" xmlns="http://www.w3.org/2000/svg" font-family="Roboto Flex, system-ui, sans-serif">
    <path d="${forma}" fill="${fondo}" stroke="${col.a}" stroke-width="${ganada ? 6 : 3}" ${ganada ? "" : 'stroke-dasharray="10 8"'}/>
    <g class="emblema"${AJUSTE[id] ? ` transform="translate(${AJUSTE[id][0]} ${AJUSTE[id][1]})"` : ""}>${emblema}</g>
    ${num}
    <g transform="translate(120 196)">
      <path d="M-104 -20 h208 l-10 20 10 20 h-208 l10 -20z" fill="${ganada ? col.a : "var(--md-sys-color-surface-container-highest)"}" ${ganada ? "" : `stroke="${col.a}" stroke-width="2"`}/>
      <text y="5" text-anchor="middle" font-size="${largo}" font-weight="650" letter-spacing=".02em" fill="${ganada ? col.c : "var(--md-sys-color-on-surface-variant)"}">${t}</text>
    </g>
  </svg>`;
}

/** Nombres cortos para la cinta de cada insignia */
export const CINTA = {
  0: "Punto de partida", 1: "Qué es la IA", 2: "Modelos de lenguaje", 3: "Límites y riesgos",
  4: "Delegación", 5: "Prompts I", 6: "Prompts II", 7: "Discernimiento", 8: "Diligencia",
  9: "Ética de la IA", 10: "Datos personales", 11: "Los asistentes", 12: "IA por voz", 13: "IA en el trabajo",
  14: "IA para programar", 15: "IA para imagen", 16: "Audio y música", 17: "Video y animación",
  18: "Automatizar", 19: "Diseñar formación", 20: "Proyecto final", recorrido: "Recorrido completo"
};
