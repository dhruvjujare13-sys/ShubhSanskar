# ShubhSanskar

An interactive, kid-friendly website for an online Hindi, Marathi & math tutoring business, with three logged-in dashboards: **Teacher** (Shubhada), **Parent**, and **Student**.

Business name and pricing are swappable in `lib/siteConfig.ts` (see `PROJECT_BRIEF.md` for the full decisions log).

## Tech stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS + Framer Motion, with [Supabase](https://supabase.com) for the database and parent/teacher auth (free tier is plenty for this).

## 1. Set up Supabase (one-time, ~10 minutes)

1. Go to [supabase.com](https://supabase.com), create a free account and a new project.
2. Once it's ready, open **SQL Editor** in the Supabase dashboard, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates all the tables and security rules.
3. In **Project Settings > API**, copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this one secret — never put it in client-side code)
4. Copy `.env.local.example` to `.env.local` and fill in those three values, plus a random 32+ character string for `STUDENT_SESSION_SECRET` (used to sign the kids' login sessions — any long random string works, e.g. generate one at [1password.com/password-generator](https://1password.com/password-generator/) or run `openssl rand -hex 32`).
5. (Recommended for now) In **Authentication > Providers > Email**, turn **off** "Confirm email" so parents can sign up and get straight into their dashboard without checking their inbox. Turn it back on later if you want extra verification.

## 2. Create Shubhada's teacher account

There's no public "sign up as teacher" page on purpose — only one person should have that role. To create it:

1. Go to `/signup` on the running site and sign up normally with Shubhada's real email/password (this creates a `parent`-role account).
2. In the Supabase dashboard, go to **Table Editor > profiles**, find that row, and change `role` from `parent` to `teacher`.
3. Log out and log back in — she'll land on the Teacher Dashboard from now on.

## 3. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the three logins work

- **Parent:** normal email/password (Supabase Auth). Signs up at `/signup`, then adds each child from their dashboard (name, a username, a 4-digit PIN).
- **Student:** no email needed — kids log in at `/student-login` with just the username + PIN their parent set up. This uses its own lightweight session, separate from Supabase Auth.
- **Teacher:** same email/password login as parents, but the `teacher` role (set manually, see above) sends her to a different dashboard showing every student.

## Before you launch

- [ ] Decide the real business name and swap it into `lib/siteConfig.ts` (`businessName`, `tagline`)
- [ ] Add real pricing — currently `pricingNote` in `lib/siteConfig.ts` just says "contact us"
- [ ] Create Shubhada's teacher account (see step 2 above)
- [ ] Update the contact email in `lib/siteConfig.ts` if you want one besides the phone/WhatsApp
- [ ] Turn "Confirm email" back on in Supabase if you want parents to verify their email

## Deploying it live

**Vercel** (free tier) is the natural fit since this is a Next.js app:

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Add the same environment variables from `.env.local` in Vercel's project settings (Environment Variables).
4. Deploy — you'll get a live URL immediately, with a custom domain addable later.

Supabase stays exactly as configured; no separate database hosting needed.

## File structure

```
app/
  page.tsx                    Public homepage
  signup/, login/              Parent + teacher auth
  student-login/                Username + PIN login for kids
  dashboard/teacher/            Roster, progress tracking, assignments
  dashboard/parent/             Children list, add-a-child, progress view
  dashboard/student/            Today's lesson, practice games, badges
  api/student-login/            Verifies username+PIN, issues session cookie
  api/student/complete-assignment/  Lets a logged-in student mark practice done
components/                   Shared UI (header, footer, dashboard bits, practice games)
lib/
  supabase/                    Browser / server / admin (service-role) Supabase clients
  actions/                      Server Actions (auth, teacher writes, parent writes)
  siteConfig.ts                 Business name, phone, pricing placeholder — all swappable
  studentSession.ts             Signs/verifies the student's PIN-login session
data/practiceContent.ts        Letter flip-card and counting-game content
supabase/schema.sql            Database tables + Row Level Security policies
proxy.ts                       Route protection for /dashboard/* (Next.js 16 renamed "middleware" to "proxy")
```

## Known simplifications (fine for launch, worth revisiting if this grows)

- Student PIN attempts are rate-limited in memory, which resets if the server restarts — a reasonable speed bump for a small tutoring business, not bank-grade security.
- No audio pronunciation for letters yet — the flip-card game is visual only.
- No teacher UI for adding new practice games/content — the letter and counting games are a fixed starter set in `data/practiceContent.ts`. Editing that file is currently the way to add more.
