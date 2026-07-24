import type { Subject } from "@/lib/types";

export type SubjectPageContent = {
  title: string;
  description: string;
};

// Content for each subject's "Learn More" page. Hindi's description is a
// placeholder until the founder provides the real write-up to replace it with.
export const SUBJECT_PAGES: Record<Subject, SubjectPageContent> = {
  hindi: {
    title: "Hindi",
    description: "From the beginning letters to writing and being able to read.",
  },
  marathi: {
    title: "Marathi",
    description: "From the beginning letters to writing and being able to read.",
  },
  math: {
    title: "Math",
    description: "K-12 classes, test prep.",
  },
};
