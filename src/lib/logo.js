// <mb-logo> — animated MB monogram (strand / cut / arch variants).
const M = 'M10 46 V18 L20 33 L30 18 V46';
const B = 'M36 46 V18 H45 C49.5 18 52 20.8 52 24.5 C52 28.2 49.5 31 45 31 H36 M45 31 C50.5 31 54 34 54 38.5 C54 43 50.5 46 45 46 H36';
const MS = 'M58 48 C48 54 30 46 18 50 C12 52 9.2 48.5 10 42 V14 L20 29 L30 14 V42';
const BS = 'M36 42 V14 H45 C49.5 14 52 16.8 52 20.5 C52 24.2 49.5 27 45 27 H36 M45 27 C50.5 27 54 30 54 34.5 C54 39 50.5 42 45 42 H36';
const TONES = {
  dark: { ink: '#e9e9ed', acc: '#9184d9', acc2: '#d2cefd', tile: '#161826' },
  light: { ink: '#161826', acc: '#5d5294', acc2: '#796cbf', tile: '#e4e7f5' },
  indigo: { ink: '#f3f5fe', acc: '#b5abfc', acc2: '#e7e5fe', tile: '#262a60' }
};
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
let n = 0;
const st = (c, w, x = '') => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${x}`;
function body(v, c, id) {
  if (v === 'cut') {
    const mb = `<path d="${M}" ${st(c.ink, 3.4)}/><path d="${B}" ${st(c.ink, 3.4)}/>`;
    return `<defs><clipPath id="mbu${id}"><polygon points="-10,49.5 74,14.5 74,-10 -10,-10"/></clipPath><clipPath id="mbl${id}"><polygon points="-10,49.5 74,14.5 74,74 -10,74"/></clipPath></defs>` +
      `<g clip-path="url(#mbu${id})"><g data-part="up" style="transform:translate(0.8px,-2.1px)">${mb}</g></g>` +
      `<g clip-path="url(#mbl${id})"><g data-part="down" style="transform:translate(-0.8px,2.1px)">${mb}</g></g>` +
      `<path data-part="line" d="M3 44.1 L61 19.9" ${st(c.acc, 1.3, 'pathLength="1"')}/>`;
  }
  if (v === 'arch') {
    return `<path data-part="arch" d="M14 58 V30 A18 18 0 0 1 50 30 V58" ${st(c.acc, 1.8, 'pathLength="1"')}/>` +
      `<path data-part="base" d="M8 58 H56" ${st(c.acc, 1.8, 'pathLength="1"')}/>` +
      `<path data-part="glint" d="M20.2 27.4 A12 12 0 0 1 27.6 18.8" ${st(c.acc2, 1.3, 'pathLength="1"')}/>` +
      `<g data-part="mb" transform="translate(32 43) scale(0.56) translate(-32 -32)"><path d="${M}" ${st(c.ink, 5.4)}/><path d="${B}" ${st(c.ink, 5.4)}/></g>`;
  }
  return `<path data-part="s2" d="M60 53 C50 58 34 52 22 55.5" ${st(c.acc, 1.2, 'pathLength="1"')}/>` +
    `<path data-part="s1" d="${MS}" ${st(c.ink, 3.4, 'pathLength="1"')}/>` +
    `<path data-part="b" d="${BS}" ${st(c.ink, 3.4, 'pathLength="1"')}/>`;
}
function svg(v = 'strand', o = {}) {
  const c = TONES[o.tone] || TONES.dark; const id = ++n; const vy = v === 'cut' ? 0 : 3;
  const size = o.size ?? 64;
  let inner = body(v, c, id);
  if (o.tile) inner = `<rect x="0" y="${vy}" width="64" height="64" rx="14" fill="${c.tile}"/><g transform="translate(32 ${32 + vy}) scale(0.8) translate(-32 ${-(32 + vy)})">${inner}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 ${vy} 64 64" role="img" aria-label="MB Hair Salon">${inner}</svg>`;
}
window.MBLogo = { svg, TONES };
if (!customElements.get('mb-logo')) {
  class MBLogoEl extends HTMLElement {
    static get observedAttributes() { return ['variant', 'tone', 'tile', 'size']; }
    connectedCallback() {
      this.render();
      if (!this._hv) { this._hv = true; this.addEventListener('mouseenter', () => { if (this.hasAttribute('hover-replay')) this.replay(); }); }
      if (this.hasAttribute('animate') && !this._io) {
        this._io = new IntersectionObserver(es => { if (es[0].isIntersecting) { this._io.disconnect(); this.play(); } }, { threshold: 0.3 });
        this._io.observe(this);
      }
    }
    disconnectedCallback() { this._io && this._io.disconnect(); this._io = null; }
    attributeChangedCallback() { if (this.isConnected) { this.render(); if (this._played) this.play(); } }
    render() {
      const size = parseFloat(this.getAttribute('size')) || 48;
      (this.shadowRoot || this.attachShadow({ mode: 'open' })).innerHTML = `<style>:host{display:inline-block;flex:none;line-height:0;width:${size}px;height:${size}px}svg{display:block;width:100%;height:100%}</style>` + svg(this.getAttribute('variant') || 'strand', { tone: this.getAttribute('tone') || 'dark', tile: this.hasAttribute('tile'), size: '100%' });
    }
    replay() { this.render(); this.play(); }
    play() {
      this._played = true; if (reduce) return;
      const q = s => this.shadowRoot.querySelector(`[data-part="${s}"]`);
      const ease = 'cubic-bezier(.65,0,.35,1)';
      const draw = (el, delay, dur) => el && el.animate([{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], { duration: dur, delay, easing: ease, fill: 'backwards' });
      const v = this.getAttribute('variant') || 'strand';
      if (v === 'strand') { draw(q('s1'), 0, 1500); draw(q('b'), 700, 900); draw(q('s2'), 1000, 1000); }
      else if (v === 'cut') {
        const o = { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards', delay: 250 };
        q('up') && q('up').animate([{ transform: 'translate(12px,-26px)', opacity: 0 }, { transform: 'translate(0.8px,-2.1px)', opacity: 1 }], o);
        q('down') && q('down').animate([{ transform: 'translate(-12px,26px)', opacity: 0 }, { transform: 'translate(-0.8px,2.1px)', opacity: 1 }], o);
        draw(q('line'), 0, 500);
      } else {
        draw(q('base'), 0, 600); draw(q('arch'), 200, 1100); draw(q('glint'), 1100, 500);
        q('mb') && q('mb').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 800, fill: 'backwards' });
      }
    }
  }
  customElements.define('mb-logo', MBLogoEl);
}

export const MBLogo = window.MBLogo;
