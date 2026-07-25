import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SUBJECT_PAGES } from "@/data/subjectPages";

const COLUMN_STYLES = {
  hindi: { border: "border-marigold/30", badge: "bg-marigold" },
  marathi: { border: "border-teal/30", badge: "bg-teal" },
  math: { border: "border-sky/30", badge: "bg-sky" },
} as const;

export const metadata = {
  title: "Available Classes | ShubhSanskar",
};

export default function AvailableClassesPage() {
  const subjects = Object.entries(SUBJECT_PAGES) as [keyof typeof SUBJECT_PAGES, (typeof SUBJECT_PAGES)[keyof typeof SUBJECT_PAGES]][];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="px-4 py-14 text-center">
          <h1 className="font-heading text-4xl font-bold text-plum">Available Classes</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate">
            Here&apos;s exactly what each subject covers, from the very first lesson onward.
          </p>
        </section>

        <section className="px-4 pb-16">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {subjects.map(([slug, subject]) => (
              <div
                key={slug}
                id={slug}
                className={`scroll-mt-24 rounded-3xl border-2 bg-white p-6 shadow-lg ${COLUMN_STYLES[slug].border}`}
              >
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-heading font-bold text-white ${COLUMN_STYLES[slug].badge}`}
                >
                  {subject.title}
                </span>
                <p className="mt-3 text-sm text-slate">{subject.summary}</p>

                <div className="mt-5 space-y-5">
                  {subject.sections.map((section) => (
                    <div key={section.heading}>
                      <h3 className="font-heading font-bold text-plum">{section.heading}</h3>
                      <ul className="mt-1 space-y-1 text-sm text-slate">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-marigold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {subject.credit && (
                  <p className="mt-5 rounded-xl bg-sunny/60 px-3 py-2 text-xs text-slate">{subject.credit}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/signup"
              className="rounded-full bg-marigold px-6 py-3 font-heading text-lg font-bold text-white shadow-md hover:bg-marigold-dark"
            >
              Sign Up as a Parent
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
