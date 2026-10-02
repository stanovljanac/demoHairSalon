// Site options — the "Tweaks" from the design.
//   logo:       'strand' | 'cut' | 'arch'  (also overridable with ?logo=cut in the URL)
//   showPrices: show prices in the menu and booking summary
//   cutMode:    'scroll' — scissors cut while scrolling down, a comb straightens on the way up
//               'loop'   — scissors and comb run on their own, independent of scroll
export const CONFIG = {
  logo: 'strand',
  showPrices: true,
  cutMode: 'scroll'
};

const LOGOS = ['strand', 'cut', 'arch'];
export function logoVariant() {
  let q = null;
  try { q = new URLSearchParams(location.search).get('logo'); } catch (e) {}
  const v = q || CONFIG.logo || 'strand';
  return LOGOS.includes(v) ? v : 'strand';
}
