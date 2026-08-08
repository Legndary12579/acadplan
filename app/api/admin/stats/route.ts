import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This route uses the Supabase SERVICE ROLE key, which bypasses RLS —
// necessary because admin stats need to see data across ALL users, not
// just one person's own rows. This key must NEVER be exposed to the
// client; it's only ever used here, server-side.
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it in Vercel → Settings → Environment Variables (get it from Supabase → Settings → API → service_role/secret key)."
    );
  }
  return createClient(url, serviceKey);
}

export async function GET(request: NextRequest) {
  const providedSecret = request.headers.get("x-admin-secret");
  const expectedSecret = process.env.ADMIN_SECRET_KEY;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const admin = getAdminClient();

    // Total plans generated (includes anonymous, since student_plans
    // has a row per generated plan regardless of login)
    const { count: totalPlans } = await admin
      .from("student_plans")
      .select("*", { count: "exact", head: true });

    // Total registered accounts
    const { data: usersData } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const totalUsers = usersData?.users.length ?? 0;

    // Plans generated per day, last 14 days
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentPlans } = await admin
      .from("student_plans")
      .select("created_at")
      .gte("created_at", fourteenDaysAgo)
      .order("created_at", { ascending: true });

    const plansByDay: Record<string, number> = {};
    (recentPlans ?? []).forEach((row) => {
      const day = new Date(row.created_at).toISOString().slice(0, 10);
      plansByDay[day] = (plansByDay[day] ?? 0) + 1;
    });

    // Request volume by route (from rate limiter table) — last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: rateLimitRows } = await admin
      .from("api_rate_limits")
      .select("route")
      .gte("created_at", sevenDaysAgo);

    const requestsByRoute: Record<string, number> = {};
    (rateLimitRows ?? []).forEach((row) => {
      requestsByRoute[row.route] = (requestsByRoute[row.route] ?? 0) + 1;
    });

    // 10 most recent plans (name, major, date — not the full plan text)
    const { data: recentList } = await admin
      .from("student_plans")
      .select("student_name, intended_major, grade_level, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      totalPlans: totalPlans ?? 0,
      totalUsers,
      plansByDay,
      requestsByRoute,
      recentPlans: recentList ?? [],
    });
  } catch (err: unknown) {
    console.error("[API /admin/stats] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
