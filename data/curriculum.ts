import type { Subject } from "@/lib/types";

// The actual step-by-step path for each subject. Shown to parents/students as
// "what they'll be learning," and used by the teacher to log which stage a
// student is on instead of typing free-text topics.
export const CURRICULUM: Record<Subject, string[]> = {
  hindi: [
    "Letters: स्वर (vowels)",
    "Letters: व्यंजन (consonants)",
    "Barakhadi",
    "Simple words",
    "Reading short sentences",
    "Writing practice",
  ],
  marathi: [
    "Letters: स्वर (vowels)",
    "Letters: व्यंजन (consonants)",
    "Barakhadi",
    "Simple words",
    "Reading short sentences",
    "Writing practice",
  ],
  math: [
    "Elementary math (counting, addition, subtraction)",
    "Multiplication & division",
    "Fractions & decimals",
    "Pre-algebra",
    "Algebra 1",
    "Algebra 2",
    "Geometry",
    "Trigonometry",
    "Statistics & probability",
    "Precalculus & calculus",
    "Test prep (SAT/ACT, etc.)",
    "Help with school-given homework",
  ],
};

// Math spans such a wide age/level range that every family needs to pick
// which of the above topics actually apply to their child, rather than
// showing the full list (which would otherwise start everyone at
// "elementary math" regardless of age). Hindi/Marathi don't need this since
// their letters -> barakhadi -> reading path is the same starting point for
// every beginner.
export const MATH_TOPIC_OPTIONS = CURRICULUM.math;
