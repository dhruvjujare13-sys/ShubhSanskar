import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ClassroomIllustration from "@/components/ClassroomIllustration";
import { siteConfig } from "@/lib/siteConfig";

const SUBJECT_CARDS = [
  {
    title: "Hindi",
    slug: "hindi",
    color: "bg-marigold",
    blurb: "From the beginning letters to writing and being able to read.",
    emoji: "📖",
  },
  {
    title: "Marathi",
    slug: "marathi",
    color: "bg-teal",
    blurb: "From the beginning letters to writing and being able to read.",
    emoji: "✍️",
  },
  {
    title: "Math",
    slug: "math",
    color: "bg-sky",
    blurb: "K-12 classes, test prep.",
    emoji: "🔢",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-sunny via-sunny to-blush/20 px-4 py-16">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="font-heading text-4xl font-bold text-plum sm:text-5xl">
                A Bright Start to Lifelong Learning
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate lg:mx-0">{siteConfig.tagline}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
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
            </div>
            <ClassroomIllustration className="mx-auto w-full max-w-md" />
          </div>
        </section>

        {/* About */}
        <section className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="font-heading text-3xl text-plum mb-3">Meet {siteConfig.teacherName}</h2>
          <p className="text-slate">
            {siteConfig.teacherName} teaches Hindi and Marathi from the very basics, starting with letters and
            barakhadi, plus math, all online. Lessons welcome everyone, beginner or returning learner.
          </p>
        </section>

        {/* Subjects */}
        <section id="subjects" className="bg-teal/5 px-4 py-14">
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
                <Link
                  href={`/learn/${card.slug}`}
                  className="mt-4 inline-block rounded-full border-2 border-plum px-4 py-1.5 text-sm font-heading font-bold text-plum hover:bg-plum hover:text-white"
                >
                  Click to Learn More
                </Link>
              </div>
            ))}
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
