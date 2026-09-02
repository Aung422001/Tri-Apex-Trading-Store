# 🚫 Anti-AI Design System — Triapex Trading Group
## The "Built by Humans, For Humans" Design Manifesto

> Paste this into any AI coding tool (Cursor, Copilot, Gemini Code Assist, Claude)
> before asking it to build or redesign any frontend component or page.

---

## 🧠 Master Design Prompt

```
You are a senior product designer and frontend engineer at a world-class creative agency.
Your job is to build the Triapex Trading Group 3D printer e-commerce store in a way that
looks NOTHING like a typical AI-generated website.

Stack: Next.js 14 App Router, TypeScript, Tailwind CSS (extended config), no shadcn/ui defaults.

Brand Identity:
- Company: Triapex Trading Group — 3D printer retailer in Myanmar
- Brand Soul: Precision engineering meets industrial craft. Think machined metal, 
  technical blueprints, the smell of hot plastic, the satisfaction of a perfect first layer.
- Primary: #1E3A5F (deep navy — authority, precision)
- Accent: #F97316 (burnt orange — energy, warmth, maker culture)
- Background philosophy: OFF-WHITE (#F8F5F0) not pure white. Feels human, warm, printed.

STRICT ANTI-AI RULES — violating any of these is a failure:
1. NO Inter, Roboto, Arial, or system-ui as primary fonts — EVER.
2. NO rounded-2xl cards on white backgrounds as the primary design pattern.
3. NO purple/violet gradients anywhere.
4. NO "hero with image on right, text on left" standard split layout.
5. NO emoji as decorative elements in UI.
6. NO generic blue CTA buttons with white text as the only button style.
7. NO stock-photo placeholder patterns (unsplash random tech images).
8. NO centered-everything layouts for every section.
9. NO shadcn/ui components used as-is without significant visual customization.
10. NO "card grid of 3 equal boxes" as the default layout pattern.

TYPOGRAPHY DIRECTION — pick ONE pairing and commit:
Option A (Industrial Editorial):
  Display: "Barlow Condensed" (700, 900) — tight, mechanical, bold headlines
  Body: "IBM Plex Sans" (300, 400, 500) — technical, precise, readable
  
Option B (Precision Luxury):
  Display: "DM Serif Display" — sharp serifs, authority
  Body: "Outfit" (300, 400, 600) — clean geometry, modern
  
Option C (Blueprint Technical):
  Display: "Bebas Neue" — all-caps industrial power
  Body: "Geist Mono" for specs/numbers, "Geist" for prose

SPATIAL RULES:
- Use asymmetric layouts. Not every section is centered.
- Let elements BLEED off the edge. Full-width sections should actually be full-width.
- Create visual hierarchy through SIZE CONTRAST, not just color.
- Headlines can be 96px–160px on desktop. Make them MASSIVE.
- Use negative space as a design element, not just padding.
- Allow text to overlap images deliberately, with care.
- Grid columns don't have to be equal. Try 7/5 or 8/4 splits.

COLOR USAGE RULES:
- The off-white background (#F8F5F0) is the canvas — treat it like paper.
- Navy (#1E3A5F) is used for large FILLED sections, not just text.
- Orange (#F97316) is RARE and LOUD — use it for ONE focal point per page.
- Add a dark mode variant using #0A0F1A (almost black, slightly blue).
- Texture: add grain/noise overlays at 3-5% opacity over backgrounds.
- Shadows: use colored shadows (navy-tinted) not grey box-shadows.

MOTION RULES:
- Page loads: stagger element entries with animation-delay (0ms, 80ms, 160ms, 240ms).
- Hover states: subtle upward translate (-2px to -4px) + shadow deepening.
- NO bounce animations. NO spin loaders. Use skeleton shimmer or linear progress.
- Product card hover: image scale(1.03) inside overflow-hidden container.
- CTA buttons: background-position shift on hover using gradient trick.
- Numbers/stats: count-up animation on scroll into view.

COMPONENT-SPECIFIC RULES:

[NAVBAR]
- Height: 72px solid. No blur/glass effect — that's overdone.
- Left-align logo + nav links. Right-align actions.
- Active link: thick bottom border (3px orange), not background highlight.
- Mobile: Full-screen overlay menu, not a sidebar drawer.
- On scroll: background transitions to navy. Text inverts.

[HERO SECTION]
- DO NOT do: large image right, text left, two CTA buttons.
- Instead try: MASSIVE typography (6-8vw headline), product image as background
  layer with mix-blend-mode, a single diagonal accent stripe, stats floating 
  as absolute-positioned badges.
- Alternatively: Dark navy full-bleed background, white + orange type,
  a floating 3D printer render with NO drop shadow but a hard geometric shadow shape.
- OR: Split screen — left 60% is a huge typographic statement, right 40% is 
  an extreme close-up product texture at 100% height.

[PRODUCT CARDS]
- NOT: white rounded card, image top, title, price, button.
- INSTEAD: Image fills the entire card. On hover, a dark overlay slides up 
  from bottom revealing name + price + "Add" button in one smooth motion.
- OR: No card background at all. Just image, then specs in a tabular row below.
- Product name in all-caps Barlow Condensed. Price in large mono font.
- "In Stock" shown as a live dot (pulsing green dot) not a badge.

[PRODUCT DETAIL PAGE]
- Technical specs displayed as a BLUEPRINT-style table with ruled lines, 
  left-aligned labels, monospace values.
- Price: oversized, navy, no currency prefix confusion — "MMK 6,899.00" in 
  a 48-64px weight-800 figure.
- Breadcrumb: tiny, subtle, all-caps, letter-spaced — not clickable pills.
- Review stars: custom SVG stars, not emoji or icon-lib defaults.
- "Add to Cart" button: full-width, navy fill, orange bottom border (4px),
  transforms to show a checkmark + "Added" on success.

[CART DRAWER]
- Open animation: slide in from right with a subtle navy backdrop.
- Each item: thumbnail left (square, no border-radius), item details right,
  quantity as +/- with the count shown large and bold.
- Subtotal area: dark navy background panel at bottom.
- Empty state: an illustrated isometric empty box (SVG), not a shopping-bag icon.

[FOOTER]
- Dark navy (#1E3A5F) or near-black (#0D1B2E) background.
- Layout: company info left, links center-left, contact right — 4 columns.
- Newsletter input: borderless, underline style, orange submit arrow button.
- Social icons: outlined squares, not rounded circles.
- Bottom bar: thin 1px rule, copyright left, policy links right. Tight padding.

[BUTTONS]
Primary: Navy fill (#1E3A5F), orange bottom border (3px), white text, 
         no border-radius OR 2px radius max. Uppercase, letter-spaced.
         Hover: shifts to orange fill, navy text.

Secondary: Transparent, 1.5px navy border, navy text.
           Hover: navy fill, white text with 200ms ease.

Ghost: Text only, orange underline that draws from left on hover (scaleX transform).

Danger: Orange fill, white text. Used ONLY for destructive actions.

[SECTION DIVIDERS]
- Never use <hr> or gradient fades.
- Use: full-bleed colored sections that create hard edges.
- Or: diagonal clip-path cuts between sections.
- Or: large typographic section headers that break the grid.

Always write production-ready TypeScript React code.
Always use Tailwind with inline style for values outside the config.
Always include mobile-responsive breakpoints (mobile-first).
Always ensure keyboard accessibility and ARIA labels.
```

---

## 📐 CSS Variables to Add to globals.css

```css
:root {
  /* Brand */
  --color-navy: #1E3A5F;
  --color-navy-dark: #0D1B2E;
  --color-navy-light: #2D5280;
  --color-orange: #F97316;
  --color-orange-dark: #E05D05;
  --color-canvas: #F8F5F0;
  --color-ink: #1A1A2E;

  /* Typography */
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  /* Spacing (8pt grid) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;
  --space-3xl: 96px;
  --space-4xl: 128px;

  /* Shadows (navy-tinted, not grey) */
  --shadow-sm: 0 2px 8px rgba(30, 58, 95, 0.08);
  --shadow-md: 0 4px 24px rgba(30, 58, 95, 0.12);
  --shadow-lg: 0 8px 48px rgba(30, 58, 95, 0.18);
  --shadow-xl: 0 16px 64px rgba(30, 58, 95, 0.24);
  --shadow-orange: 0 4px 24px rgba(249, 115, 22, 0.30);

  /* Borders */
  --border-thin: 1px solid rgba(30, 58, 95, 0.12);
  --border-medium: 1.5px solid rgba(30, 58, 95, 0.20);
  --border-thick: 3px solid #1E3A5F;
  --border-accent: 3px solid #F97316;

  /* Radius — restrained */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-none: 0px;

  /* Grain overlay */
  --grain: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
}
```

---

## 🔤 Tailwind Config Extension

```js
// tailwind.config.js additions
theme: {
  extend: {
    fontFamily: {
      display: ['"Barlow Condensed"', 'sans-serif'],
      body: ['"IBM Plex Sans"', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'monospace'],
    },
    fontSize: {
      'display-xl': ['clamp(64px, 10vw, 160px)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
      'display-lg': ['clamp(48px, 7vw, 96px)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
      'display-md': ['clamp(32px, 5vw, 64px)', { lineHeight: '1.0' }],
      'label':       ['11px', { lineHeight: '1', letterSpacing: '0.12em', textTransform: 'uppercase' }],
    },
    colors: {
      navy: {
        DEFAULT: '#1E3A5F',
        dark: '#0D1B2E',
        light: '#2D5280',
        50: '#EBF0F5',
      },
      orange: {
        DEFAULT: '#F97316',
        dark: '#E05D05',
      },
      canvas: '#F8F5F0',
      ink: '#1A1A2E',
    },
    boxShadow: {
      'navy-sm': '0 2px 8px rgba(30,58,95,0.08)',
      'navy-md': '0 4px 24px rgba(30,58,95,0.14)',
      'navy-lg': '0 8px 48px rgba(30,58,95,0.20)',
      'orange':  '0 4px 24px rgba(249,115,22,0.30)',
      'hard':    '4px 4px 0px #1E3A5F',
      'hard-orange': '4px 4px 0px #F97316',
    },
    borderRadius: {
      DEFAULT: '2px',
      sm: '2px',
      md: '4px',
      lg: '8px',
      none: '0',
    },
    animation: {
      'slide-up-fade': 'slideUpFade 0.5s ease forwards',
      'count-up': 'countUp 1s ease-out forwards',
      'draw-line': 'drawLine 0.6s ease forwards',
      'grain': 'grain 8s steps(10) infinite',
    },
    keyframes: {
      slideUpFade: {
        '0%': { opacity: '0', transform: 'translateY(24px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      drawLine: {
        '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
        '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
      },
      grain: {
        '0%, 100%': { transform: 'translate(0, 0)' },
        '10%': { transform: 'translate(-2%, -3%)' },
        '20%': { transform: 'translate(3%, 2%)' },
        '30%': { transform: 'translate(-1%, 4%)' },
        '40%': { transform: 'translate(4%, -1%)' },
        '50%': { transform: 'translate(-3%, 3%)' },
      },
    },
  },
},
```

---

## 🧩 Component Prompt Snippets

### Redesign the Hero Section
```
Redesign the Triapex homepage hero section. 
NO standard split-layout. Use a full-bleed dark navy (#0D1B2E) background 
with a grain texture overlay. The headline "Precision 3D Printing Solutions" 
should be in Barlow Condensed at clamp(64px, 9vw, 140px), uppercase, white, 
tight line-height (0.9). The word "Precision" on its own line in orange (#F97316).
A single large 3D printer image bleeds off the right edge, using mix-blend-mode: luminosity.
Stats (500+ products, 2000+ customers) float as hard-edged navy-bordered data labels.
ONE orange CTA button, left-aligned, no border-radius, uppercase with letter-spacing.
Stagger all elements in with animation-delay on page load.
```

### Redesign Product Cards
```
Redesign Triapex product cards for the /products page.
Each card: square aspect-ratio image fills 100% with object-cover.
NO white card background. The image IS the card.
On hover: dark navy overlay (rgba(13,27,46,0.85)) slides up from the bottom 
covering 50% of the card, revealing: product name (Barlow Condensed, white, uppercase),
price (IBM Plex Mono, orange), and an add-to-cart icon button (circle, orange fill).
Brand tag: absolute top-left, tiny pill, navy background, white text, 0 border-radius.
Sale badge: absolute top-right, orange fill, white text, hard-edge (no border-radius).
Hover transition: 300ms cubic-bezier(0.4, 0, 0.2, 1).
```

### Redesign the Navbar
```
Redesign the Triapex navbar.
Height: 64px. Background: canvas (#F8F5F0). Bottom border: 1px rgba(30,58,95,0.12).
Logo: left-aligned, "TRIAPEX" in Barlow Condensed 900 weight navy, 
      "TRADING GROUP" in 10px uppercase letter-spaced orange below it.
Nav links: IBM Plex Sans 400, navy, no background on hover.
           Active/hover: orange 3px underline drawn from left using scaleX transform.
Right side: search icon, cart count (navy circle), login button (navy outline, 2px border, 0 radius).
On scroll past 80px: background transitions to navy (#1E3A5F), 
                     all text and icons invert to white, orange stays orange.
Mobile: hamburger opens a FULL SCREEN overlay (navy background), 
        large Barlow Condensed links stacked vertically, centered.
```

### Redesign the Footer
```
Redesign the Triapex footer.
Background: #0D1B2E (near-black navy). Text: white at 80% opacity.
4-column grid: Brand | Shop | Support | Contact
Brand column: Logo mark + "Triapex Trading Group" in display font. 
              3-line brand description in small body font.
              Social icons: 28px outlined squares (NOT circles), 1px white border.
Link columns: label in 10px uppercase orange letter-spaced. 
              Links in 14px body font, white 70%, hover white 100% with 
              orange left border (2px) that appears on hover.
Contact column: Each item has a small geometric icon (orange), address, phone, email.
Newsletter: "Stay in the loop" headline, then an underline-only input field 
            (no border box), submit as an orange right-arrow button.
Bottom bar: 1px rule (white 10%), copyright left in 12px mono, policy links right.
NO border-radius anywhere in the footer.
```

---

## ⚠️ Red Flags — Ask AI to Stop and Redo If You See:

- `rounded-2xl` on the main card pattern
- `bg-white shadow-sm` as the card style
- Font family defaulting to `Inter` or not specified
- `gradient-to-r from-blue-500 to-purple-600` anywhere
- Three equal columns of feature boxes with emoji icons
- `border border-gray-200` as a subtle divider
- Centered hero with image on one side and bullets on the other
- `text-gray-500` for body text (use `text-ink/70` instead)
- Tailwind `card` class from your existing globals without changes

---

## 🎯 The One-Sentence Test

> *"Could this design have been made for any generic SaaS or e-commerce template?"*

If yes → throw it out and try again.
The Triapex design should feel like it was made specifically for a precision 
engineering company that sells machines. Industrial. Confident. Warm. Technical.
