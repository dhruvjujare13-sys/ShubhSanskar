"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { letterCards } from "@/data/practiceContent";

export default function LetterFlipGame() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div>
      <p className="mb-3 text-sm text-slate">Tap a letter to see what it stands for!</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {letterCards.map((card, i) => {
          const isFlipped = flipped.has(i);
          return (
            <button
              key={card.letter}
              type="button"
              onClick={() => toggle(i)}
              className="[perspective:600px]"
              aria-label={`Letter ${card.letter}`}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-24 w-full [transform-style:preserve-3d]"
              >
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-marigold text-3xl font-heading font-bold text-white shadow-md [backface-visibility:hidden]"
                >
                  {card.letter}
                </div>
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-teal p-1 text-center text-white shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  <span className="text-2xl">{card.emoji}</span>
                  <span className="text-xs font-semibold">{card.meaning}</span>
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
