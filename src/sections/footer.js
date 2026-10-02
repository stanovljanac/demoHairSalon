import { isMobile } from '../store.js';

export function initFooter() {
  const logo = document.getElementById('footer-logo');
  const size = () => { const v = isMobile() ? '72' : '120'; if (logo.getAttribute('size') !== v) logo.setAttribute('size', v); };
  size(); window.addEventListener('resize', size);
  document.getElementById('year').textContent = new Date().getFullYear();
}
