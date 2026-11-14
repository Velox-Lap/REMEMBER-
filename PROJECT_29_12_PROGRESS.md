# PROJECT 29.12 — Development Progress

**Snapshot:** 2026-11-14 (Asia/Bangkok)
**Working branch:** `chore/project-29-12-least-privilege`
**Parent development branch:** `chore/project-29-12-ci-coverage`
**Parent HEAD at branch creation:** `203762f0def2573e7ac959f514c633ad8023c42b`
**Latest code/migration commit recorded:** `cb0fe0730e53700a9d3c84375f16b4d8f771b2a4`

## 1. Current state

PROJECT 29.12 is an existing Next.js storytelling application with a Supabase-backed content model and an Admin Studio. The project should continue from the existing hardening branch. It must not be replaced by an unrelated implementation.

The correct infrastructure targets have been cross-checked:

- GitHub: `Velox-Lap/REMEMBER-`
- Vercel: `project-29-12` (`prj_ZOi3G2aZgS9DPw3jl2cUblqWXwe8`)
- Supabase: `Velox-Lap's Project` (`zchqkhwprevcitfarkxa`)
- The separate Supabase project `RNMCOM` was not modified.

The current working branch `chore/project-29-12-least-privilege` is 100 commits ahead of `main` and has no commits behind it at the latest comparison. Production still references the older `main` commit. Do not merge or promote before manual QA, owner review, Admin onboarding, and credential rotation.

## 2. Completed in this session

| Work item | Status | Evidence |
|---|---|---|
| Identify the correct GitHub repository | VERIFIED | Vercel deployment metadata points to `Velox-Lap/REMEMBER-` |
| Identify the Vercel project | VERIFIED | Project `project-29-12`, Next.js |
| Identify the Supabase project | VERIFIED | Project name, project reference, region, and dedicated `project_2912_*` objects match |
| Confirm development and production branch relationship | VERIFIED | Development branch is 83 commits ahead of `main`; Production deployment references `main` |
| Inspect core source tree and architecture | IMPLEMENTED / INSPECTED | Next.js App Router, typed content loader, Admin Studio, Supabase browser client |
| Inspect project-specific schema and RLS | INSPECTED | Public content, Gallery, checkpoint prompts, private answer hashes, Admin PIN hash, allowlist, and rate-limit tables inspected |
| Inspect Storage and Edge Function configuration | INSPECTED | Public media bucket and `project-2912-gateway` version 5 inspected |
| Review Supabase advisors | INSPECTED | Security, performance, and health advisors reviewed |
| Verify current Preview build logs | VERIFIED | Build compiled, lint/type validation ran, static page generation completed, and routes were emitted |
| Extend GitHub quality workflow | VERIFIED | Quality checks run on every branch push; latest full run passed on Node 26 |
| Remove build-time Google Fonts dependency | VERIFIED | Four Fontsource families self-hosted; Preview build succeeds without `next/font/google` fetch |
| Align CI runtime | VERIFIED | Node 26, matching the Vercel project runtime and current LTS line |
| Create persistent progress document | IMPLEMENTED | This file |
| Revoke anonymous mutation privileges on PROJECT 29.12 public tables | VERIFIED | Supabase migration `20261114110524_project2912_revoke_anon_mutations`; post-migration SQL privilege checks pass |

## 3. Current deployment evidence

### Preview

- Vercel project: `project-29-12`
- Latest observed deployment on the current working branch: `dpl_6uqgz4V3NoV5SjYNnzBXVQBd129s`
- Preview URL: https://project-29-12-916wu0iqr-velox19.vercel.app
- Source branch: `chore/project-29-12-least-privilege`
- Source commit: `cb0fe0730e53700a9d3c84375f16b4d8f771b2a4`
- Vercel state at last inspection: `QUEUED` (not yet verified as READY).
- Earlier commits on this branch reached READY: `f27b120b75d63cd83afc9515ad58bb0743c73583` and `43a31089f6dbf6dd389e894996400fe872c3abe6`.

The preview URL is not Production. Recheck the latest deployment after the final documentation commits and do not infer runtime success from QUEUED/READY status alone.

### Production

- Production deployment: `dpl_7Kvy2qdxQjCqbiJhsqxuoyaGzns2`
- Production alias: https://project-29-12.vercel.app
- Source branch: `main`
- Source commit: `6bac58068867f401e011fcf951cc42d550774411`
- Vercel state: `READY`

Production is older than the development branch. Production has not been changed or promoted in this session.

## 4. High-priority risks and blockers

### CRITICAL — Admin PIN exposure in public Git history

The existing repository audit documents that a prior public commit contained the Admin PIN in plaintext. The current file was redacted, but old Git objects may retain it. Rotate the PIN through a trusted owner-only process before using Admin. Separately decide whether the public repository history requires coordinated sensitive-history remediation. Do not force-push or rewrite history without a recovery plan.

### HIGH — Admin onboarding is not complete

The project-specific Admin allowlist contains zero rows. The owner must authorize the intended Admin email through a private channel, then complete the Supabase magic-link flow. Supabase Auth redirect allowlist entries for the intended Vercel domains also require confirmation.

### HIGH — Content is not initialized

The published content row and Gallery table are empty. Three checkpoint prompts and three private answer hashes exist. No names, dates, photos, tracks, or relationship copy should be invented. Use the Admin Studio after secure onboarding to provide and review recipient-facing content.

### HIGH — Browser-based QA remains incomplete

The Vercel build logs prove build success, not end-to-end correctness. Desktop/mobile, keyboard, reduced-motion, magic-link, Admin PIN expiry, Gallery CRUD, Storage upload failure paths, Mixtape playback, and cross-device persistence remain to be tested in a browser.

### HIGH — Production and Preview are different versions

Only the older `main` commit is in Production. The hardening branch remains a Preview candidate pending QA and explicit owner release approval.

## 5. Security observations

- All inspected project-specific public and private tables have RLS enabled.
- Before the latest migration, the `anon` role had excess INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER grants on the three public PROJECT 29.12 data tables. Migration `20261114110524_project2912_revoke_anon_mutations` revoked those permissions; post-migration checks confirm anonymous SELECT only. Authenticated write privileges are retained and remain restricted by Admin claim + recent PIN RLS policies.
- Direct `anon`/`authenticated` access to the `project_2912_private` schema is denied by policy.
- Project-specific write policies use the Admin app-metadata claim and a time-limited PIN unlock.
- The Edge Function verifies bearer tokens and Admin metadata before privileged actions; the service-role client is kept in the Edge Function, not browser code.
- The `project-2912-media` bucket is public-read for recipient playback. Only content approved for public sharing belongs there.
- Supabase Security Advisor reports leaked-password protection disabled.
- Security Advisor also reports an authenticated-executable SECURITY DEFINER pairing function `public.accept_pair_code(text)`. It appears to belong to the separate existing pairing flow and was not modified.
- No secrets, private key values, checkpoint answers, or PIN values are included in this report.

## 6. Database and application changes

One least-privilege database migration was applied to the verified PROJECT 29.12 Supabase project. It revokes non-SELECT privileges from `anon` on `project_2912_content`, `project_2912_memories`, and `project_2912_questions`. Post-migration SQL checks confirmed: anon SELECT=true, INSERT/UPDATE/DELETE/TRUNCATE=false; authenticated retains SELECT/INSERT/UPDATE/DELETE grants subject to RLS. No rows, content payloads, checkpoint hashes, allowlist entries, PIN hashes, media objects, or user records were changed. No production application deployment, branch merge, Admin onboarding, or credential rotation was performed.

### CI and build reliability changes

- `.github/workflows/quality.yml` now runs on every branch push and retains pull-request checks targeting `main`.
- CI now uses Node 26. The prior Node 20 setting was below the engine requirement of the installed Supabase JS 2.119.0 packages and was end-of-life; Node 26 matches the Vercel project runtime.
- Replaced build-time `next/font/google` imports with locally bundled Fontsource packages for Cormorant Garamond, Playfair Display, Inter, and Caveat. Existing family names and CSS-variable usage are preserved.
- Added the four Fontsource packages at version `5.3.0`.
- Latest GitHub Actions run `43585417036` completed successfully: dependency installation, TypeScript check, ESLint, and production build all passed.
- Matching Vercel Preview deployment `dpl_GieQRFcbRJSTJURc626TUGhQsSiv` reached `READY`.

An earlier CI run failed in Next.js `next/font/google` with a Google Font response parsing error, while TypeScript and ESLint passed. The local-font change removed this build-time external network dependency, and the latest CI and Preview succeeded.

### Remaining engineering debt

- The Supabase database had 11 prior migrations before this session, but the repository tree had no matching earlier migration files. The new least-privilege migration is now tracked at `supabase/migrations/20261114110524_project2912_revoke_anon_mutations.sql`; import/version the existing schema history before relying on this repo as a fully reproducible database source.
- No committed package-manager lockfile exists; installs still use `npm install --no-package-lock`, so dependency resolution is not fully reproducible.
- The successful install reported 8 dependency vulnerabilities (7 moderate, 1 high) and several deprecated transitive packages. The install summary did not identify the affected package paths; run a detailed dependency audit before release.
- No local build was run in this session; the passing verification is from GitHub Actions and Vercel build logs.

## 7. Next actions

1. Verify that the latest Vercel Preview and GitHub Actions checks for `chore/project-29-12-least-privilege` complete successfully.
2. Import/version the earlier Supabase migration history and create a reproducible package lockfile; investigate dependency vulnerabilities.
3. Review the complete Admin and public experience using an authenticated browser session.
4. Rotate the leaked Admin PIN securely; resolve the public-history remediation decision.
5. Authorize the Admin email privately and verify Supabase Auth redirects.
6. Complete Admin onboarding and save owner-approved content/media.
7. Run manual browser QA on desktop and mobile, including guest read-only API tests.
8. Obtain explicit owner approval before merging/promoting to Production.
9. Verify the actual Production deployment and critical user flows after release.

## 8. Owner actions

- Rotate the Admin PIN before relying on Admin.
- Decide whether to coordinate removal of the credential from public Git history.
- Privately authorize the Admin email and complete magic-link confirmation.
- Confirm Supabase Auth redirect URLs.
- Supply and approve actual content and public-shareable media.
- Review the Preview experience and explicitly approve Production release.

**Current release assessment:** NOT PRODUCTION-READY. The build is healthy, but credential rotation, Admin onboarding, real content, browser QA, and release approval remain unresolved.

## 9. Verification performed after the database hardening

- Current working-branch Preview deployment: `dpl_P4z8xnSons26NzApQ5iyLzdRVF2s`.
- Preview URL: https://project-29-12-jcm7ua41s-velox19.vercel.app
- Source branch/commit: `chore/project-29-12-least-privilege` / `55ba5a15951691370d1ff58f963ab0a811c379c8`.
- Vercel deployment state: `READY`; the commit status context `Vercel` reported `success`.
- Build log evidence: Next.js 15.5.29 optimized production build compiled successfully; lint/type validation stage completed; static page generation completed 4/4; route output included `/`, `/admin`, and `/_not-found`; Vercel reported build and deployment completed.
- npm emitted a non-blocking warning that the `cache-dir` environment configuration is unknown and may stop working in a future npm major version.
- The Preview deployment is not Production. Production remains on the older `main` commit.
- Browser-level workflows were not exercised in this verification: Supabase magic-link authentication, Admin allowlist activation, Admin PIN expiry, content/Gallery CRUD, public media playback, responsive and keyboard navigation, and cross-device persistence remain NOT VERIFIED.
- A current-branch GitHub Actions run was not returned by the available repository workflow query. Do not treat the Vercel build as proof that a separate GitHub Actions workflow ran.
- The deployment build verifies the application source and type/lint stage; it does not exercise live user permissions or media operations.

**Updated release assessment:** The database least-privilege change is VERIFIED, and the current working-branch Preview build is READY. The complete product remains NOT PRODUCTION-READY until credential rotation/history decision, Admin onboarding, owner-provided content, browser QA, migration-baseline reproducibility, and explicit release approval are complete.
