export default function ClassroomIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 380"
      className={className}
      role="img"
      aria-label="A student learning at a laptop showing the ShubhSanskar website, in a cozy classroom corner"
    >
      {/* floor */}
      <rect x="0" y="330" width="480" height="50" fill="var(--color-marigold)" opacity="0.12" />

      {/* window */}
      <rect x="330" y="24" width="110" height="96" rx="10" fill="var(--color-sky)" opacity="0.25" />
      <rect x="330" y="24" width="110" height="96" rx="10" fill="none" stroke="var(--color-plum)" strokeWidth="3" />
      <line x1="385" y1="24" x2="385" y2="120" stroke="var(--color-plum)" strokeWidth="3" />
      <line x1="330" y1="72" x2="440" y2="72" stroke="var(--color-plum)" strokeWidth="3" />
      <circle cx="410" cy="50" r="12" fill="var(--color-marigold)" />
      <g stroke="var(--color-marigold)" strokeWidth="2" strokeLinecap="round">
        <line x1="410" y1="30" x2="410" y2="24" />
        <line x1="426" y1="34" x2="431" y2="30" />
        <line x1="430" y1="50" x2="437" y2="50" />
      </g>

      {/* bookshelf */}
      <rect x="24" y="40" width="90" height="70" rx="6" fill="var(--color-plum)" opacity="0.85" />
      <rect x="30" y="48" width="10" height="54" fill="var(--color-marigold)" />
      <rect x="42" y="48" width="10" height="54" fill="var(--color-teal)" />
      <rect x="54" y="48" width="10" height="54" fill="var(--color-blush)" />
      <rect x="66" y="48" width="10" height="54" fill="var(--color-sky)" />
      <rect x="78" y="48" width="10" height="54" fill="var(--color-grass)" />
      <rect x="90" y="48" width="16" height="54" fill="var(--color-sunny)" />

      {/* plant */}
      <rect x="36" y="300" width="34" height="30" rx="4" fill="var(--color-marigold)" />
      <path d="M53 300 C40 280 40 260 53 250 C66 260 66 280 53 300 Z" fill="var(--color-grass)" />
      <path d="M53 300 C46 285 46 270 53 260 C60 270 60 285 53 300 Z" fill="var(--color-teal)" />

      {/* desk */}
      <rect x="120" y="250" width="270" height="60" rx="8" fill="var(--color-plum)" />
      <rect x="132" y="310" width="14" height="34" fill="var(--color-plum)" opacity="0.8" />
      <rect x="352" y="310" width="14" height="34" fill="var(--color-plum)" opacity="0.8" />

      {/* laptop */}
      <rect x="205" y="252" width="120" height="8" rx="3" fill="var(--color-slate)" />
      <rect x="210" y="168" width="110" height="84" rx="8" fill="var(--color-slate)" />
      <rect x="216" y="174" width="98" height="72" rx="4" fill="var(--color-sunny)" />
      {/* mini site mockup on the laptop screen */}
      <rect x="216" y="174" width="98" height="14" fill="var(--color-marigold)" />
      <circle cx="223" cy="181" r="3" fill="var(--color-plum)" />
      <rect x="230" y="179" width="30" height="4" rx="2" fill="var(--color-plum)" />
      <rect x="228" y="198" width="60" height="6" rx="3" fill="var(--color-plum)" />
      <rect x="228" y="208" width="42" height="5" rx="2.5" fill="var(--color-slate)" opacity="0.6" />
      <rect x="228" y="226" width="34" height="10" rx="5" fill="var(--color-marigold)" />
      <rect x="266" y="226" width="30" height="10" rx="5" fill="var(--color-teal)" />

      {/* chair */}
      <rect x="380" y="200" width="10" height="110" rx="4" fill="var(--color-plum)" opacity="0.5" />
      <rect x="380" y="196" width="46" height="10" rx="4" fill="var(--color-plum)" opacity="0.5" />

      {/* student */}
      <rect x="386" y="230" width="42" height="60" rx="16" fill="var(--color-teal)" />
      <circle cx="407" cy="196" r="26" fill="#e8b98a" />
      <path d="M381 196 C381 168 433 168 433 196 C433 182 421 172 407 172 C393 172 381 182 381 196 Z" fill="var(--color-plum)" />
      <circle cx="399" cy="198" r="2.5" fill="var(--color-plum)" />
      <circle cx="415" cy="198" r="2.5" fill="var(--color-plum)" />
      <path d="M400 207 Q407 212 414 207" stroke="var(--color-plum)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path
        d="M395 250 Q325 235 320 205"
        stroke="#e8b98a"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
