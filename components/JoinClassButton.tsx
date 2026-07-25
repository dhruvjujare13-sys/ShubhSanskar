export default function JoinClassButton({ meetLink }: { meetLink: string }) {
  if (!meetLink) return null;

  return (
    <a
      href={meetLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-grass px-5 py-2.5 font-heading font-bold text-white shadow hover:opacity-90"
    >
      🎥 Join Class
    </a>
  );
}
