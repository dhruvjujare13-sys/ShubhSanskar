import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex flex-col items-center gap-0.5 leading-none ${className}`}>
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        {/* sun */}
        <circle cx="20" cy="13" r="6" fill="var(--color-marigold)" />
        <g stroke="var(--color-marigold)" strokeWidth="2" strokeLinecap="round">
          <line x1="20" y1="6" x2="20" y2="2" />
          <line x1="14.5" y1="8.5" x2="11" y2="5" />
          <line x1="25.5" y1="8.5" x2="29" y2="5" />
          <line x1="11.5" y1="13" x2="7" y2="13" />
          <line x1="28.5" y1="13" x2="33" y2="13" />
        </g>
        {/* open book */}
        <path
          d="M20 25 C14 22 8 22 5 24 L5 33 C8 31 14 31 20 34 Z"
          fill="var(--color-plum)"
        />
        <path
          d="M20 25 C26 22 32 22 35 24 L35 33 C32 31 26 31 20 34 Z"
          fill="var(--color-plum)"
        />
      </svg>
      <span className="font-logo text-lg font-semibold tracking-tight text-plum">
        {siteConfig.businessName}
      </span>
    </Link>
  );
}
