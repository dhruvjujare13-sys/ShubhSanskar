// Central place for placeholder business details.
// Swap these once real values are decided — nothing else needs to change.

export const siteConfig = {
  businessName: "ShubhSanskar",
  tagline: "Friendly online tutoring for curious kids, one lesson at a time.",
  teacherName: "Shubhada Madhekar",
  phoneDisplay: "+1 (407) 234-8117",
  phoneWhatsApp: "14072348117", // digits only, for wa.me links
  pricingNote: "Contact us for current pricing.",
  contactEmail: "", // not set yet
};

export function whatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.phoneWhatsApp}?text=${encodeURIComponent(message)}`;
}
