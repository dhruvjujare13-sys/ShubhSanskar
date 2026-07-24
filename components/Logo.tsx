import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <circle cx="17" cy="17" r="16" fill="var(--color-marigold)" />
        <path
          d="M10 21c1.5-4 5-6 7-6s5.5 2 7 6"
          stroke="var(--color-plum)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="13" cy="14" r="1.6" fill="var(--color-plum)" />
        <circle cx="21" cy="14" r="1.6" fill="var(--color-plum)" />
      </svg>
      <span className="font-heading text-xl font-bold text-plum">{siteConfig.businessName}</span>
    </Link>
  );
}
