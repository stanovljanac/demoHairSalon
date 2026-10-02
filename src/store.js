// Tiny shared state — the services menu, stylist cards and booking form all
// read and write the same selection.
const state = {
  cat: 'care', svc: null, stylist: 'any', day: null, time: null,
  name: '', phone: '', booked: false, menu: false
};
const subs = new Set();

export const store = {
  get: () => state,
  set(patch) { Object.assign(state, patch); subs.forEach(fn => fn(state)); },
  subscribe(fn) { subs.add(fn); fn(state); return () => subs.delete(fn); }
};

export const isMobile = () => window.innerWidth < 760;

export function goBook() {
  const el = document.getElementById('book');
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
}
