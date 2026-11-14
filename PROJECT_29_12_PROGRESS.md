# PROJECT 29.12 — Development Progress

**Snapshot:** 2026-11-14 (Asia/Bangkok)
**Working branch:** `chore/project-29-12-ci-coverage`
**Parent development branch:** `feat/project-29-12-hardening`
**Parent HEAD at branch creation:** `346822dfd645f6c7589c63638beee34cf311d7fc`
**Latest commit in this progress branch:** `9b661c1570ff0f296d92b081c190c169c3bf6ab6`

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
| Extend GitHub quality workflow | IMPLEMENTED | Quality checks now run on any branch push; PR checks still target `main` |
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

No database DDL, migration, data write, storage upload/deletion, allowlist change, PIN rotation, production deployment, or branch merge was performed in this session.

No application source code was changed in this session. The only code change so far is the GitHub Actions trigger configuration described below.

### CI change

`.github/workflows/quality.yml` previously ran on pushes to `main` only and on pull requests targeting `main`. It now runs the same typecheck, lint, and build job on every branch push while retaining pull-request checks against `main`.

The change is implemented but the new workflow run has not yet been verified. The workflow still uses `npm install --no-package-lock`; lack of a committed package-manager lockfile remains a reproducibility issue to address separately.

## 7. Next actions

1. Verify the GitHub Actions run and Vercel Preview created from the CI-change branch.
2. Inspect any CI or deployment failures and fix only confirmed issues.
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
