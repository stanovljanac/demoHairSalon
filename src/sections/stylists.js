import { store, goBook } from '../store.js';
import { TEAM } from '../data.js';
import { esc } from '../format.js';

// Stylist cards of staggered height; portraits tilt under the pointer.
export function initStylists() {
  const grid = document.getElementById('team');
  grid.innerHTML = TEAM.map((t, i) => `
    <div class="member" data-reveal="1" data-delay="${i * 120}">
      <div class="member-photo" data-tilt="1"><image-slot id="site-team-${t.id}" placeholder="Stylist portrait — dark backdrop"></image-slot></div>
      <div class="member-name"><b>${esc(t.name)}</b><span>0${i + 1}</span></div>
      <div class="member-bio"><span>${esc(t.role)}</span><span>${esc(t.bio)}</span></div>
      <button class="member-book" type="button" data-book="${t.id}">Book with ${esc(t.first)} <i class="ph ph-arrow-right"></i></button>
    </div>`).join('');
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-book]'); if (!b) return;
    store.set({ stylist: b.dataset.book, booked: false }); goBook();
  });
}
