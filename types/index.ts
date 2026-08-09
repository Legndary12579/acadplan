// ── Student Profile ────────────────────────────────────────
export interface StudentProfile {
  name: string;
  email: string;
  gradeLevel: GradeLevel;
  gpaUnweighted: string;
  gpaWeighted?: string;
  intendedMajor: string;
  collegeType: CollegeType;
  extracurriculars: string;
  careerGoals: string;
  challenges: string;
  zipCode: string;
  satScore?: string;
  satSuperscore?: string;
  actScore?: string;
}

// ── Enums / Union Types ────────────────────────────────────
export type GradeLevel =
  | "9th"
  | "10th"
  | "11th"
  | "12th"
  | "";

export type CollegeType =
  | "ivy_league"
  | "top_50"
  | "state_school"
  | "community_college"
  | "undecided"
  | "";

// ── API ────────────────────────────────────────────────────
export interface PlanRequest {
  student: StudentProfile;
  userId?: string;
}

export interface PlanResponse {
  plan: string;
  timestamp: string;
  studentName: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

// ── Course Planner ─────────────────────────────────────────
export interface Course {
  id: string;
  name: string;
  subject: CourseSubject;
  level: CourseLevel;
  credits: number;
  year: GradeLevel;
  grade?: string;
}

export type CourseSubject =
  | "Math"
  | "Science"
  | "English"
  | "History"
  | "Language"
  | "Arts"
  | "Elective"
  | "AP"
  | "IB";

export type CourseLevel = "Standard" | "Honors" | "AP" | "IB" | "Dual Enrollment";

// ── Supabase DB Row Types ──────────────────────────────────
export interface DbStudentPlan {
  id: string;
  created_at: string;
  student_name: string;
  student_email: string;
  grade_level: GradeLevel;
  gpa: string;
  gpa_weighted: string | null;
  intended_major: string;
  college_type: CollegeType;
  extracurriculars: string;
  career_goals: string;
  challenges: string;
  sat_score: string | null;
  sat_superscore: string | null;
  act_score: string | null;
  location: string | null;
  ai_plan: string;
  user_id: string | null;
}

// ── UI State ───────────────────────────────────────────────
export type FormStep = "form" | "loading" | "result";

export interface FormState {
  step: FormStep;
  plan: string | null;
  error: string | null;
}

// ── Auth ───────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

// ── Nav ────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

// ── Feature Cards (Home) ───────────────────────────────────
export interface Feature {
  icon: string;
  title: string;
  description: string;
  accent: "indigo" | "sky" | "sage" | "amber";
}