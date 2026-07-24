import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-marigold bg-sunny/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-6 font-semibold text-plum md:flex">
          <Link href="/#subjects" className="hover:text-teal">
            What We Teach
          </Link>
          <Link href="/#contact" className="hover:text-teal">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/student-login"
            className="rounded-full bg-teal px-4 py-2 text-sm font-heading font-bold text-white shadow hover:bg-teal-dark"
          >
            Student Login
          </Link>
          <Link
            href="/login"
            className="hidden rounded-full border-2 border-plum px-4 py-2 text-sm font-heading font-bold text-plum hover:bg-plum hover:text-white sm:block"
          >
            Parent / Teacher Login
          </Link>
        </div>
      </div>
    </header>
  );
}
