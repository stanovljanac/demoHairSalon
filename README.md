# MB Hair Salon — website

Responsive one-page site for **MB Hair Salon** (Cut · Colour · Care), built from the
Claude Design handoff `MB Hair Salon Website v4`.

**Live:** https://demo-hair-salon-nine.vercel.app/ — Vercel redeploys automatically on every push to `main`.

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
| **Services** | Outline category tabs (Care, Colour, Cut); per-tab panel — 3D spray misting hair, dye brush painting a lock, 3D clipper fading the sides (v3 version); scissors trim a hanging lock in the corner |
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
- **Photos** — live in `public/photos/` as WebP, pre-cropped to each slot. Gallery and storefront
  photos are set on the `<image-slot>` tags in `index.html`; stylist portraits are the `photo` field in
  `src/data.js`. To swap one, drop a new file in `public/photos/` and point `src` at it with a relative
  path (`photos/…`, no leading slash, so sub-path deploys keep working). `position="50% 30%"` sets the
  focal point kept in view when the slot crops the photo; removing `src` brings back the placeholder.
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
public/photos/             stylist portraits, gallery and storefront photos (WebP)
```

## Photo credits

All photos are from [Unsplash](https://unsplash.com) under the
[Unsplash License](https://unsplash.com/license) (free for commercial use, no attribution required —
credited here anyway). The stylist portraits are stock models standing in for the real team; replace
them with the salon's own photos before launch.

| File | Photo | Photographer |
| --- | --- | --- |
| `stylist-mila.webp` | [Woman in a black turtleneck](https://unsplash.com/photos/a-woman-with-long-hair-and-a-black-shirt-zbNl9wvjMcU) | Vladimir Fedotov |
| `stylist-jonah.webp` | [Man in a black shirt](https://unsplash.com/photos/man-in-black-button-up-shirt-JVH7q7lxyjY) | Hanif Castle |
| `stylist-rae.webp` | [Woman with dark curls](https://unsplash.com/photos/a-woman-with-dark-hair-looking-at-the-camera-sLy4bI42kv0) | Hamed Farahpour |
| `gallery-feature-look.webp` | [Pixie cut portrait](https://unsplash.com/photos/a-close-up-of-a-person-with-a-necklace-on-YdyiFfGNvnk) | Behnam Samipour |
| `gallery-colour-work.webp` | [Ash-lilac waves](https://unsplash.com/photos/person-with-grey-and-black-hair-KBoUUqE97r8) | Lera Kogan |
| `gallery-cut-detail.webp` | [Scissors trimming straight hair](https://unsplash.com/photos/a-woman-is-cutting-her-hair-with-scissors-Mq2t2Qe7OFk) | Daria Andriianova |
| `gallery-curls.webp` | [Curls across the face](https://unsplash.com/photos/woman-in-black-tank-top-ZYjgFrgHYkg) | Juli Kosolapova |
| `gallery-balayage.webp` | [Caramel balayage](https://unsplash.com/photos/a-woman-with-long-hair-standing-in-a-kitchen-netaAK35IUc) | Ramón Benitez |
| `gallery-salon-detail.webp` | [Chair and neon arch mirror](https://unsplash.com/photos/salon-chair-with-arched-neon-mirror-Alw5pVQYG4c) | Emanuel Haas |
| `storefront.webp` | [Neon scissors in a window](https://unsplash.com/photos/neon-scissors-sign-in-a-window-at-night-yPA0FpApgck) | Sergey Mosin |
