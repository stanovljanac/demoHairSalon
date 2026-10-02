import { HOURS } from '../data.js';

export function initVisit() {
  document.getElementById('hours').innerHTML = HOURS.map(h =>
    `<div${h.closed ? ' class="closed"' : ''}><span>${h.d}</span><span>${h.t}</span></div>`).join('');
}
