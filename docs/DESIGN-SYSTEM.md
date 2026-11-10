# PROJECT 29.12 — Design System

**Version:** 1.0  
**Status:** Phase 1 foundation

## 1. Design principles

1. Nature is the visual foundation; cream is the primary canvas.
2. Typography creates hierarchy before decoration does.
3. Motion communicates progression and state.
4. Components must work with mouse, keyboard, and touch.
5. Mobile is a deliberate composition, not a compressed desktop layout.

## 2. Color tokens

### Core palette

| Token | Hex | Intended use |
|---|---|---|
| Forest Green | `#244B3C` | Primary actions, deep botanical surfaces |
| Sage Green | `#A8B9A0` | Soft accents, secondary botanical surfaces |
| Ocean Blue | `#A9D4E5` | Ocean highlights and pale blue surfaces |
| Deep Ocean | `#315D73` | Ocean contrast, dark blue surfaces |
| Sand Beige | `#E9DCC8` | Warm neutral panels and paper details |
| Cream White | `#F8F6EF` | Primary page canvas |
| Pure White | `#FFFFFF` | Letter surface and high-contrast content |
| Ink | `#26352E` | Primary text |

### Semantic tokens

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#F8F6EF` | Global canvas |
| `--color-surface` | `#FFFFFF` | Elevated paper/card surfaces |
| `--color-text` | `#26352E` | Main text |
| `--color-text-muted` | `#65736A` | Secondary text |
| `--color-primary` | `#244B3C` | Primary actions |
| `--color-primary-soft` | `#A8B9A0` | Soft accents |
| `--color-ocean` | `#A9D4E5` | Ocean scene highlight |
| `--color-ocean-deep` | `#315D73` | Ocean scene depth |
| `--color-sand` | `#E9DCC8` | Warm neutral |
| `--color-border` | `#DCDDD3` | Quiet dividers and outlines |
| `--color-focus` | `#315D73` | Visible keyboard focus |

Do not use the palette as a requirement to put every color in every section. Each scene uses a limited subset.

## 3. Typography

### Typeface roles

- **Cormorant Garamond:** expressive cinematic display headlines
- **Playfair Display:** editorial section titles and selected quotations
- **Inter:** navigation, body copy, labels, controls, metadata
- **Caveat:** short handwritten accents only; never long-form body copy

Load fonts with sensible fallbacks and avoid blocking initial rendering. If a remote font is unavailable, the system must remain visually coherent.

### Type scale

| Token | Desktop | Mobile | Role |
|---|---:|---:|---|
| Display XL | clamp(3.5rem, 8vw, 8rem) | clamp(3rem, 14vw, 4.5rem) | Intro/final headline |
| Display L | clamp(3rem, 6vw, 6rem) | clamp(2.5rem, 11vw, 3.75rem) | Chapter headline |
| H1 | clamp(2.5rem, 4.5vw, 4.5rem) | clamp(2.25rem, 9vw, 3.25rem) | Main section |
| H2 | clamp(2rem, 3vw, 3rem) | clamp(1.75rem, 7vw, 2.5rem) | Subsection |
| H3 | 1.5rem | 1.375rem | Card/feature title |
| Body L | 1.125rem | 1.0625rem | Lead copy |
| Body | 1rem | 1rem | Paragraph |
| Small | 0.875rem | 0.875rem | Metadata |
| Eyebrow | 0.75rem | 0.75rem | Overline, uppercase labels |

Body line-height: 1.55–1.75. Display line-height: 0.92–1.08. Keep long-form reading measure between 45 and 75 characters per line.

## 4. Layout and spacing

- Maximum content width: 1440px
- Desktop grid: 12 columns
- Tablet grid: 8 columns
- Mobile grid: 4 columns
- Base spacing unit: 8px
- Reading width: 600–720px
- Desktop section spacing: 96–144px
- Mobile section spacing: 48–72px
- Standard page gutters: clamp(20px, 5vw, 80px)

### Spacing scale

| Token | Value |
|---|---:|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |
| `space-32` | 128px |
| `space-36` | 144px |

## 5. Shape, border, and elevation

- Small controls: 999px pill only when the interaction calls for it
- Image/card corners: 4–12px; use larger radii sparingly
- Editorial media: square or subtly rounded corners
- Borders: 1px quiet neutral
- Shadows: broad, low-opacity, warm-toned; avoid hard UI-kit shadows
- Paper/envelope surfaces: use layered borders and subtle texture rather than heavy drop shadows

## 6. Motion tokens

| Token | Duration | Easing | Usage |
|---|---:|---|---|
| `motion-fast` | 180ms | ease-out | Button and icon feedback |
| `motion-base` | 360ms | cubic-bezier(0.22, 1, 0.36, 1) | Standard reveals |
| `motion-scene` | 700ms | cubic-bezier(0.76, 0, 0.24, 1) | Scene transitions |
| `motion-slow` | 1100ms | cubic-bezier(0.22, 1, 0.36, 1) | Hero image/letter reveal |

Never animate layout properties when transform or opacity can achieve the same result. Avoid scroll hijacking. Reduced-motion preferences override all ambient and nonessential motion.

## 7. Breakpoints

| Name | Range | Layout intent |
|---|---|---|
| Mobile | 320–767px | Single-column, touch-first, simplified motion |
| Tablet | 768–1023px | 8-column adaptable editorial grid |
| Laptop | 1024–1439px | Full editorial composition |
| Desktop | 1440px+ | 12-column composition, max-width container |

Use content-driven breakpoints where a component needs a layout change; do not assume every section changes at the same width.

## 8. Interaction states

Every interactive component defines:
- Default
- Hover (where hover exists)
- Focus-visible
- Active/pressed
- Disabled (when applicable)
- Loading (only when an actual asynchronous action exists)

Touch and keyboard users must receive equivalent access. Do not hide essential information behind hover.

## 9. Accessibility baseline

- Semantic landmarks and heading order
- Keyboard navigation for all controls
- Visible focus ring
- Accessible names for icon-only controls
- Alt text for meaningful images; empty alt for decorative imagery
- Dialog focus management and Escape-to-close
- Contrast checked for text and controls
- Reduced-motion support
- No audio autoplay
- Do not convey state through color alone

## 10. Asset and content rules

- Keep content separate from UI components.
- Use descriptive filenames and centralized asset references.
- Optimize raster images and prefer modern formats where practical.
- Lazy-load below-the-fold imagery.
- Use explicit dimensions/aspect ratios to reduce layout shift.
- Mark all personal placeholders clearly; do not invent private details.
