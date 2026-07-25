export type SubjectCurriculum = {
  title: string;
  summary: string;
  sections: { heading: string; items: string[] }[];
  credit?: string;
};

// Hindi & Marathi topic lists are adapted from a Grade 1 Marathi language
// revision workbook the founder shared (letters -> barakhadi -> words ->
// sentences -> reading, the same core progression used in both languages
// since they share the Devanagari script). Marathi keeps the original
// terminology; Hindi renames a few Marathi-specific terms to their Hindi
// equivalents but follows the same sequence.
export const SUBJECT_PAGES: Record<"hindi" | "marathi" | "math", SubjectCurriculum> = {
  hindi: {
    title: "Hindi",
    summary: "From the beginning letters to writing and being able to read.",
    sections: [
      {
        heading: "Letters",
        items: [
          "Recognizing all letters, स्वर to ज्ञ (vowels through the full consonant set)",
          "Vowels and consonants (स्वर, व्यंजन)",
          "Coloring and tracing letters",
        ],
      },
      {
        heading: "Barakhadi",
        items: ["Hindi barakhadi (बाराखडी)", "Chaudakhadi practice drills"],
      },
      {
        heading: "Words",
        items: [
          "Picture words (चित्र शब्द)",
          "Compound and joined words",
          "Group words",
          "Words with special matras/diacritics",
        ],
      },
      {
        heading: "Reading & Writing",
        items: [
          "Picture sentence reading",
          "Sentence reading",
          "Reading passages",
          "Read and trace practice",
          "Telling a story from pictures",
        ],
      },
    ],
  },
  marathi: {
    title: "Marathi",
    summary: "From the beginning letters to writing and being able to read.",
    sections: [
      {
        heading: "Letters (अक्षर ओळख)",
        items: [
          "अ ते ज्ञ ओळख: recognizing all letters, vowels through the full consonant set",
          "Marathi स्वर, व्यंजन: vowels and consonants",
          "अक्षरे रंगवा: coloring the letters",
        ],
      },
      {
        heading: "Barakhadi (बाराखडी)",
        items: ["मराठी बाराखडी: Marathi barakhadi", "चौदाखडी गिरवा: chaudakhadi practice"],
      },
      {
        heading: "Words (शब्द)",
        items: [
          "चित्र शब्द: picture words",
          "या जोडून येणारे जोडशब्द: compound/joined words",
          "समूहदर्शक शब्द: group words",
          "रफारयुक्त शब्द: words with special diacritics",
          "शब्द डोंगर: word building",
        ],
      },
      {
        heading: "Reading & Writing (वाचन)",
        items: [
          "चित्र वाक्य वाचन: picture sentence reading",
          "वाक्य वाचन: sentence reading",
          "चला वाचूया / वाचन उतारे: reading passages",
          "वाचा व गिरवा: read and trace practice",
          "चित्रावरून गोष्ट: telling a story from pictures",
        ],
      },
    ],
  },
  math: {
    title: "Math",
    summary: "K-12 classes, test prep.",
    sections: [
      {
        heading: "Early Math",
        items: ["Counting & numbers", "Shapes & patterns", "Addition & subtraction basics"],
      },
      {
        heading: "Arithmetic",
        items: ["Multiplication & division", "Fractions & decimals", "Ratios & percentages"],
      },
      {
        heading: "Algebra",
        items: ["Pre-algebra", "Algebra 1", "Algebra 2"],
      },
      {
        heading: "Geometry & Beyond",
        items: ["Geometry", "Trigonometry", "Statistics & probability", "Precalculus & calculus"],
      },
      {
        heading: "Test Prep",
        items: ["Grade-level review", "Standardized test preparation"],
      },
    ],
    credit:
      "We're proud users of Khan Academy's free resources as part of our math curriculum. Credit to Khan Academy for these excellent, free materials.",
  },
};
