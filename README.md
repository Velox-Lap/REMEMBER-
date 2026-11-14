# PROJECT 29.12

**A Journey Through Our Little Universe**

A private, cinematic storytelling experience built with Next.js. The public site presents the journey, memories, letter, Mixtape, ocean chapter, checkpoint questions, and final reveal.

## Current architecture

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, GSAP where justified, and Lucide icons.
- **Content:** Published content is read from Supabase. Safe local defaults are used when the public content row is not initialized or the backend is not configured.
- **Admin:** `/admin` provides an email magic-link sign-in flow, allowlist-based Admin activation, and a time-limited Admin PIN verification window.
- **Database:** Supabase stores the published content payload, Gallery records, checkpoint prompts, private answer hashes, Admin allowlist, and rate-limit state.
- **Media:** The `project-2912-media` Storage bucket serves recipient-approved public images and audio. Media upload and mutation are restricted by Admin claims and the active PIN window.
- **Hosting:** Vercel project `project-29-12`, connected to this repository.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add the public Supabase project URL and anonymous/publishable key from the connected project.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

Do not add a Supabase service-role key to `NEXT_PUBLIC_*` variables, browser code, or committed files. Never commit `.env.local`.

## Quality checks

Run before opening or updating a pull request:

```bash
npm run typecheck
npm run lint
npm run build
```

The GitHub Actions quality workflow runs these checks on pushes and pull requests to `main`. A successful Vercel deployment check confirms deployment readiness; it does not replace browser-based functional QA.

## Project documentation

- [Art Direction](docs/ART-DIRECTION.md)
- [Design System](docs/DESIGN-SYSTEM.md)
- [Component Library](docs/COMPONENT-LIBRARY.md)
- [Phase 1 Status](docs/PHASE1_STATUS.md)
- [Manual QA Checklist](docs/QA_CHECKLIST.md)
- [Personalization Guide](docs/PERSONALIZATION_GUIDE.md)

## Release safeguards

- Keep personal names, photographs, dates, and private messages out of public source control unless the content owner explicitly approves their publication.
- The Storage bucket is public for recipient playback. Upload only media that is intended to be shared.
- Admin access requires a confirmed email in the private allowlist and successful PIN verification.
- Do not merge or promote a release until the owner has reviewed the recipient-facing content and approved production release.
- Treat the latest verified Preview as the release candidate; Production promotion is a separate step.
