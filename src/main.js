import '@phosphor-icons/web/regular';
import './styles/nocturne.css';
import './styles/base.css';

import './lib/logo.js';
import { MBMotion } from './lib/motion.js';
import './lib/three-models.js';
import './lib/image-slot.js';
import { logoVariant } from './config.js';

// Apply the chosen logo variant everywhere (logos + favicon).
const variant = logoVariant();
document.querySelectorAll('mb-logo').forEach(el => el.setAttribute('variant', variant));
const fav = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
if (fav) fav.href = fav.href.replace(/favicon-\w+\.svg$/, `favicon-${variant}.svg`);

// Scroll reveals, headline rise, parallax and tilt.
const initMotion = () => MBMotion.init(document);
setTimeout(initMotion, 80);

export { initMotion };
