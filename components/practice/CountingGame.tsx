"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { countingQuestions } from "@/data/practiceContent";

export default function CountingGame() {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);

  const question = countingQuestions[index % countingQuestions.length];

  function answer(choice: number) {
    if (feedback) return;
    if (choice === question.count) {
      setFeedback("correct");
      setScore((s) => s + 1);
      setTimeout(() => {
        setFeedback(null);
        setIndex((i) => i + 1);
      }, 900);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 700);
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm text-slate">How many do you see? Tap the right number!</p>
      <div className="rounded-2xl bg-white/70 p-4">
        <div className="mb-4 flex flex-wrap justify-center gap-2 text-4xl">
          {Array.from({ length: question.count }).map((_, i) => (
            <span key={i}>{question.emoji}</span>
          ))}
        </div>
        <div className="flex justify-center gap-3">
          {question.options.map((opt) => (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.9 }}
              onClick={() => answer(opt)}
              className="h-14 w-14 rounded-2xl bg-sky font-heading text-2xl font-bold text-white shadow-md hover:bg-sky/80"
            >
              {opt}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {feedback && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-3 text-center font-heading font-bold ${
                feedback === "correct" ? "text-grass" : "text-blush"
              }`}
            >
              {feedback === "correct" ? "🎉 Yes! Great job!" : "Not quite, try again!"}
            </motion.p>
          )}
        </AnimatePresence>
        <p className="mt-3 text-center text-xs text-slate">Score: {score}</p>
      </div>
    </div>
  );
}
