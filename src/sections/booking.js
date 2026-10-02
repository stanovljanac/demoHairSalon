import { store } from '../store.js';
import { TEAM, TIMES, WD, MO } from '../data.js';
import { priceOf, esc } from '../format.js';
import { CONFIG } from '../config.js';

// The next six opening days (Tuesday – Saturday).
function nextDays() {
  const out = []; const d = new Date(); d.setHours(0, 0, 0, 0);
  while (out.length < 6) {
    d.setDate(d.getDate() + 1); const w = d.getDay();
    if (w >= 2) out.push({ id: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`, wd: WD[w], num: d.getDate(), mo: MO[d.getMonth()], idx: out.length });
  }
  return out;
}

export function initBooking() {
  const $ = id => document.getElementById(id);
  const days = nextDays();
  const stylists = [{ id: 'any', label: 'Any' }, ...TEAM.map(t => ({ id: t.id, label: t.first }))];

  $('bk-stylists').innerHTML = stylists.map(o => `<button type="button" class="chip" data-stylist="${o.id}">${esc(o.label)}</button>`).join('');
  $('bk-days').innerHTML = days.map(d => `<button type="button" class="chip day" data-day="${d.id}"><span>${d.wd}</span><span>${d.num}</span></button>`).join('');
  $('bk-times').innerHTML = TIMES.map(t => `<button type="button" class="chip time" data-time="${t}">${t}</button>`).join('');

  $('bk-stylists').addEventListener('click', e => { const b = e.target.closest('[data-stylist]'); b && store.set({ stylist: b.dataset.stylist }); });
  $('bk-days').addEventListener('click', e => { const b = e.target.closest('[data-day]'); b && store.set({ day: b.dataset.day, time: null }); });
  $('bk-times').addEventListener('click', e => { const b = e.target.closest('[data-time]'); b && !b.disabled && store.set({ time: b.dataset.time }); });
  $('bk-name').addEventListener('input', e => store.set({ name: e.target.value }));
  $('bk-phone').addEventListener('input', e => store.set({ phone: e.target.value }));
  const canBook = s => !!(s.svc && s.day && s.time && s.name.trim());
  $('bk-form').addEventListener('submit', e => {
    e.preventDefault(); if (!canBook(store.get())) return;
    window.dispatchEvent(new Event('mb-spray')); window.dispatchEvent(new Event('mb-book'));
    store.set({ booked: true });
  });
  $('bk-reset').addEventListener('click', () => store.set({ booked: false, svc: null, day: null, time: null }));

  const toggle = (el, on) => el.classList.toggle('is-on', on);
  store.subscribe(s => {
    const dayObj = days.find(d => d.id === s.day);
    const stylist = TEAM.find(t => t.id === s.stylist);
    const summary = s.svc ? `${s.svc.name} · ${s.svc.dur}${CONFIG.showPrices ? ' · ' + priceOf(s.svc) : ''}` : 'No service selected yet';
    const when = (stylist ? stylist.name : 'Any stylist') + (dayObj ? ` · ${dayObj.wd} ${dayObj.num} ${dayObj.mo}` : '') + (s.time ? ` · ${s.time}` : '');

    $('sel-summary').textContent = summary; $('sel-when').textContent = when;
    $('done-summary').textContent = summary; $('done-when').textContent = when;
    $('done-name').textContent = s.name.trim().split(' ')[0];

    document.querySelectorAll('[data-stylist]').forEach(b => toggle(b, b.dataset.stylist === s.stylist));
    document.querySelectorAll('[data-day]').forEach(b => toggle(b, b.dataset.day === s.day));
    document.querySelectorAll('[data-time]').forEach((b, i) => {
      const off = !dayObj || (dayObj.idx + i) % 4 === 0;
      b.disabled = off; b.classList.toggle('is-struck', !!dayObj && off); toggle(b, s.time === b.dataset.time && !off);
    });

    const ok = canBook(s);
    $('bk-submit').disabled = !ok;
    $('bk-hint').textContent = !s.svc ? 'Choose a service from the menu' : !s.day ? 'Pick a day' : !s.time ? 'Pick a time' : !s.name.trim() ? 'Add your name' : 'Ready when you are';
    if ($('bk-name').value !== s.name) $('bk-name').value = s.name;
    $('bk-form').hidden = s.booked; $('bk-done').hidden = !s.booked;
  });
}
