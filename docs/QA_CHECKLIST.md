# PROJECT 29.12 — Manual QA Checklist

Run this checklist against the latest Vercel Preview URL before merging or promoting to Production.

## Test environments
- Desktop: current Chrome and Safari
- Mobile: iOS Safari and Android Chrome
- Viewports: 1440×900, 1024×768, 768×1024, 390×844, 360×800
- Motion: default and operating-system reduced-motion enabled

## Navigation and page structure
- [ ] Load / and confirm the intro is the first visible chapter.
- [ ] Use the intro CTA and confirm it scrolls to Garden.
- [ ] Activate all nine chapter-rail buttons in order and out of order.
- [ ] Confirm the Chapter Warp overlay covers the transition and remains until smooth scrolling completes.
- [ ] Rapidly activate chapter buttons; confirm the last selected chapter wins and no stale overlay remains.
- [ ] Confirm the active chapter indicator follows manual scrolling.
- [ ] Confirm Back to Top appears after scrolling and hides near the footer.
- [ ] Confirm Back to Top does not cover important text or controls.
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
- [ ] Confirm the public player loads persisted tracks from the published Mixtape content.
- [ ] Switch between Side A and Side B; confirm each side shows only its assigned tracks.
- [ ] Play, pause, seek, skip forward/back, and allow a track to end.
- [ ] Switch sides during playback; confirm the previous track stops.
- [ ] Confirm the artist and personal note match the selected track.
- [ ] Confirm empty sides show a calm empty state and disabled playback controls.
- [ ] In Admin Studio, upload a supported MP3, M4A/MP4, WAV, or OGG file up to the documented limit.
- [ ] Save Mixtape content; confirm the file path and track metadata are published together.
- [ ] Refresh the public page and open it on another device; confirm the same uploaded track still plays.
- [ ] Upload a new file over an existing track; confirm the previous published track remains intact until the new content is saved.
- [ ] Replace an existing Gallery image and Mixtape cover; confirm the currently published assets remain unchanged until their metadata is saved.
- [ ] Confirm the public player has no upload controls and only Admin can upload media.
- [ ] Confirm controls work with keyboard navigation and reduced-motion settings.

## Secret garden and finale
- [ ] Reveal every flower and confirm each note appears once.
- [ ] Confirm progress matches the number of revealed flowers.
- [ ] Confirm the finale stays disabled until all configured flowers are revealed.
- [ ] Open the finale, replay the garden, and confirm state resets.
- [ ] Confirm each checkpoint rejects incorrect input and rate limits repeated attempts.
- [ ] Confirm the complete checkpoint flow unlocks the secret garden.

## Admin and persistence
- [ ] Confirm a non-allowlisted account cannot activate Admin privileges.
- [ ] Confirm an allowlisted owner can complete the magic-link flow.
- [ ] Confirm the Admin PIN is never stored in browser storage, logs, repository files, or analytics.
- [ ] Confirm the Admin edit window expires and protected writes are rejected afterward.
- [ ] Save Home, story, letter, Mixtape, Ocean, Secret Garden, and checkpoint prompt changes.
- [ ] Refresh the Admin page and confirm saved changes reload from Supabase.
- [ ] Confirm Guest/anonymous visitors can read only published content and cannot write to project tables or media.
- [ ] Confirm Gallery add/edit/delete operations behave correctly when a Storage upload or database save fails.

## Error and not-found states
- [ ] Visit a non-existent route and confirm the branded 404 page appears.
- [ ] In a test-only environment, trigger a recoverable rendering error and confirm Try Again resets the boundary.

## Release gates
- [ ] Latest Preview deployment is READY.
- [ ] Latest Preview completes typecheck, lint, and production build.
- [ ] No browser console errors during the flows above.
- [ ] No horizontal overflow at the listed viewport widths.
- [ ] No visible content is obscured by fixed-position controls.
- [ ] All three memory checkpoint values match the owner-confirmed source values; do not place raw answers in public documentation.
- [ ] Personal photos, final copy, and intended audio are supplied and reviewed.
- [ ] Admin owner email is allowlisted and magic-link login is tested.
- [ ] Supabase Auth redirect URLs include the intended Vercel domains.
- [ ] Public media uploads contain only files approved for sharing.
- [ ] Owner explicitly approves merging and Production release.

## Known limitations
- Mixtape files are stored in the public `project-2912-media` bucket because the recipient must be able to play them without a login. Only upload media intended to be shared with the recipient.
- Audio uploads are constrained by the Storage bucket's 25 MiB limit; the Admin UI applies a lower per-file limit.
- Audio and cover uploads are stored immediately, but the public page starts using new media only after Admin saves the Mixtape content. Versioned replacement uploads intentionally leave the previous Storage object intact until the new metadata is published. Replacing or removing Gallery/Mixtape media may leave old Storage objects behind; cleanup should follow confirmation that the new version is published.
- Admin login requires a confirmed email present in the private allowlist, followed by the Admin PIN. The allowlist is intentionally empty until the owner provides the exact address through a private channel.
