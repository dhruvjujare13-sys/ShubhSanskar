import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LetterFlipGame from "@/components/practice/LetterFlipGame";
import { siteConfig } from "@/lib/siteConfig";

const SUBJECT_CARDS = [
  {
    title: "Hindi",
    color: "bg-marigold",
    blurb: "From the very first letters, through barakhadi, to reading and writing simple words and sentences.",
    emoji: "📖",
  },
  {
    title: "Marathi",
    color: "bg-teal",
    blurb: "The same step-by-step path — letters, barakhadi, and beyond — for Marathi.",
    emoji: "✍️",
  },
  {
    title: "Math",
    color: "bg-sky",
    blurb: "Counting, numbers, and early math skills, taught alongside language lessons.",
    emoji: "🔢",
  },
];

const STEPS = [
  { title: "Letters", desc: "Learn to recognize and say each letter." },
  { title: "Barakhadi", desc: "Combine letters into their full sound families." },
  { title: "Words", desc: "Read and write simple, everyday words." },
  { title: "Reading & math", desc: "Build up to sentences, stories, and number skills." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-sunny to-white px-4 py-16 text-center">
          <h1 className="mx-auto max-w-2xl font-heading text-4xl font-bold text-plum sm:text-5xl">
            Learn Hindi, Marathi & Math — one letter at a time.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate">{siteConfig.tagline}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-marigold px-6 py-3 font-heading text-lg font-bold text-white shadow-md hover:bg-marigold-dark"
            >
              Sign Up as a Parent
            </Link>
            <Link
              href="/student-login"
              className="rounded-full bg-teal px-6 py-3 font-heading text-lg font-bold text-white shadow-md hover:bg-teal-dark"
            >
              I&apos;m a Student
            </Link>
          </div>
        </section>

        {/* About */}
        <section className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="font-heading text-3xl text-plum mb-3">Meet {siteConfig.teacherName}</h2>
          <p className="text-slate">
            {siteConfig.teacherName} teaches Hindi and Marathi from the very basics — starting with letters and
            barakhadi — plus math, all online. Lessons welcome everyone, Indian or not, beginner or returning
            learner.
          </p>
        </section>

        {/* Subjects */}
        <section id="subjects" className="bg-white px-4 py-14">
          <h2 className="mb-8 text-center font-heading text-3xl text-plum">What We Teach</h2>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {SUBJECT_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border-2 border-marigold/20 bg-sunny/40 p-6 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${card.color}`}>
                  {card.emoji}
                </div>
                <h3 className="font-heading text-xl font-bold text-plum">{card.title}</h3>
                <p className="mt-2 text-sm text-slate">{card.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="px-4 py-14">
          <h2 className="mb-8 text-center font-heading text-3xl text-plum">How Lessons Progress</h2>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="rounded-2xl bg-white p-5 text-center shadow border-2 border-teal/20">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal font-heading font-bold text-white">
                  {i + 1}
                </div>
                <p className="font-heading font-bold text-plum">{step.title}</p>
                <p className="mt-1 text-sm text-slate">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Try it now */}
        <section className="bg-white px-4 py-14">
          <div className="mx-auto max-w-3xl rounded-3xl border-4 border-marigold bg-sunny/40 p-6 text-center">
            <h2 className="font-heading text-2xl text-plum mb-2">Try it yourself!</h2>
            <p className="mb-4 text-slate">
              This is a peek at what students play with on their dashboard — tap a letter below.
            </p>
            <LetterFlipGame />
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-14 text-center">
          <h2 className="font-heading text-3xl text-plum mb-4">Ready to get started?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-marigold px-6 py-3 font-heading text-lg font-bold text-white shadow-md hover:bg-marigold-dark"
            >
              Sign Up as a Parent
            </Link>
            <Link
              href="/login"
              className="rounded-full border-2 border-plum px-6 py-3 font-heading text-lg font-bold text-plum hover:bg-plum hover:text-white"
            >
              Log In
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
