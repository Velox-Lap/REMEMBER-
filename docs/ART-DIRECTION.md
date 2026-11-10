# PROJECT 29.12 — Art Direction

**Version:** 1.0  
**Status:** Phase 1 foundation  
**Creative concept:** A Journey Through Our Little Universe

## 1. Creative thesis

PROJECT 29.12 is a private digital journey, not a conventional romantic landing page. Its visual language combines botanical editorial design, coastal atmosphere, tactile paper details, and carefully paced cinematic storytelling.

The experience should feel intimate, quiet, intentional, and crafted. Emotional impact comes from pacing, meaningful content, image composition, and transitions—not from visual noise or excessive effects.

## 2. Narrative architecture

| Act | Environment | Emotional register | Visual language |
|---|---|---|---|
| I — The Garden | Botanical garden | Warmth, beginning, discovery | Sage, forest green, filtered sunlight, organic forms |
| II — The Ocean | Open coast | Calm, reflection, continuity | Muted blue, horizon lines, soft gradients, flowing motion |
| III — The Secret | Intimate natural space | Focus, anticipation, reveal | Cream paper, deep green, restrained light, a single flower |

Eight chapters follow the narrative:
1. Intro
2. Garden
3. Story timeline
4. Memories
5. Letter
6. Ocean
7. Secret discovery
8. 29.12 final reveal

The three acts are the macro-story. Chapters are the implementation units. Transitions should make the acts feel connected without trapping the visitor in scroll-jacking.

## 3. Art direction principles

### Cinematic restraint
Use large imagery, controlled contrast, deliberate negative space, and a small number of focal points. Avoid stacking multiple competing effects in one viewport.

### Botanical tactility
Use paper grain, subtle botanical silhouettes, natural edge treatments, and restrained shadows. Textures should be low contrast and never reduce legibility.

### Editorial composition
Use asymmetry, oversized serif typography, image crops with intentional focal points, and consistent alignment. Avoid generic centered-card layouts as the default.

### Emotional pacing
Alternate spacious scenes with information-dense memory sections. Give the letter and final reveal enough visual quiet to feel distinct.

### Authenticity
Do not invent names, dates, memories, photographs, or relationship details. All personal content must remain clearly marked placeholder data until supplied.

## 4. Image direction

Preferred image subjects:
- Botanical close-ups, leaves, wildflowers, sunlit garden paths
- Coastal horizons, calm sea surfaces, shoreline details
- Natural paper, handwritten notes, pressed flowers

Image treatment:
- Warm natural color grading
- Soft highlights and controlled shadows
- Filmic grain only when subtle
- Consistent crop logic per chapter
- Avoid obvious stock-photo clichés and overly saturated imagery

Use local, optimized assets in the repository when available. Keep image references centralized in content data so assets can be replaced without editing presentation components.

## 5. Motion direction

Motion should be calm, legible, and purposeful.

- Scene transitions: opacity, clip-path, and restrained transform combinations
- Scroll reveals: short distance, low amplitude, one-time entrance
- Parallax: limited to large background layers; disable or simplify on mobile
- Micro-interactions: clear hover, focus, and pressed states
- Ambient motion: slow and low contrast; never essential to understanding

Honor `prefers-reduced-motion`. Reduced-motion mode should preserve all content and interaction while removing nonessential movement.

## 6. Sound direction

Ambient sound is optional and opt-in only. No autoplay. The interface must remain complete and understandable without audio assets. Provide persistent play/pause and mute controls only when a valid sound asset is configured.

## 7. Experience quality bar

The site should feel like a cohesive independent creative-studio project:
- Strong first viewport and memorable opening
- Consistent type, spacing, color, and image treatment
- Clear chapter progression
- Touch-first mobile interactions
- Keyboard-operable controls
- No fake 3D, gratuitous glassmorphism, or decorative clutter
