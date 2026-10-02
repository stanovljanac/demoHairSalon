import { store } from '../store.js';

// Fixed nav: turns solid once you scroll, burger menu below 1000px.
export function initNav() {
  const nav = document.querySelector('.site-nav');
  const menu = document.getElementById('menu');
  const burger = nav.querySelector('.nav-burger');
  const icon = burger.querySelector('i');
  let scrolled = false;

  const paint = s => {
    nav.classList.toggle('is-solid', scrolled || s.menu);
    nav.classList.toggle('is-scrolled', scrolled);
    menu.hidden = !s.menu;
    icon.className = s.menu ? 'ph ph-x' : 'ph ph-list';
    burger.setAttribute('aria-expanded', String(s.menu));
  };

  let wasOpen = false;
  store.subscribe(s => {
    paint(s);
    if (s.menu && !wasOpen) {
      requestAnimationFrame(() => menu.querySelectorAll('[data-menu-item]').forEach((el, i) =>
        el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }],
          { duration: 600, delay: i * 60, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' })));
    }
    wasOpen = s.menu;
  });

  const onScroll = () => { const s = window.scrollY > 24; if (s !== scrolled) { scrolled = s; paint(store.get()); } };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  window.addEventListener('resize', () => { if (window.innerWidth >= 1000 && store.get().menu) store.set({ menu: false }); });

  burger.addEventListener('click', () => store.set({ menu: !store.get().menu }));
  const close = () => store.get().menu && store.set({ menu: false });
  nav.querySelector('.nav-brand').addEventListener('click', close);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}
