"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONFETTI_EMOJI = ["🎉", "⭐", "🎊", "✨"];

export default function MasteryCelebration({
  recentlyMastered,
}: {
  recentlyMastered: { id: string; topic: string }[];
}) {
  const [toCelebrate, setToCelebrate] = useState<{ id: string; topic: string }[]>([]);

  useEffect(() => {
    const seenKey = "bbt_seen_mastery";
    const seen: string[] = JSON.parse(localStorage.getItem(seenKey) ?? "[]");
    const fresh = recentlyMastered.filter((m) => !seen.includes(m.id));
    if (fresh.length > 0) {
      // Synchronizing with localStorage (an external system) on mount, not deriving state from props.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToCelebrate(fresh);
      localStorage.setItem(seenKey, JSON.stringify([...seen, ...fresh.map((f) => f.id)]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {toCelebrate.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-plum/60 px-4"
          onClick={() => setToCelebrate([])}
        >
          <motion.div
            initial={{ scale: 0.7, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            className="relative max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute text-2xl"
                style={{ left: `${(i * 37) % 100}%`, top: -20 }}
                animate={{ y: 260, rotate: 360, opacity: [1, 1, 0] }}
                transition={{ duration: 1.6 + (i % 5) * 0.2, repeat: Infinity, delay: i * 0.08 }}
              >
                {CONFETTI_EMOJI[i % CONFETTI_EMOJI.length]}
              </motion.span>
            ))}
            <p className="text-5xl">🏆</p>
            <h2 className="mt-2 font-heading text-2xl text-plum">You mastered it!</h2>
            <p className="mt-1 text-slate">
              {toCelebrate.map((m) => m.topic).join(", ")} — amazing work!
            </p>
            <button
              type="button"
              onClick={() => setToCelebrate([])}
              className="mt-4 rounded-full bg-marigold px-6 py-2 font-heading font-bold text-white"
            >
              Yay!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
