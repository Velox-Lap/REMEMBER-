# PROJECT 29.12 — Component Library Blueprint

**Status:** Phase 1 specification; implementation starts in Phase 2.

This document defines component responsibilities and visual behavior. It does not introduce backend services.

## 1. Foundation

| Component | Responsibility | Key states/behavior |
|---|---|---|
| `PageShell` | Global canvas, page gutters, max-width | Responsive |
| `ChapterNav` | Chapter orientation and progress | Current, visited, keyboard accessible |
| `ChapterProgress` | Quiet progress indicator | Updates from active chapter |
| `SectionHeading` | Eyebrow, serif title, supporting copy | Editorial variants |
| `PrimaryAction` | Main call to action | Default, hover, focus, pressed |
| `AudioController` | Optional ambient sound | Hidden if no asset; play/pause/mute |

## 2. Chapter components

| Component | Responsibility | Composition notes |
|---|---|---|
| `IntroSection` | Fullscreen opening scene | Hero image, title, enter action |
| `GardenSection` | Botanical opening act | Layered media, restrained parallax |
| `TimelineSection` | Chronological story | Data-driven milestones |
| `MemoryGallery` | Editorial scrapbook grid | Responsive masonry/editorial layout |
| `MemoryCard` | Single memory preview | Image, caption, optional date |
| `ImageModal` | Expanded memory view | Keyboard, focus, Escape, navigation |
| `EnvelopeInteraction` | Envelope opening | Click/tap and keyboard activation |
| `LetterContent` | Letter presentation | Paper surface, readable text |
| `OceanSection` | Ocean act | Horizon, water image, low-amplitude motion |
| `HiddenFlower` | Discovery affordance | Touch target and visible feedback |
| `SecretMessage` | Progressive discovery result | Clear unlocked state |
| `FinalReveal` | 29.12 ending | Single focal object and configurable message |

## 3. Data contracts

Content will live in typed static modules, not a database.

Suggested modules:
- `src/content/site.ts`
- `src/content/timeline.ts`
- `src/content/memories.ts`
- `src/content/letter.ts`
- `src/content/secret.ts`

Suggested data shapes:

```ts
export type TimelineEntry = {
  id: string;
  dateLabel: string; // Placeholder until supplied
  title: string;
  description: string;
  image?: string;
};

export type MemoryEntry = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  dateLabel?: string;
};

export type SiteContent = {
  title: string;
  recipientName: string; // Explicit placeholder
  openingHeadline: string;
  openingSubtitle: string;
};
```

All sample values must be clearly marked as replaceable placeholders. Avoid putting personal data directly into reusable components.

## 4. Interaction contracts

- Intro action: enters the experience and moves focus to the main content.
- Chapter navigation: scrolls to a chapter without hijacking normal browser scrolling.
- Timeline: reveals milestones progressively but remains fully readable without animation.
- Gallery: opens an accessible dialog; supports close, previous, and next.
- Envelope: opens on click, tap, Enter, or Space.
- Audio: user initiated, optional, and absent when no audio asset is configured.
- Hidden discovery: generous touch target; no precision hover requirement.
- Final reveal: can be reached by normal scrolling and chapter navigation.

## 5. Component acceptance criteria

A component is ready when:
1. It has a single, clear responsibility.
2. It consumes typed content/configuration rather than hardcoded personal details.
3. It has responsive behavior defined.
4. It supports keyboard and touch input where interactive.
5. It respects reduced motion.
6. It has no dependency on a backend or external user account.
7. Its visual states align with the design tokens.
