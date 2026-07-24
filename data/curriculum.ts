import type { Subject } from "@/lib/types";

// The actual step-by-step path for each subject. Shown to parents/students as
// "what they'll be learning," and used by the teacher to log which stage a
// student is on instead of typing free-text topics.
export const CURRICULUM: Record<Subject, string[]> = {
  hindi: [
    "Letters — स्वर (vowels)",
    "Letters — व्यंजन (consonants)",
    "Barakhadi",
    "Simple words",
    "Reading short sentences",
    "Writing practice",
  ],
  marathi: [
    "Letters — स्वर (vowels)",
    "Letters — व्यंजन (consonants)",
    "Barakhadi",
    "Simple words",
    "Reading short sentences",
    "Writing practice",
  ],
  math: [
    "Counting 1-20",
    "Number recognition",
    "Simple addition",
    "Simple subtraction",
    "Shapes & patterns",
    "Word problems",
  ],
};
