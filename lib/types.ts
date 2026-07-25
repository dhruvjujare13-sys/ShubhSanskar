export type Subject = "hindi" | "marathi" | "math";
export type ProgressStatus = "not_started" | "in_progress" | "mastered";

export const SUBJECTS: { value: Subject; label: string }[] = [
  { value: "hindi", label: "Hindi" },
  { value: "marathi", label: "Marathi" },
  { value: "math", label: "Math" },
];

export const STATUSES: { value: ProgressStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "mastered", label: "Mastered" },
];

export type Profile = {
  id: string;
  role: "teacher" | "parent";
  full_name: string;
  phone: string;
};

export type Student = {
  id: string;
  parent_id: string;
  full_name: string;
  username: string;
  subjects: Subject[];
  age: number | null;
  grade: string;
  notes: string;
  meet_link: string;
};

export type ProgressEntry = {
  id: string;
  student_id: string;
  subject: Subject;
  topic: string;
  status: ProgressStatus;
  notes: string;
  updated_at: string;
};

export type Assignment = {
  id: string;
  student_id: string;
  subject: Subject;
  title: string;
  description: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
};

export type WhiteboardStroke = {
  id: string;
  student_id: string;
  author: "teacher" | "student";
  points: { x: number; y: number }[];
  color: string;
  width: number;
  created_at: string;
};
