import Logo from "@/components/Logo";
import { signOut } from "@/lib/actions/auth";

export default function DashboardHeader({
  roleLabel,
  personName,
}: {
  roleLabel: string;
  personName: string;
}) {
  return (
    <header className="border-b-4 border-marigold bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-semibold text-slate sm:block">
            {roleLabel}: <span className="text-plum">{personName}</span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border-2 border-plum px-4 py-2 text-sm font-heading font-bold text-plum hover:bg-plum hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
