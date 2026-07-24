# Bright Beginnings Tutoring — Project Brief

## The core idea

Shubhada is starting an online tutoring business teaching **Hindi and Marathi**, starting from the very basics — letters, then barakhadi, then reading/writing more — plus **Math**. It's open to anyone, Indian or not; the whole point is to be welcoming to non-Indian families too, which is why the business name deliberately avoids Hindi/Sanskrit words (see Branding below).

This started as a simple static marketing page (in the same spirit as an earlier project called Meridian) but grew into a real product: a kid-friendly, interactive site with **three separate logged-in dashboards** — one for the teacher, one for parents, and one for the kids themselves.

## Branding

- **Name: undecided, currently a placeholder** ("Bright Beginnings Tutoring"), swappable in `lib/siteConfig.ts`.
- Several "Shubh + ___" name ideas were explored (playing on the teacher's name, Shubhada) and explicitly rejected — the business wants to welcome non-Indian families, so the name shouldn't lean on an Indian-language word as its hook.
- A second round of plain-English names ("Bright Beginnings," "Two Tongues," "Learning Ladder," "Language Bridge") also didn't land on a final pick — placeholder text stands in until a name is chosen. It touches exactly one file (`lib/siteConfig.ts`).
- Phone: **+1 (407) 234-8117**, used for both a `tel:` link and a WhatsApp click-to-chat link throughout the site.
- Pricing: not yet decided, shown as "contact us for current pricing" — see `pricingNote` in `lib/siteConfig.ts`.

## Who it's for

- **The teacher:** Shubhada, the only teacher — there's no multi-teacher support, and no public "sign up as a teacher" flow. Her dashboard is reached by manually promoting her account to the `teacher` role in Supabase (see README).
- **Parents:** self-register with email/password. Since there's only one teacher, every parent who signs up is automatically part of her roster — no approval step.
- **Students:** young beginners, likely too young to manage an email account, so they log in with a simple **username + 4-digit PIN** their parent sets up. No email required for kids at all.

## Visual identity

- **Palette:** warm and bright rather than the wood/manor look used for the earlier Meridian project — marigold orange, teal, deep plum, sunny cream background, sky blue and grass green as subject accents (`app/globals.css`).
- **Fonts:** Baloo 2 (rounded, playful) for headings, Nunito for body text — chosen for a kid-friendly, approachable feel.
- **Interactivity:** Framer Motion powers a flip-card letter game, a tap-the-count math game, a PIN-pad-style student login, and a confetti "mastery" celebration — these are the concrete pieces that make the site feel like a kids' product rather than a brochure.

## Three dashboards — what each one actually does

1. **Teacher** (`/dashboard/teacher`): sees every student grouped by family (with parent name/phone), can log progress per subject (topic + status: not started / in progress / mastered) and assign practice tasks. This is the only role that can write progress or create assignments — enforced both in the UI and at the database level via Row Level Security, so it holds even if someone bypasses the UI.
2. **Parent** (`/dashboard/parent`): sees their own children only, each child's progress per subject and any assigned practice, a "message Shubhada on WhatsApp" button, and a form to add another child (name, username, PIN).
3. **Student** (`/dashboard/student`): a "Today's Lesson" banner, star badges per subject for mastered topics, a list of assigned practice they can mark done themselves, and two playable practice games (letter flip cards, counting).

## A deliberate security/scope decision: student PIN login

Students aren't Supabase Auth users — they have no email. Logging in with just a username + 4-digit PIN is easy for a young child but inherently guessable, so:
- PIN attempts are rate-limited (lock out after 5 wrong tries for a few minutes) — implemented in-memory in `lib/rateLimit.ts`, which is a deliberate simplification: it resets if the server restarts. Fine for a small family-run tutoring business, not meant to scale past that without revisiting.
- The student's session is a separate signed cookie (`lib/studentSession.ts`), completely independent from the parent/teacher Supabase Auth session, and only ever grants access to that one student's own records (checked server-side on every write, e.g. `app/api/student/complete-assignment/route.ts`).

## Technical implementation

- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Supabase (Postgres + Auth), deployed free on Vercel + Supabase's free tier.
- Next.js 16 renamed `middleware.ts` to `proxy.ts` (and the exported function to `proxy`) — this project uses the new convention from the start (`proxy.ts`), discovered via the framework's own bundled docs (`node_modules/next/dist/docs`) rather than assumed from prior training data, since v16 shipped several breaking changes after most model training cutoffs.
- **Data model:** `profiles` (role: teacher/parent), `students` (linked to a parent, holds username + hashed PIN), `progress_entries` (a running log per subject/topic/status, not a single current-state row — the teacher can log progress over time), `assignments`. Full schema and Row Level Security policies in `supabase/schema.sql`.
- **Practice content:** the letter flip-cards and counting game are a small fixed set of content in `data/practiceContent.ts`, not teacher-editable yet — see Open Items.

## Notable process history (context, not action items)

- Node.js wasn't installed on the machine this was built on; it was installed via `winget install OpenJS.NodeJS.LTS` mid-build with the user's approval before scaffolding could start.
- The original plan was a static HTML/CSS/JS site (like Meridian) with empty `css/`/`js`/`assets` folders already created. Once the three-dashboard requirement came up, those were removed and replaced with a full Next.js app in the same folder, since a static site can't support real accounts or a database.

## Open items / not yet done

- [ ] Final business name (currently placeholder text in `lib/siteConfig.ts`)
- [ ] Real pricing (currently "contact us" placeholder)
- [ ] Create Shubhada's teacher account and promote it to `role = teacher` in Supabase (manual, one-time — see README)
- [ ] Set up the actual Supabase project and paste the real keys into `.env.local` (nothing runs against a real database until this is done)
- [ ] Audio pronunciation for the letter practice game
- [ ] A way for the teacher to add/edit practice game content herself, instead of editing `data/practiceContent.ts` directly
- [ ] Deploy live on Vercel
