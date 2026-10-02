import { store } from '../store.js';
import { SERVICES, CATS, PANELS } from '../data.js';
import { priceOf, esc } from '../format.js';
import { CONFIG } from '../config.js';

// Category tabs, the animated panel for each category, and the service list.
export function initServices(onRender) {
  const tabs = document.getElementById('cat-tabs');
  const stage = document.getElementById('svc-stage');
  const title = document.getElementById('svc-panel-title');
  const note = document.getElementById('svc-panel-note');
  const list = document.getElementById('svc-list');
  document.querySelector('mb-cutline').setAttribute('mode', CONFIG.cutMode === 'loop' ? 'loop' : 'scroll');

  tabs.innerHTML = CATS.map(c =>
    `<button class="cat-tab" role="tab" type="button" data-cat="${c.id}"><span>${esc(c.label)}</span></button>`).join('');
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) store.set({ cat: b.dataset.cat }); });
  list.addEventListener('click', e => {
    const b = e.target.closest('[data-svc]'); if (!b) return;
    const s = store.get(), x = SERVICES[s.cat].find(v => v.id === b.dataset.svc);
    store.set({ svc: s.svc && s.svc.id === x.id ? null : x, booked: false });
  });

  let cat = null, svcId;
  store.subscribe(s => {
    const id = s.svc ? s.svc.id : null;
    if (s.cat === cat && id === svcId) return;
    const catChanged = s.cat !== cat; cat = s.cat; svcId = id;

    if (!catChanged) {
      // Same category: just flip the selected row in place.
      list.querySelectorAll('[data-svc]').forEach(b => {
        const on = b.dataset.svc === id;
        b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on));
      });
      return;
    }
    tabs.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.cat === cat)));
    const p = PANELS[cat]; stage.innerHTML = p.html; title.textContent = p.title; note.textContent = p.note;
    list.innerHTML = SERVICES[cat].map((x, i) => {
      const on = id === x.id;
      // The whole row is the toggle: click a service to pick it for booking, click again to clear it.
      return `<button type="button" class="svc${on ? ' is-on' : ''}" data-svc="${x.id}" aria-pressed="${on}" data-reveal="1" data-delay="${i * 70}">
        <span class="svc-info"><span class="svc-title"><span class="svc-name">${esc(x.name)}</span><span class="svc-dur">${x.dur}</span></span><span class="svc-desc">${esc(x.desc)}</span></span>
        <span class="svc-price">${priceOf(x)}</span>
      </button>`;
    }).join('');
    onRender && onRender();
  });
}
