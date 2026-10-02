// <image-slot> — photo placeholder from the design. Shows the dashed empty
// state with a caption until a `src` is set, then renders the photo (cover).
// Photos load lazily and fade in once loaded.
//
// Attributes:
//   src          image URL (optional — leave empty to show the placeholder)
//   alt          alt text for the photo
//   position     focal point kept in view when cropped, e.g. '50% 30%' (default centre)
//   placeholder  empty-state caption
//   shape        'rounded' (default) | 'rect' | 'circle' | 'pill'
//   radius       corner radius in px for 'rounded' (default 12)

const css =
  ':host{display:block;position:relative;font:13px/1.3 system-ui,-apple-system,sans-serif;' +
  'width:100%;height:100%;aspect-ratio:3/2}' +
  '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  'img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;' +
  'opacity:0;transition:opacity .6s ease}' +
  'img.in{opacity:1}' +
  '@media (prefers-reduced-motion:reduce){img{transition:none}}' +
  '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
  'justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;user-select:none}' +
  '.empty svg{opacity:.45}' +
  '.cap{max-width:90%;font-weight:500;letter-spacing:.01em;opacity:.75}' +
  '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;opacity:.35}' +
  ':host([data-filled]) .ring,:host([data-filled]) .empty{display:none}';

const icon =
  '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' +
  '<path d="m21 15-5-5L5 21"/></svg>';

class ImageSlot extends HTMLElement {
  static get observedAttributes() { return ['src', 'alt', 'position', 'placeholder', 'shape', 'radius']; }

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style><div class="frame"><img alt="" loading="lazy" decoding="async" hidden>` +
      `<div class="empty">${icon}<div class="cap"></div></div><div class="ring"></div></div>`;
    this._frame = root.querySelector('.frame');
    this._ring = root.querySelector('.ring');
    this._img = root.querySelector('img');
    this._cap = root.querySelector('.cap');
    this._img.addEventListener('load', () => this._img.classList.add('in'));
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const shape = this.getAttribute('shape') || 'rounded';
    const r = shape === 'rect' ? '0' : shape === 'circle' ? '50%' : shape === 'pill' ? '9999px'
      : `${parseFloat(this.getAttribute('radius') ?? 12) || 0}px`;
    this._frame.style.borderRadius = this._ring.style.borderRadius = r;
    this._cap.textContent = this.getAttribute('placeholder') || 'Photo';
    const src = this.getAttribute('src');
    if (src) {
      if (this._img.getAttribute('src') !== src) { this._img.classList.remove('in'); this._img.src = src; }
      this._img.alt = this.getAttribute('alt') || '';
      this._img.style.objectPosition = this.getAttribute('position') || '';
      this._img.hidden = false; this.setAttribute('data-filled', '');
    } else {
      this._img.hidden = true; this._img.removeAttribute('src'); this.removeAttribute('data-filled');
    }
  }
}

customElements.get('image-slot') || customElements.define('image-slot', ImageSlot);
