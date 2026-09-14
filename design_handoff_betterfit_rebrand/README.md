# Handoff: BETTERFIT LMS rebrand (pink→red gradient, Material 3 roles)

Target repo: **parkerdpp1970/BETTERFIT-LMS** (`main`) — React 19 · Vite · Tailwind 3.4 · lucide-react · react-router 7.

## Overview
Re-theme the existing app from teal/Poppins/8px to the new design system: pink→red gradient primary with arrow-swap hover, near-black secondary, warm greys, Nunito, M3 shape scale, neutral status pills with coloured icons. **No layout or routing changes** — this is a token + utility + component-swap pass.

## About the design files
Files in this bundle are **design references written in HTML/CSS/JSX for a bundler-less preview**. Do not paste them into the app as-is. Recreate them in the codebase's existing patterns (Tailwind utility classes, lucide-react icons, react-router). The CSS and Tailwind tokens ARE meant to be copied verbatim.

## Fidelity
**High-fidelity.** Colours, radii, sizes and motion are final. Match exactly.

## Step-by-step

### 1. Tailwind tokens
Replace `theme.extend` in `tailwind.config.js` with the contents of `tailwind.tokens.js` (bundled). Keep the existing `brand.*` keys temporarily as aliases while migrating, then delete them.

### 2. Fonts
In `index.html` replace the Poppins link with:
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
In `index.css` `@layer base`: font-family → `'Nunito', 'Poppins', sans-serif`; body `background-color: #F5F3F2; color: #1C1C1E; font-size: 14px` (16px on mobile viewports); h1 32/40 700, h2 24/32 700, h3 16/24 700.

### 3. CSS utilities
Replace the `.btn-primary / .btn-secondary / .btn-accent / .card-standard / .card-highlighted / .input-standard / .badge-*` block in `index.css` with `components.css` (bundled) — it adds `:root` tokens too, so `var(--primary)` etc. work everywhere. Class name mapping:

| Old class | New class |
| --- | --- |
| `.btn-primary` | `.bf-btn.bf-btn--filled.bf-btn--arrow` (wrap label in `<span class="bf-btn__label">`, add `<span class="bf-btn__arrow"><ArrowRight/></span>`) — or use the `Button` component below |
| `.btn-secondary` | `.bf-btn.bf-btn--outlined` |
| `.btn-accent` | `.bf-btn.bf-btn--secondary` (near-black) |
| `.card-standard` | `.bf-card` |
| `.card-highlighted` | `.bf-card.bf-card--filled` |
| `.input-standard` | `.bf-input` (wrap in `.bf-field` with `.bf-field__label`) |
| `.badge-success / -warning / -pending` | `.bf-badge.bf-badge--pass / --pending / --submitted` + leading lucide icon |

### 4. Hex / class replacements (global find-replace across `components/**`)
| Find | Replace with | Notes |
| --- | --- | --- |
| `#10B981` (teal, active/primary) | `#D70029` — or `bg-primary-gradient` for filled buttons | Gradient: `bg-primary-gradient hover:bg-primary-gradient-hover` |
| `#059669` | `#A8001C` (`primary-deep`) | hover/pressed |
| `#F0FDFA` (teal tint bg) | `#FFD9E2` (`primary-container`) | active nav, hover rows |
| `#D1FAE5` + `text-[#059669]` | `bg-surface-container-high text-on-surface` + green icon | status pills — see §5 |
| `#06B6D4` / `#0891B2` (cyan) | `#1C1C1E` / `#000000` (`secondary`) | accent buttons/links |
| `#7C3AED` / `#E0E7FF` / `#4C1D95` (purple) | icons → `text-on-surface-variant`; pills → neutral | purple is removed |
| `#1A1A2E` | `#1C1C1E` | ink |
| `#F8FAFB` | `#F5F3F2` (`surface`) | page bg |
| `#E5E7EB` | `#D6D2D0` (`outline-variant`) | borders |
| `#6B7280` | `#706B6A` (`on-surface-muted`) | muted text |
| `#9CA3AF` | `#918B89` (`outline`) | placeholder/icons |
| `#DC2626` / `#FEE2E2` | `#B91C1C` / `#FEE2E2` | error (refer) |
| `#F59E0B` / `#FEF3C7` / `#92400E` | `#A85A00` / `#F5EBDD` / `#78350F` | warning (pending) |
| `rounded-lg` on buttons | `rounded-full` | pill buttons |
| `rounded-md` on inputs | `rounded-xl` (12px) | |
| `rounded-lg` on cards | `rounded-2xl` (16px) | |
| `focus:ring-[#10B981]/20 focus:border-[#10B981]` | `focus:ring-primary/20 focus:border-primary` | inputs |
| `focus-visible` on buttons | `focus-visible:outline focus-visible:outline-3 focus-visible:outline-focus outline-offset-2` | blue ring #007AFF |

### 5. Specific components
- **Layout.tsx** — header: `bg-[#10B981]` → `bg-surface border-b border-outline-variant text-on-surface` (light bar, 64px). Sidebar active state: `border-[#10B981] text-[#10B981] bg-[#F0FDFA]` → `border-transparent text-on-surface bg-primary-container` with the icon inside a 56×32 pill. Logo tile: `bg-[#10B981]` → `bg-primary-gradient`. Sign-out stays `text-error`.
- **Login.tsx** — left panel `bg-[#10B981]` → `bg-tertiary` (near-black), quote in `text-display-sm`; role grid → chips (`Chip` pattern: 32px, `rounded-lg`, selected = `bg-secondary-container`). Submit button → filled gradient, `size lg` (56px), block.
- **Dashboard.tsx** — `getStatusColor`: return one neutral class `bg-surface-container-high text-on-surface`; render a lucide icon before the text coloured by status (`Check` text-success, `RotateCcw` text-error, `Clock` text-warning, `Send` text-info). Quick-action tiles: `hover:border-[#10B981] hover:bg-[#F0FDFA]` → `hover:border-primary-fixed-dim hover:-translate-y-0.5 hover:shadow-elevation-2`. Row hover `hover:bg-[#F0FDFA]` → `hover:bg-surface-container-low`; selected row `bg-primary-container`.
- **LandingPage.tsx** — hero span `text-[#10B981]` → `bg-primary-gradient bg-clip-text text-transparent`; CTA → filled gradient with arrow; "Explore" → `bf-btn--secondary` (black).
- **Progress steppers / trackers** anywhere (AssessorLearnerDetail, LearnerDashboard): completed nodes `bg-tertiary text-white`, current node `bg-primary-gradient ring-4 ring-primary-container`, todo `border-2 border-outline`.

### 6. Button component (recommended)
Add `components/ui/Button.tsx` (see `Button.jsx` bundled — port to TSX, swap `Icon` for lucide-react components). Key behaviour: filled variant hover/focus → `.bf-btn__label` translates 16px right + fades, `.bf-btn__arrow` slides in from −16px; 250ms `cubic-bezier(.05,.7,.1,1)`. `arrow={false}` for Save/Delete. Min height 48px (sm 40, lg 56).

## Interactions & motion
- Hover: darker gradient + `shadow-elevation-primary` + `-translate-y-px`. Press: pressed gradient, no shadow.
- Cards (interactive): lift 2px, `shadow-elevation-2`, border → `primary-fixed-dim`.
- Easing: standard `cubic-bezier(.2,0,0,1)` for colour/opacity, emphasized `cubic-bezier(.05,.7,.1,1)` for movement. 150/250/400ms.
- Focus: 3px `#007AFF` outline, offset 2px, everywhere.

## Design tokens
See `tailwind.tokens.js` and the `:root` block at the top of `components.css` (colours, type scale, spacing 4px grid, shape xs4/sm8/md12/lg16/xl28/full, elevation 0–5 + primary glow, motion).

## Accessibility requirements
- All text ≥ 4.5:1 (gradient stops verified with white). Never colour alone: status pills keep icon + word.
- Tap targets ≥ 48px; quiz answers 56px. `--outline #918B89` is border-only (3.3:1), never text.

## Assets
Icons: lucide-react (already a dependency). No logo file exists — keep the "B" tile + wordmark in Nunito 800 until a logo is supplied.

## Files in this bundle
- `tailwind.tokens.js` — drop-in `theme.extend`.
- `components.css` — tokens + all `bf-*` utility classes (single file, replaces the old utilities in `index.css`).
- `Button.jsx`, `ResultBadge.jsx`, `QuizQuestion.jsx`, `ProgressTracker.jsx` — reference implementations to port to TSX.
- `screens.jsx` — the four sample screens (dashboard, mobile quiz, marking desk, login) showing intended composition.
- `readme.md` — full design-system guide (voice, foundations, iconography).
