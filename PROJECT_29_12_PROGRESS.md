# PROJECT 29.12 — Development Progress

**Snapshot:** 2026-11-14 (Asia/Bangkok)
**Working branch:** `chore/project-29-12-ci-coverage`
**Parent development branch:** `feat/project-29-12-hardening`
**Parent HEAD at branch creation:** `346822dfd645f6c7589c63638beee34cf311d7fc`
**Latest implementation commit recorded:** `279646088a0effe964442eab93cb4ec4b7c678a1`

## 1. Current state

PROJECT 29.12 is an existing Next.js storytelling application with a Supabase-backed content model and an Admin Studio. The project should continue from the existing hardening branch. It must not be replaced by an unrelated implementation.

The correct infrastructure targets have been cross-checked:

- GitHub: `Velox-Lap/REMEMBER-`
- Vercel: `project-29-12` (`prj_ZOi3G2aZgS9DPw3jl2cUblqWXwe8`)
- Supabase: `Velox-Lap's Project` (`zchqkhwprevcitfarkxa`)
- The separate Supabase project `RNMCOM` was not modified.

The development branch `feat/project-29-12-hardening` is 83 commits ahead of `main` and has no commits behind it. Production still references the older `main` commit. Do not merge or promote before manual QA, owner review, Admin onboarding, and credential rotation.

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

## 3. Current deployment evidence

### Preview

- Vercel project: `project-29-12`
- Deployment: `dpl_ExFs4PQgwheZqpfMERe4aw86dRnp`
- URL: https://project-29-12-bj75dpz0b-velox19.vercel.app
- Source branch: `feat/project-29-12-hardening`
- Source commit: `346822dfd645f6c7589c63638beee34cf311d7fc`
- Vercel state: `READY`
- Build log evidence: Next.js compile succeeded; lint/type validation ran; static page generation completed; routes `/`, `/admin`, and `/_not-found` were emitted.

This deployment is attached to the parent development branch, not the new CI-only branch. A new Preview and CI run should be checked after the CI change commits.

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
- Direct `anon`/`authenticated` access to the `project_2912_private` schema is denied by policy.
- Project-specific write policies use the Admin app-metadata claim and a time-limited PIN unlock.
- The Edge Function verifies bearer tokens and Admin metadata before privileged actions; the service-role client is kept in the Edge Function, not browser code.
- The `project-2912-media` bucket is public-read for recipient playback. Only content approved for public sharing belongs there.
- Supabase Security Advisor reports leaked-password protection disabled.
- Security Advisor also reports an authenticated-executable SECURITY DEFINER pairing function `public.accept_pair_code(text)`. It appears to belong to the separate existing pairing flow and was not modified.
- No secrets, private key values, checkpoint answers, or PIN values are included in this report.

## 6. Database and application changes

No database DDL, migration, data write, storage upload/deletion, allowlist change, PIN rotation, Production deployment, or merge into `main` was performed in this session.

### CI and build reliability changes

- `.github/workflows/quality.yml` now runs on every branch push and retains pull-request checks targeting `main`.
- CI now uses Node 26. The prior Node 20 setting was below the engine requirement of the installed Supabase JS 2.119.0 packages and was end-of-life; Node 26 matches the Vercel project runtime.
- Replaced build-time `next/font/google` imports with locally bundled Fontsource packages for Cormorant Garamond, Playfair Display, Inter, and Caveat. Existing family names and CSS-variable usage are preserved.
- Added the four Fontsource packages at version `5.3.0`.
- Latest GitHub Actions run `43585417036` completed successfully: dependency installation, TypeScript check, ESLint, and production build all passed.
- Matching Vercel Preview deployment `dpl_GieQRFcbRJSTJURc626TUGhQsSiv` reached `READY`.

An earlier CI run failed in Next.js `next/font/google` with a Google Font response parsing error, while TypeScript and ESLint passed. The local-font change removed this build-time external network dependency, and the latest CI and Preview succeeded.

### Remaining engineering debt

- No committed package-manager lockfile exists; installs still use `npm install --no-package-lock`, so dependency resolution is not fully reproducible.
- The successful install reported 8 dependency vulnerabilities (7 moderate, 1 high) and several deprecated transitive packages. The install summary did not identify the affected package paths; run a detailed dependency audit before release.
- No local build was run in this session; the passing verification is from GitHub Actions and Vercel build logs.

## 7. Next actions

1. Integrate the verified CI/font changes into `feat/project-29-12-hardening` after reviewing the follow-up branch diff.
2. Add a committed lockfile and investigate the 1 high / 7 moderate dependency audit findings.
3. Review the complete Admin and public experience using an authenticated browser session.
4. Rotate the leaked Admin PIN securely; resolve the public-history remediation decision.
5. Authorize the Admin email privately and verify Supabase Auth redirects.
6. Complete Admin onboarding and save owner-approved content/media.
7. Run the manual QA checklist on desktop and mobile.
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
