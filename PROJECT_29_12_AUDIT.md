# PROJECT 29.12 — Technical Audit

**Audit date:** 2026-11-14  
**Scope:** GitHub source, Vercel project/deployments, Supabase schema/RLS/storage/functions/advisors  
**Target repository:** `Velox-Lap/REMEMBER-`  
**Target Vercel project:** `project-29-12`  
**Target Supabase project:** `zchqkhwprevcitfarkxa`  
**Audit mode:** Read-only infrastructure inspection plus non-destructive documentation/code corrections on `feat/project-29-12-hardening`, with CI follow-up work isolated on `chore/project-29-12-ci-coverage`.

## 1. Executive summary

PROJECT 29.12 is not a blank project and should not be rewritten from scratch. The existing feature branch contains a substantially implemented Next.js storytelling site, Supabase-backed content loading, an Admin Studio, media persistence, checkpoint verification, and a protected Admin write model.

The major release issue is **branch/environment drift**: the Vercel Production deployment is built from the older `main` branch, while the more complete implementation exists on `feat/project-29-12-hardening` and is deployed only as a Preview. The current Production deployment and the feature Preview must not be treated as the same application version.

The Supabase infrastructure for PROJECT 29.12 is present and healthy. The project-specific content and memory tables are not initialized with published records, the Admin allowlist is empty, and no real Gallery images or Mixtape tracks have been supplied. These are blockers to completing the owner workflow, not reasons to fabricate content.

No Production deployment, database migration, destructive database operation, branch merge, or access-control relaxation was performed during this audit.

## 2. Target identity and infrastructure

| System | Verified target | Observed state |
|---|---|---|
| GitHub | `Velox-Lap/REMEMBER-` | Public repository; `main` plus development branch |
| Development branch | `feat/project-29-12-hardening` | Contains Admin/Supabase implementation |
| Vercel | `project-29-12` | Next.js project in team `velox19` |
| Production deployment | `main` commit `6bac58068867f401e011fcf951cc42d550774411` | READY; older implementation |
| Parent hardening Preview | `feat/project-29-12-hardening` | READY; commit `346822dfd645f6c7589c63638beee34cf311d7fc` |
| Latest follow-up Preview | `chore/project-29-12-ci-coverage` | READY; commit `279646088a0effe964442eab93cb4ec4b7c678a1`; compile and deployment succeeded |
| Supabase | `zchqkhwprevcitfarkxa` | ACTIVE_HEALTHY |
| Storage bucket | `project-2912-media` | Public read; Admin-restricted writes |

The separate Supabase project named RNMCOM was not modified.

## 3. Architecture and current implementation

### Frontend
- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS.
- Framer Motion, GSAP, and Lucide are present in the dependency set.
- Main experience includes Intro, Garden, Story, Memories, Letter, Mixtape, Ocean, Secret, and Finale chapters.
- Content is typed in `src/lib/project-2912-content.ts` and is loaded by the server-side helper.
- The public page falls back to safe code defaults if the public content row is not initialized or Supabase cannot be reached.

### Admin and backend
- `/admin` hosts the Admin Studio.
- Sign-in uses Supabase email magic links.
- Admin elevation is checked against a private allowlist through the `project-2912-gateway` Edge Function.
- Admin writes require the Admin app-metadata claim and a time-limited PIN-unlock claim.
- The gateway performs explicit bearer-token/user checks even though Edge Function JWT verification is disabled at the gateway level.
- The browser uses the Supabase anonymous/publishable client key; service-role access is confined to the Edge Function environment.

### Data model
Project-specific objects include:
- `public.project_2912_content`: published JSON payload.
- `public.project_2912_memories`: ordered Gallery records.
- `public.project_2912_questions`: active checkpoint prompts.
- `project_2912_private.answer_keys`: hashed checkpoint answers.
- `project_2912_private.admin_pin`: Admin PIN hash.
- `project_2912_private.quiz_attempts`: verification rate-limit state.
- `project_2912_private.admin_allowlist`: authorized Admin email addresses.

The existing general-purpose social/pairing tables in the same Supabase project are outside this project-specific scope and were not changed.

## 4. Data and access findings

Observed project-specific row counts at audit time:

| Object | Rows | Interpretation |
|---|---:|---|
| Published content | 0 | Public site currently relies on safe code defaults |
| Gallery memories | 0 | No published Gallery records |
| Checkpoint prompts | 3 | Three configured prompt records exist |
| Private checkpoint answer hashes | 3 | Stored privately; raw answers are not included here |
| Admin allowlist | 0 | No email can currently be activated as the project Admin |
| Quiz attempts | 0 | No rate-limit history currently stored |

All inspected tables in `public` and `project_2912_private` have Row Level Security enabled. Private-schema direct access is denied to `anon` and `authenticated`. Project-specific public read policies are limited to published content/active prompts. Project-specific write policies require the Admin claim and a valid recent PIN-unlock timestamp.

The Storage bucket is public for playback by the recipient. Public read is intentional for the current product design; only media approved for sharing should be uploaded. Admin upload/update/delete policies require the Admin claim and an active PIN-unlock window.

## 5. Findings by severity

### CRITICAL

**SEC-001 — Admin credential disclosed in public repository history**
- **Evidence:** A previous version of `docs/PHASE1_STATUS.md` contained an Admin credential in plaintext in the public GitHub repository.
- **Impact:** Anyone able to retrieve that historical commit may have seen the credential.
- **Action completed:** The current version of `docs/PHASE1_STATUS.md` has been redacted. Raw checkpoint answers were also removed from public QA documentation.
- **Still required:** Rotate the Admin PIN using a trusted owner-only flow. The current-file redaction does not revoke the old PIN or erase historical Git objects. Review whether repository history needs a coordinated sensitive-data purge; do not force-push or rewrite shared history without an agreed recovery plan.
- **Status:** BLOCKED pending owner credential rotation and history-remediation decision.

### HIGH

**REL-001 — Production and development branch are out of sync**
- **Evidence:** The active Production deployment references an older `main` commit. The Admin/Supabase-backed implementation exists on `feat/project-29-12-hardening` and is deployed as Preview.
- **Impact:** Users visiting the Production alias may not receive the newer Admin and persistence implementation.
- **Recommendation:** Complete Preview QA, owner content review, and manual Admin onboarding before merging/promoting. Do not deploy the feature branch directly to Production until the owner approves the recipient-facing content and release.
- **Status:** OPEN; no merge or Production promotion performed.

**ADM-001 — Admin allowlist is empty**
- **Evidence:** `project_2912_private.admin_allowlist` contains zero rows.
- **Impact:** A confirmed email can sign in but cannot be activated as a project Admin until explicitly allowlisted.
- **Required owner action:** Provide/authorize the intended Admin email through a private channel, then complete the Supabase magic-link flow.
- **Status:** BLOCKED pending owner input.

**DATA-001 — Published content and Gallery are not initialized**
- **Evidence:** The content and memory tables contain zero rows.
- **Impact:** Safe defaults and empty states are expected. The finished personal experience cannot be considered personalized or release-ready until actual content and approved media are saved.
- **Required owner action:** Review and enter final copy, dates, photographs, and tracks through Admin Studio after Admin access is working.
- **Status:** OPEN; no personal content was invented.

**SEC-002 — Public Storage bucket**
- **Evidence:** `project-2912-media` allows public reads; project-specific write policies restrict Admin mutations.
- **Impact:** Uploaded object URLs can be accessed without an account.
- **Required control:** Upload only recipient-approved public media; never store confidential photographs, private recordings, or secrets in this bucket.
- **Status:** INTENTIONAL DESIGN WITH DATA-HANDLING CONSTRAINT.

**QA-001 — End-to-end browser verification is incomplete**
- **Evidence:** A manual QA checklist exists, but desktop/mobile interaction tests, magic-link login, file uploads, audio playback, and cross-device persistence have not been re-run in this audit session.
- **Impact:** A successful deployment status alone does not prove that the real user journeys work.
- **Status:** OPEN.

### MEDIUM

**DOC-001 — Repository documentation was stale**
- **Evidence:** The README described a frontend-only/static site, despite the development branch containing Supabase integration and an Admin Studio. `.env.example` did not list the required public Supabase variables.
- **Action completed:** README now describes the actual branch architecture and release safeguards. `.env.example` now documents `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` without embedding values.

**DATA-002 — Gallery save sequence could partially delete saved content**
- **Evidence:** The previous Admin implementation deleted removed Gallery rows before attempting to upsert new/edited rows.
- **Impact:** If the upsert failed after deletion, previously saved Gallery items could be lost.
- **Action completed:** The sequence now upserts current rows before deleting removed rows and reports a deletion failure separately. This reduces the risk of losing the prior Gallery on an upsert failure.
- **Status:** IMPLEMENTED; runtime verification still required.

**DATA-003 — Gallery read failure could be reported as a successful load**
- **Evidence:** The previous Admin loader treated a failed Gallery query like an empty Gallery and continued to the generic success status.
- **Action completed:** A Gallery read error now stops loading and reports the failure explicitly.
- **Status:** IMPLEMENTED; runtime verification still required.

**DATA-005 — Replacing a media object could change the published asset before Save**
- **Evidence:** Previous upload paths reused the same object key with overwrite enabled for Gallery images, Mixtape tracks, and Mixtape cover art.
- **Impact:** Replacing a file could change the asset already referenced by the public page before the new content metadata was saved.
- **Action completed:** Uploads now use unique versioned object paths and do not overwrite existing objects. The new path becomes part of the draft state; publishing still depends on saving the related content/Gallery record.
- **Status:** IMPLEMENTED; runtime verification still required.

**DATA-004 — Empty published lists could resurrect local defaults**
- **Evidence:** The public content loader only replaced checkpoint prompts when the database returned a non-empty list. An intentionally empty active list could therefore display default prompts.
- **Action completed:** Successful memory/question queries now replace the corresponding lists even when the result is empty.
- **Status:** IMPLEMENTED; runtime verification still required.

**OPS-001 — Dependency installation is not fully reproducible**
- **Evidence:** No package lockfile is present in the inspected repository tree; CI installs with `npm install --no-package-lock`.
- **Impact:** A future dependency resolution may differ from the version tested in a previous deployment.
- **Recommendation:** Agree on a package manager, generate and commit its lockfile, and use frozen/CI installation.
- **Status:** OPEN.

**AUTH-001 — Supabase Auth redirect URLs require final configuration**
- **Evidence:** The previous Phase 1 handoff records that the chosen Vercel callback domains still need to be included in Supabase Auth redirect configuration. The current tooling did not expose that Auth URL configuration for inspection.
- **Status:** NOT VERIFIED; check Supabase Dashboard before relying on magic-link callbacks.

### LOW / INFORMATIONAL

**PERF-001 — Existing database advisor findings outside the immediate content workflow**
- The advisor reported five unindexed foreign keys, sixteen RLS policy init-plan optimization notices, and five unused indexes across the project's wider public/social and project-specific schemas.
- These are not evidence of immediate data loss. Do not remove unused indexes or rewrite unrelated policies solely to silence the advisor. Prioritize based on actual query plans and workload.

**SEC-003 — Existing pairing function advisor warning**
- The security advisor reports that `public.accept_pair_code(text)` is an authenticated-executable `SECURITY DEFINER` function. It belongs to the existing pairing flow, not the PROJECT 29.12 content gateway. It was left untouched to avoid changing unrelated application behavior. Review its intended authorization contract separately.

**AUTH-002 — Leaked-password protection is disabled**
- Supabase Security Advisor reports that leaked-password protection is disabled.
- Recommendation: Enable the control in Supabase Auth security settings.

## 6. Requirements matrix

| ID | Requirement | Priority | Current state | Acceptance criteria |
|---|---|---|---|---|
| R-001 | Correct project targeting | Critical | VERIFIED | Repo, Vercel project, and Supabase project match |
| R-002 | Preserve existing product | High | IMPLEMENTED | No unrelated project or data modified |
| R-003 | Published content loads online | Critical | IMPLEMENTED, DATA NOT INITIALIZED | Saved content appears after refresh and on another device |
| R-004 | Admin sign-in | High | BLOCKED | Allowlisted owner completes magic link |
| R-005 | Admin authorization | Critical | IMPLEMENTED, OWNER NOT ONBOARDED | Non-allowlisted accounts cannot activate; only Admin can write |
| R-006 | Guest/public read-only access | High | POLICY DESIGNED | Anonymous reads published content; anonymous writes are denied |
| R-007 | Gallery CRUD | High | IMPLEMENTED, NOT RUNTIME VERIFIED | Add/edit/remove persists without partial data loss |
| R-008 | Mixtape persistence | High | IMPLEMENTED, NOT RUNTIME VERIFIED | Uploaded tracks and metadata survive refresh/device change |
| R-009 | Checkpoint verification | High | IMPLEMENTED, NOT RUNTIME VERIFIED | Correct/incorrect answers and rate limits behave correctly |
| R-010 | Responsive experience | High | NOT VERIFIED IN THIS AUDIT | QA passes at documented mobile/tablet/desktop sizes |
| R-011 | Accessibility and reduced motion | High | PARTIALLY IMPLEMENTED | Keyboard, focus, dialog, and reduced-motion checks pass |
| R-012 | Production release | Critical | NOT STARTED | Owner approves reviewed Preview and Production promotion is verified |

## 7. Changes made during this audit

The original hardening changes listed below are on `feat/project-29-12-hardening`. A follow-up branch, `chore/project-29-12-ci-coverage`, was created from that branch for additional CI coverage:

- Redacted the exposed credential from the current Phase 1 status document.
- Removed personal checkpoint values from the public QA checklist.
- Updated README to describe the actual Supabase-backed architecture and safeguards.
- Documented required public Supabase environment variable names in `.env.example` without including values.
- Changed Gallery save ordering to reduce partial deletion risk.
- Changed Gallery query error handling to avoid reporting failed reads as successful loads.
- Changed public content loading to respect intentionally empty Gallery/checkpoint lists.
- Changed Gallery image, Mixtape audio, and cover uploads to create unique versioned Storage objects instead of overwriting assets already referenced by published content.
- Updated `.github/workflows/quality.yml` on `chore/project-29-12-ci-coverage` so the typecheck, lint, and build workflow runs for all branch pushes, not only pushes to `main`.
- Changed CI from Node 20 to Node 26 to match the Vercel project runtime and the engine requirement of the installed Supabase JS package.
- Replaced build-time `next/font/google` with four self-hosted Fontsource families (Cormorant Garamond, Playfair Display, Inter, Caveat), preserving current typography variables.
- Added `PROJECT_29_12_PROGRESS.md` to record current infrastructure, verification, blockers, and next steps.

No Supabase migration, database write, Admin allowlist change, PIN rotation, merge into `main`, or Production deployment was performed. The new CI run remains pending verification.

## 8. Verification status and limitations

- GitHub source files, branch metadata, commit history, Vercel project/deployment metadata, Vercel environment variable names, Supabase schema, RLS policies, Storage policies, Edge Function configuration, migration history, and advisors were inspected.
- The latest inspected Preview deployment for `feat/project-29-12-hardening` is READY at commit `346822dfd645f6c7589c63638beee34cf311d7fc`. Its build logs show successful Next.js compilation, lint/type validation, static page generation, and route output for `/`, `/admin`, and `/_not-found`.
- The GitHub combined commit status for that Preview commit reports the Vercel check as successful.
- GitHub Actions run `43585417036` on commit `279646088a0effe964442eab93cb4ec4b7c678a1` completed successfully: dependency installation, TypeScript check, ESLint, and production build all passed.
- The matching Vercel Preview deployment `dpl_GieQRFcbRJSTJURc626TUGhQsSiv` is READY. Its logs confirm successful compilation, static generation, and deployment.
- An earlier CI attempt failed in `next/font/google` while TypeScript and ESLint passed. Switching to self-hosted Fontsource assets removed that build-time network dependency.
- Production deployment metadata reported READY and points to the older `main` commit.
- Automated local `npm run typecheck`, `npm run lint`, and `npm run build` were not executed in this audit environment. GitHub Actions ran all three checks successfully on the follow-up branch.
- Live browser interaction tests could not be completed because browser access to the protected Vercel deployment was not available through the current inspection path. Do not infer that the login, media upload, or public site journeys passed.
- Dependency installation reported 8 vulnerabilities (7 moderate, 1 high) and deprecated transitive packages. The install summary did not include package paths; a detailed dependency audit and a committed lockfile remain open.
- The existing manual QA checklist remains the required release gate.

## 9. Next implementation priorities

1. Verify the new branch-push GitHub Actions run and its Vercel Preview deployment.
2. Rotate the exposed Admin PIN and decide whether Git history needs a sensitive-data purge.
3. Complete the private Admin allowlist and Supabase Auth redirect configuration using the owner's authorized email and Vercel domains.
4. Run actual browser tests on desktop and mobile against the latest Preview.
5. Initialize published content and upload only approved recipient-facing media.
6. Resolve remaining functional/accessibility defects found during QA.
7. Obtain explicit owner approval after reviewing the recipient-facing Preview.
8. Merge/promote the tested branch, then verify the actual Production URL and critical workflows.

## 10. Owner actions required

- Rotate the Admin PIN because an earlier public commit contained it.
- Decide whether to purge or rewrite public Git history to remove the historical credential. This is a coordinated history operation and is not included in the current changes.
- Provide the Admin allowlist email through a private channel and complete the magic-link confirmation.
- Verify the Supabase Auth redirect allowlist for the final Vercel domains.
- Supply and approve the final copy and recipient-approved photographs/audio.
- Review the latest Preview and explicitly approve the Production release.

**Release assessment:** The development branch is materially more complete than Production and has a clear path to release, but it is **not production-ready yet**. Critical release blockers are credential rotation/history handling, Admin onboarding, content initialization, and end-to-end browser QA.
