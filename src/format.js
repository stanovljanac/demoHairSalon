import { CONFIG } from './config.js';

export const priceOf = x => CONFIG.showPrices ? (x.from ? 'from ' : '') + '$' + x.price : '';
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
