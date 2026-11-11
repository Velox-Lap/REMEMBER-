# PROJECT 29.12 — Manual QA Checklist

Run this checklist against the latest Vercel Preview URL before merging or promoting to Production.

## Test environments
- Desktop: latest Chrome and Safari
- Mobile: iOS Safari and Android Chrome
- Viewports: 1440×900, 1024×768, 768×1024, 390×844, 360×800
- Motion: default and operating-system reduced-motion enabled

## Navigation and page structure
- [ ] Load / and confirm the intro is the first visible chapter.
- [ ] Use the intro CTA and confirm it scrolls to Garden.
- [ ] Activate all nine chapter-rail buttons in order and out of order.
- [ ] Rapidly activate chapter buttons; confirm the last selected chapter wins.
- [ ] Confirm the active chapter indicator follows manual scrolling.
- [ ] Confirm back-to-top does not cover important text or controls.
- [ ] At mobile widths, confirm chapter rail and back-to-top do not overlap.
- [ ] Use the skip link with a keyboard; confirm focus moves to main content.
- [ ] Enable reduced motion; confirm navigation and decorative animations respect it.

## Story and memory viewer
- [ ] Open each memory card with mouse/touch and keyboard.
- [ ] Confirm focus moves into the dialog and stays within it while tabbing.
- [ ] Press Escape; confirm the dialog closes and focus returns to its card.
- [ ] Click the backdrop; confirm the dialog closes.
- [ ] Confirm body scrolling is restored after closing.

## Letter
- [ ] Open and close the letter repeatedly.
- [ ] Confirm hidden letter copy is not exposed to assistive technology while closed.
- [ ] Confirm the control exposes the correct expanded state.
- [ ] Check narrow screens for clipping and overlap.

## Mixtape
- [ ] Confirm placeholder tracks appear on both sides.
- [ ] Switch between Side A and Side B.
- [ ] Add one supported audio file and confirm its side and title.
- [ ] Add multiple files and confirm order and side assignment.
- [ ] Play, pause, seek, skip forward/back, and allow a track to end.
- [ ] Switch sides during playback; confirm the previous track stops.
- [ ] Try a non-audio file; confirm an accessible error message appears.
- [ ] Try an audio file over the 100 MB per-file limit; confirm rejection.
- [ ] Confirm controls work with keyboard navigation.
- [ ] Confirm files are not uploaded to a server.
- [ ] Refresh; confirm the UI accurately reflects session-only storage.

## Secret garden and finale
- [ ] Reveal every flower and confirm each note appears once.
- [ ] Confirm progress matches the number of revealed flowers.
- [ ] Confirm the finale stays disabled until all configured flowers are revealed.
- [ ] Open the finale, replay the garden, and confirm state resets.

## Error and not-found states
- [ ] Visit a non-existent route and confirm the branded 404 page appears.
- [ ] In a test-only environment, trigger a recoverable rendering error and confirm Try Again resets the boundary.

## Release gates
- [ ] Latest Preview deployment is READY.
- [ ] Latest Preview completes npm run build.
- [ ] No browser console errors during the flows above.
- [ ] No horizontal overflow at the listed viewport widths.
- [ ] No visible content is obscured by fixed-position controls.
- [ ] Personal photos, final copy, and intended audio are supplied and reviewed.
- [ ] Owner explicitly approves merging and Production release.

## Known limitation
Mixtape audio uses browser object URLs and is session-only. Files are not stored on a server and must be selected again after a refresh or new browser session.
