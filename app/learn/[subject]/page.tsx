import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SUBJECT_PAGES } from "@/data/subjectPages";
import type { Subject } from "@/lib/types";

export function generateStaticParams() {
  return Object.keys(SUBJECT_PAGES).map((subject) => ({ subject }));
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const content = SUBJECT_PAGES[subject as Subject];
  if (!content) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-heading text-4xl font-bold text-plum">{content.title}</h1>
          <p className="mt-6 text-lg text-slate">{content.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-marigold px-6 py-3 font-heading text-lg font-bold text-white shadow-md hover:bg-marigold-dark"
            >
              Sign Up as a Parent
            </Link>
            <Link
              href="/#subjects"
              className="rounded-full border-2 border-plum px-6 py-3 font-heading text-lg font-bold text-plum hover:bg-plum hover:text-white"
            >
              Back to All Subjects
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
