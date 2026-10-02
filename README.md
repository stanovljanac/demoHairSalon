# MB Hair Salon — website

Responsive one-page site for **MB Hair Salon** (Cut · Colour · Care), built from the
Claude Design handoff `MB Hair Salon Website v4`.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the build
```

## What's on the page

| Section | Motion |
| --- | --- |
| **Nav** | Turns solid on scroll; full-screen menu with staggered items below 1000px |
| **Hero** | "Hair, considered." rises in; a 3D hair dryer dries a lock of hair and follows the cursor; its airflow blows the falling strands |
| **Cut-line** | Scissors cut the edge into a zigzag as you scroll down, a comb straightens it on the way up |
| **Services** | Outline category tabs (Care, Colour, Cut); per-tab panel — 3D spray misting hair, dye brush painting a lock, horizontal 3D clipper trimming; scissors trim a hanging lock in the corner |
| **Stylists** | Staggered cards; portraits tilt under the pointer |
| **Marquee** | Two tilted bands that speed up while scrolling |
| **Gallery** | Sticky intro; photo columns drift in opposite directions |
| **Booking** | Wave transitions; 3D leather salon chair rolls and swivels, spins a full turn on confirm; working booking form |
| **Visit / Footer** | Address, hours, contact; animated logo and drifting strands |

All motion respects `prefers-reduced-motion`.

## Customising

- **Options** — `src/config.js`: logo variant (`strand` · `cut` · `arch`, or `?logo=cut` in the URL),
  show/hide prices, and the cut-line mode (`scroll` or `loop`).
- **Content** — `src/data.js`: services and prices, stylists, time slots, opening hours.
  Address, phone and email live in `index.html`. *All of this is placeholder content from the
  design — replace it with the salon's real details.*
- **Photos** — every `<image-slot>` in the page is an empty placeholder. Add `src="…"` (and `alt`)
  to show a real photo, e.g. `<image-slot src="/photos/mila.jpg" alt="Mila B." …>`.
- **Booking** — the form is front-end only; hook `bk-form`'s submit in `src/sections/booking.js`
  up to your booking backend or service.

## Structure

```
index.html                 page markup, section by section
src/main.js                entry: styles, components, section init
src/lib/                   motion.js (canvas effects), three-models.js (3D), logo.js, image-slot.js
src/sections/              behaviour per section
src/styles/nocturne.css    design-system tokens (Nocturne)
src/styles/sections/       styles per section
public/favicons/           favicons and app icons for all three logo variants
```
