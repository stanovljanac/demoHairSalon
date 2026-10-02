import { isMobile } from '../store.js';

// Two photo columns drift in opposite directions as you scroll (depth effect).
export function initGallery() {
  const [a, b] = document.querySelectorAll('.gallery-stack');
  const apply = () => { const m = isMobile(); a.dataset.speed = m ? -0.02 : -0.07; b.dataset.speed = m ? 0.02 : 0.07; };
  apply(); window.addEventListener('resize', apply);
}
