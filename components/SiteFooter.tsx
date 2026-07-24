import Link from "next/link";
import { siteConfig, whatsAppLink } from "@/lib/siteConfig";

export default function SiteFooter() {
  return (
    <footer id="contact" className="mt-auto border-t-4 border-marigold bg-plum text-sunny">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-xl font-bold text-marigold">{siteConfig.businessName}</p>
          <p className="mt-2 text-sm text-sunny/80">{siteConfig.tagline}</p>
        </div>
        <div>
          <p className="font-heading font-bold text-marigold">Get in touch</p>
          <p className="mt-2 text-sm">
            <a href={`tel:+${siteConfig.phoneWhatsApp}`} className="hover:text-marigold">
              {siteConfig.phoneDisplay}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a
              href={whatsAppLink(`Hi ${siteConfig.teacherName}! I'd love to learn more about tutoring.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-marigold"
            >
              Message on WhatsApp
            </a>
          </p>
          <p className="mt-1 text-sm text-sunny/70">{siteConfig.pricingNote}</p>
        </div>
        <div>
          <p className="font-heading font-bold text-marigold">Account</p>
          <p className="mt-2 text-sm">
            <Link href="/signup" className="hover:text-marigold">
              Parent Sign Up
            </Link>
          </p>
          <p className="mt-1 text-sm">
            <Link href="/login" className="hover:text-marigold">
              Parent / Teacher Login
            </Link>
          </p>
          <p className="mt-1 text-sm">
            <Link href="/student-login" className="hover:text-marigold">
              Student Login
            </Link>
          </p>
        </div>
      </div>
      <p className="border-t border-sunny/20 py-4 text-center text-xs text-sunny/60">
        © {new Date().getFullYear()} {siteConfig.businessName}
      </p>
    </footer>
  );
}
