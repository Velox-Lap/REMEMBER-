# PROJECT 29.12 — Phase 1 Engineering Status

**Last reviewed:** 2026-11-14  
**Development branch:** `feat/project-29-12-hardening`  
**Latest recorded Preview deployment:** https://project-29-12-qjgmkbdxk-velox19.vercel.app

## Verified at the previous Phase 1 checkpoint

- The Vercel Preview deployment was reported as READY.
- The Preview build was reported to have compiled, passed TypeScript validation, completed static page generation, and produced the Next.js route output.
- The public route `/` and Admin route `/admin` were previously reported as HTTP 200.
- The public page was reported to use Thai document language, include Chapter 08 and the Mixtape chapter, and omit empty photo placeholder cards.
- Supabase project `zchqkhwprevcitfarkxa` was ACTIVE_HEALTHY.
- The owner-provided checkpoint answers were stored as hashes and verified. Raw answers are intentionally excluded from repository documentation.
- The private schema denies direct access to `anon` and `authenticated`; Admin and media write policies require the Admin claim and an unexpired PIN-unlock window.
- The `project-2912-gateway` Edge Function was ACTIVE at version 5.
- The `project_2912_content.updated_by` foreign-key index was added.

These are historical verification notes from the earlier checkpoint, not a substitute for re-running the browser and production tests in the current release cycle.

## Implemented on the development branch

- Admin Studio can edit Home, Act Cards, Story Timeline, Letter, Mixtape, Ocean, Secret Garden, Memory Gallery, and Memory Checkpoint prompts/answers.
- Mixtape metadata persists in the content JSON payload; audio and cover files upload to Supabase Storage.
- Public playback uses saved Storage paths; media upload controls are restricted to Admin.
- Admin media uploads are constrained to supported MIME types and file sizes below the bucket limit.
- The public Gallery remains hidden until real photographs exist.
- Chapter navigation includes a scroll-completion-aware transition and a bounded fallback.
- QA and personalization guides describe online Admin editing and persistent Mixtape media.

## Owner participation still required

- The private Admin allowlist currently has zero email entries. The owner must supply and authorize the exact Admin email through a private channel, then complete the magic-link confirmation.
- Supabase Auth redirect URLs must include the final chosen Vercel domains.
- Real photographs and audio tracks have not yet been supplied. The public Gallery and Mixtape intentionally remain in empty states until media is uploaded through Admin.
- The published content row has not yet been initialized; the site therefore uses safe code defaults until an authorized Admin saves content.

## Not yet verified for release

- Browser-driven interaction tests on desktop and mobile (chapter navigation, keyboard focus, audio playback, Storage uploads, and cross-device persistence).
- Successful owner magic-link login and Admin PIN flow.
- Final Supabase Auth redirect configuration.
- Production release of the development branch and end-to-end verification of the promoted Production deployment.

## Security notes

- The `project-2912-media` bucket is public for recipient playback. Only upload media explicitly approved for public sharing; do not use it for confidential material.
- Supabase Auth leaked-password protection was reported disabled by the security advisor; enable it in the Supabase Dashboard.
- The advisor also reports an authenticated-executable `SECURITY DEFINER` pairing function in the existing application. It is outside this project's scope and was not changed during this audit.
- A previous version of this document contained an Admin credential in plaintext. The current document has been redacted, but the repository is public and Git history may retain the earlier version. **Rotate the Admin PIN before relying on it again.** Redacting this file does not revoke the credential.
