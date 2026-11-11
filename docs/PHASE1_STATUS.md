# PROJECT 29.12 — Phase 1 Engineering Status

**Date:** 2026-11-11  
**Branch:** `feat/project-29-12-hardening`  
**Latest Preview commit:** `a24d235c27535ecd832eda3eb39b14314fc606df`  
**Preview URL:** https://project-29-12-d0fl5lsg5-velox19.vercel.app

## Verified

- Vercel Preview deployment is `READY`.
- The Preview build compiled, passed TypeScript validation, completed static page generation, and produced the Next.js route output.
- The deployed public route `/` returned HTTP 200.
- The deployed Admin route `/admin` returned HTTP 200 and rendered the email-login screen.
- The public HTML uses Thai document language, includes Chapter 08 and the Mixtape chapter, contains no `[RECIPIENT NAME]` placeholder, and does not render empty photo placeholder cards.
- Supabase project `zchqkhwprevcitfarkxa` is `ACTIVE_HEALTHY`.
- Admin PIN `2912` was compared against the stored bcrypt hash without exposing the hash; it matched.
- The three owner-supplied memory dates were normalized and saved as bcrypt hashes. Direct hash comparison verified all three stored answers:
  - First meeting: `03/07/25`
  - First trip: `19/09/26`
  - First 24 hours together: `02/08/26`
- The private schema is not granted to `anon` or `authenticated`; Admin and media write policies check the Admin claim and the recent PIN-unlock expiry.
- The Edge Function Gateway is Active at version 5, with the tightened origin allowlist.
- The `project_2912_content.updated_by` foreign-key index was added.

## Implemented on the feature branch

- Admin Studio can edit Home, Act Cards, Story Timeline, Letter, Mixtape, Ocean, Secret Garden, Memory Gallery, and Memory Checkpoint prompts/answers.
- Mixtape metadata persists in the content JSON payload; audio and cover files upload to Supabase Storage.
- Public playback uses the saved Storage paths; audio uploads are no longer offered to public visitors.
- Admin media uploads are constrained to supported MIME types and file sizes below the bucket limit.
- Gallery stays hidden until real photographs exist.
- Back-to-top hides near the footer; chapter warp now prefers the browser `scrollend` event with a bounded fallback timer.
- QA and personalization guides reflect online media storage and current manual test cases.

## Still blocked on owner participation

- The private Admin allowlist contains zero email entries. The owner must provide the exact email to authorize; then the owner must receive and confirm the magic link.
- Supabase Auth redirect URLs must include the final chosen Vercel domains. The current connector does not expose Auth URL configuration, so verify this in Supabase Dashboard if magic-link callbacks fail.
- No real photographs or audio tracks have been supplied yet. Public Gallery is intentionally empty, and the Mixtape player displays a deliberate empty state until media is uploaded through Admin.
- The content row is not yet initialized; the site currently uses safe code defaults until the owner signs in and saves from Admin Studio.

## Not yet verified

- Browser-driven interaction tests on real desktop/mobile browsers (chapter clicks, full focus behavior, audio playback, storage uploads, and cross-device persistence).
- Successful owner magic-link login and Admin PIN flow, because the allowlist is not populated.
- Production environment variables, Production deployment, merge, and launch. These remain intentionally untouched.

## Security notes

- The media bucket is public for playback by the gift recipient. Do not upload sensitive or confidential images/audio to this bucket.
- The Supabase advisor still reports leaked-password protection disabled. It should be enabled in Supabase Auth security settings when available.
- The advisor also reports `public.accept_pair_code(text)` as an authenticated SECURITY DEFINER function. It belongs to the existing application pairing flow, so it was not changed as part of this project to avoid breaking unrelated behavior.
