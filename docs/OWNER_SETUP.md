# PROJECT 29.12 — Owner Setup and Security Handoff

This document records the remaining steps that require the project owner's own identity, inbox, or browser session. Never send passwords, Admin PINs, magic-link URLs, or private keys through chat or commit them to Git.

## Current verified target

- Repository: `Velox-Lap/REMEMBER-`
- Working branch: `chore/project-29-12-least-privilege`
- Supabase project: `zchqkhwprevcitfarkxa`
- Vercel project: `project-29-12`
- Current Preview under review: `https://project-29-12-git-chore-project-29-12-least-privilege-velox19.vercel.app` (stable branch alias; Vercel Deployment Protection may require your Vercel account)
- Production alias: `https://project-29-12.vercel.app` (not changed by this work)

## 1. Rotate the previously exposed Admin PIN

A former public repository revision contained an Admin credential. The current documentation was redacted, but that does not remove the credential from old Git objects. Treat the old PIN as compromised.

The Supabase database now has a server-side PIN-rotation RPC restricted to `service_role`, and the `project-2912-gateway` Edge Function is deployed at version 6 with a `rotate_admin_pin` action. The Admin Studio working-branch UI includes a Security tab.

After your account has Admin access:

1. Open `/admin` on the current Preview.
2. Sign in using the email account that you authorized for Admin.
3. Complete the existing Admin PIN unlock.
4. Open **ความปลอดภัย** (Security).
5. Enter the current PIN, then set and confirm a new numeric PIN of 6–12 digits.
6. Do not reuse a PIN from another account. Do not share it in chat or add it to repository files.

The rotation service verifies the current PIN using the existing rate-limited bcrypt verifier, clears the active Admin PIN-unlock window, and stores only a bcrypt hash of the new PIN. The owner must perform the actual rotation in the browser; no PIN value is required by this document.

## 2. Authorize the Admin email and complete Magic Link

The private `project_2912_private.admin_allowlist` table was verified to contain zero rows. This is intentional until the owner authorizes an exact email.

The owner must:
1. Sign in to the correct Supabase project.
2. Add the exact owner-controlled email address to the private Admin allowlist as active.
3. Open the Admin page and request a Magic Link for that same address.
4. Open the email and complete the link on the same Preview domain.
5. Use the **ตรวจสอบและเปิดสิทธิ์ผู้ดูแล** action. It will succeed only if the confirmed email matches the private allowlist.

Do not add guessed email addresses. Do not send a Magic Link or PIN to anyone else.

## 3. Confirm Supabase Auth URL configuration

In Supabase Dashboard for project `zchqkhwprevcitfarkxa`, inspect **Authentication → URL Configuration**.

- Set the Site URL to the intended canonical site origin: `https://project-29-12.vercel.app`.
- Add the exact callback URL `https://project-29-12.vercel.app/admin` to the allowed redirect URLs.
- When signing in on the current Preview, also add the exact Preview callback `https://project-29-12-git-chore-project-29-12-least-privilege-velox19.vercel.app/admin`.
- Only add other Preview callback URLs when the owner has a concrete need to use those exact deployments. Avoid broad wildcards for temporary deployments.

The application sends the current browser origin plus `/admin` as `emailRedirectTo`. A mismatch between this callback and the Supabase allowlist can prevent the Magic Link from returning to Admin.

## 4. Enable leaked-password protection

In the same Supabase project, inspect **Authentication → Security / Password Protection** and enable leaked-password protection. Confirm the setting is saved in the dashboard. This is an owner-side Auth setting and is not changed by a database migration.

## 5. Public Git history remediation

After rotating the exposed credential, consider a coordinated history rewrite to remove the old sensitive value from all reachable repository history. This is a public repository and the development branch contains significant work, so history rewriting must preserve all required refs and be coordinated with collaborators, forks, open pull requests, and local clones.

Do not assume that deleting or redacting the current file is sufficient. Do not force-push until a full backup and recovery plan exists. A history rewrite cannot guarantee removal from forks, cached copies, or existing clones.

## 6. Personal content and public media

The content row and Gallery records were empty during the audit. The owner should enter and review the final text, dates, images, and tracks through Admin Studio. The media bucket is public-read so uploaded objects can be played by the recipient without signing in. Upload only media explicitly approved for sharing.

## 7. Release gate

Do not merge the working branch into `main` or promote a Production deployment until all of the following are true:

- The previously exposed PIN has been rotated.
- The intended Admin email is allowlisted and Magic Link login succeeds.
- Auth redirect configuration is verified.
- Leaked-password protection is enabled.
- Desktop and mobile browser QA passes, including keyboard and reduced-motion checks.
- Gallery, Mixtape, checkpoints, and cross-device persistence are tested.
- The owner has reviewed all recipient-facing content and public media.
- The owner explicitly approves the Production release.

Production has not been modified by this work.
