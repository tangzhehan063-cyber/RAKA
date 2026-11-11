import { registerShot, text, veil } from '/engine/core.js';
import { chibi, OUT } from '../chibi.js';
import * as P from '../sets/palace.js';
registerShot('cover', { draw(g) {
  P.blurBG(g, (g) => P.hall(g, 0), 0.2, 0.15);
  P.throne(g, 540, 1700, 1.4);
  const r = chibi(g, { x: 540, y: 1580, s: 2.1, out: OUT.prince, expr: 'sad', look: [0, 0.4], armL: { to: [370, 1150] }, armR: { to: [710, 1150] } });
  for (const [hx, hy] of r.hands) P.chain(g, hx, -80, hx, hy - 20, 14);
  text(g, 'WHAT IF', 540, 560, { size: 110, font: 'Fredoka', weight: 700, color: '#fff', stroke: 18, strokeColor: P.OL });
  text(g, "YOU WERE", 540, 680, { size: 90, font: 'Fredoka', weight: 700, color: '#fff', stroke: 16, strokeColor: P.OL });
  text(g, 'FIRSTBORN?', 540, 830, { size: 150, font: 'Fredoka', weight: 700, color: '#ffd23a', stroke: 24, strokeColor: P.OL });
  P.brand(g);
} });
