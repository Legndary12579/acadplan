import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { DbStudentPlan, StudentProfile } from "@/types";

// ── Client ─────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Builds a Supabase client scoped to a specific user's access token.
 * Used in API routes (server-side) so that RLS policies relying on
 * auth.uid() work correctly — the default `supabase` client above has
 * no user session attached when called from a server route, so any
 * insert requiring auth.uid() = user_id would otherwise be rejected.
 */
export function createUserScopedClient(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

/**
 * Verifies an access token and returns the real, verified user ID.
 * Never trust a userId sent in a request body alone — always verify
 * it against the token, since the body value could be spoofed.
 */
export async function verifyAccessToken(
  accessToken: string,
  client: SupabaseClient = supabase
): Promise<string | null> {
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user.id;
}

// ── Auth ───────────────────────────────────────────────────
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser(): Promise<{ id: string; email?: string } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email };
}

// ── Save a student plan ────────────────────────────────────
export async function saveStudentPlan(
  student: StudentProfile,
  aiPlan: string,
  userId?: string,
  client: SupabaseClient = supabase
): Promise<{ data: DbStudentPlan | null; error: string | null }> {
  const { data, error } = await client
    .from("student_plans")
    .insert([
      {
        student_name: student.name,
        student_email: student.email,
        grade_level: student.gradeLevel,
        gpa: student.gpa,
        intended_major: student.intendedMajor,
        college_type: student.collegeType,
        extracurriculars: student.extracurriculars,
        career_goals: student.careerGoals,
        challenges: student.challenges,
        sat_score: student.satScore || null,
        act_score: student.actScore || null,
        location: student.location || null,
        ai_plan: aiPlan,
        user_id: userId || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[Supabase] saveStudentPlan error:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data as DbStudentPlan, error: null };
}

// ── Fetch plans for logged-in user ─────────────────────────
export async function getMyPlans(): Promise<{ data: DbStudentPlan[]; error: string | null }> {
  const { data, error } = await supabase
    .from("student_plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Supabase] getMyPlans error:", error.message);
    return { data: [], error: error.message };
  }

  return { data: (data as DbStudentPlan[]) ?? [], error: null };
}

// ── Fetch single plan by ID ────────────────────────────────
export async function getPlanById(
  id: string
): Promise<{ data: DbStudentPlan | null; error: string | null }> {
  const { data, error } = await supabase
    .from("student_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[Supabase] getPlanById error:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data as DbStudentPlan, error: null };
}