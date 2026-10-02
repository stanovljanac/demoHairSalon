import '@phosphor-icons/web/regular';
import './styles/nocturne.css';
import './styles/base.css';
import './styles/sections/nav.css';
import './styles/sections/hero.css';
import './styles/sections/services.css';
import './styles/sections/stylists.css';

import './lib/logo.js';
import { MBMotion } from './lib/motion.js';
import './lib/three-models.js';
import './lib/image-slot.js';
import { logoVariant } from './config.js';
import { initNav } from './sections/nav.js';
import { initServices } from './sections/services.js';
import { initStylists } from './sections/stylists.js';

// Apply the chosen logo variant everywhere (logos + favicon).
const variant = logoVariant();
document.querySelectorAll('mb-logo').forEach(el => el.setAttribute('variant', variant));
const fav = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
if (fav) fav.href = fav.href.replace(/favicon-\w+\.svg$/, `favicon-${variant}.svg`);

// Scroll reveals, headline rise, parallax and tilt. Re-run after any section
// re-renders so freshly inserted elements animate in too.
let motionTimer;
const initMotion = (delay = 40) => { clearTimeout(motionTimer); motionTimer = setTimeout(() => MBMotion.init(document), delay); };

initNav();
initServices(initMotion);
initStylists();

initMotion(80);
