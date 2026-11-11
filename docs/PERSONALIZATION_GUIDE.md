# PROJECT 29.12 — Personalization and Storytelling Guide

The current site is a designed framework. Do not ship it with bracketed placeholders or generic sample copy.

## 1. Start with the recipient, not the design
Write down three things that are genuinely characteristic of the recipient:
- A place, object, or natural setting they enjoy.
- A small shared moment that would be recognizable to both people.
- A detail they would notice because it is specific to them.

Avoid private details that the recipient would not want published or stored in a browser.

## 2. Replace content in one source of truth
- `src/content/site.ts`: recipient name, opening subtitle, project title, footer note.
- `src/content/memories.ts`: chronological story moments. The public Gallery stays hidden until real memory items are added through Admin Studio.
- `src/content/letter.ts`: recipient, letter paragraphs, closing, signature, date.
- `src/content/ocean.ts`: three ocean memories and the chapter's connecting text.
- `src/content/secret.ts`: three flower notes and the final reveal.

Keep copy concise. A specific two-sentence memory is stronger than a long generic paragraph.

## 3. Build a coherent emotional arc
- Intro: establish that this was made for one person.
- Garden: invite them into the world.
- Story: show how the relationship or shared experience unfolded.
- Memories: let real photographs carry the emotional weight.
- Letter: say what the interactive chapters cannot say.
- Mixtape: connect each song to a memory or reason for choosing it.
- Ocean: create a quiet pause and a future-facing moment.
- Secret garden: reward curiosity with three meaningful notes.
- Finale: close with one clear message and a personal sign-off.

Each chapter should add a new piece of information. Avoid repeating the same sentiment in different wording.

## 4. Photograph and audio preparation
- Use photographs the recipient is comfortable having included.
- Prefer 6–10 carefully selected images over many filler images.
- Use consistent crops and provide meaningful alt text when images are added.
- Use audio files that the recipient is allowed to receive and play.
- Upload audio and cover artwork from the Admin Studio Mixtape tab. Tracks and media paths are stored online in Supabase so the recipient can play the same soundtrack after refresh and on another device.
- The media bucket is public by design for recipient playback; only upload media intended to be shared with the gift recipient.

## 5. Final review questions
- Could the recipient identify at least three memories without being told what they mean?
- Does each song have a reason for being there?
- Does the letter sound like the sender's actual voice?
- Is the reveal kind and appropriate, with no pressure or expectation attached?
- Are all names, dates, images, and permissions correct?
- Are all bracketed placeholders removed?
- Does the public Gallery contain only real photographs, not decorative filler cards?
- Does every Mixtape track have its artist and a personal reason for being included?

## Release rule
Do not merge or publish until the content owner has reviewed every personal detail and approved the final recipient-facing experience.
