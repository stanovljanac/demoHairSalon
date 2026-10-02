// Placeholder content from the design — replace with the salon's real details.
export const SERVICES = {
  cut: [
    { id: 'c1', name: 'Cut & finish', desc: 'Consultation, wash, precision cut and blow-dry.', dur: '60 min', price: 65 },
    { id: 'c2', name: 'Short cut', desc: 'Clipper and scissor work, neck and fringe tidy included.', dur: '40 min', price: 40 },
    { id: 'c3', name: 'Blow-dry & style', desc: 'Wash and a finish that lasts — smooth, bouncy or undone.', dur: '45 min', price: 45 },
    { id: 'c4', name: 'Fringe refresh', desc: 'Between-cut trim for fringes and face-framing layers.', dur: '15 min', price: 15 }
  ],
  colour: [
    { id: 'k1', name: 'Root touch-up', desc: 'Single-process colour at the regrowth, with gloss.', dur: '75 min', price: 75 },
    { id: 'k2', name: 'Full colour', desc: 'All-over permanent or demi colour, root to tip.', dur: '105 min', price: 110 },
    { id: 'k3', name: 'Balayage', desc: 'Hand-painted, soft-grown-out lightness. Includes toner.', dur: '180 min', price: 180, from: true },
    { id: 'k4', name: 'Gloss & tone', desc: 'Refresh tone and shine between colour appointments.', dur: '30 min', price: 50 }
  ],
  care: [
    { id: 't1', name: 'Keratin smoothing', desc: 'Reduces frizz for up to three months.', dur: '150 min', price: 220 },
    { id: 't2', name: 'Bond repair ritual', desc: 'Rebuilds strength after colour or heat damage.', dur: '30 min', price: 45 },
    { id: 't3', name: 'Scalp treatment', desc: 'Exfoliate, massage and rebalance.', dur: '30 min', price: 40 }
  ]
};

// Tab order: Care, Colour, Cut (Care opens first).
export const CATS = [{ id: 'care', label: 'Care' }, { id: 'colour', label: 'Colour' }, { id: 'cut', label: 'Cut' }];

export const PANELS = {
  care: { title: 'Finishing mist', note: 'Sprayed on, set in seconds', html: '<mb-3d model="spray-hair"></mb-3d>' },
  colour: { title: 'Balayage', note: 'Painted root to tip', html: '<mb-dye></mb-dye>' },
  // v3 clipper fade: vertical clipper moving up and down, fading the side of the hair.
  cut: { title: 'Clipper fade', note: 'Trimming the sides', html: '<mb-3d model="clipper"></mb-3d>' }
};

// photo: portrait in public/photos/; focus: the point kept in view when the card crops it.
export const TEAM = [
  { id: 'mila', name: 'Mila B.', first: 'Mila', role: 'Founder · Creative director', bio: 'Precision cuts and shape. Fifteen years behind the chair.', photo: 'photos/stylist-mila.webp', focus: '50% 30%' },
  { id: 'jonah', name: 'Jonah K.', first: 'Jonah', role: 'Colour specialist', bio: 'Balayage, blondes and corrective colour.', photo: 'photos/stylist-jonah.webp', focus: '50% 48%' },
  { id: 'rae', name: 'Rae O.', first: 'Rae', role: 'Texture & curls', bio: 'Curly cuts, coils and bond-repair treatments.', photo: 'photos/stylist-rae.webp', focus: '50% 36%' }
];

export const TIMES = ['9:00', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];
export const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const HOURS = [
  { d: 'Tuesday – Thursday', t: '9:00 – 19:00' },
  { d: 'Friday', t: '9:00 – 20:00' },
  { d: 'Saturday', t: '9:00 – 17:00' },
  { d: 'Sunday – Monday', t: 'Closed', closed: true }
];
