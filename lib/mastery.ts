import type { ProgressEntry } from "@/lib/types";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export function getRecentlyMastered(progress: ProgressEntry[], now = Date.now()) {
  const cutoff = now - THREE_DAYS_MS;
  return progress
    .filter((p) => p.status === "mastered" && new Date(p.updated_at).getTime() > cutoff)
    .map((p) => ({ id: p.id, topic: p.topic }));
}
