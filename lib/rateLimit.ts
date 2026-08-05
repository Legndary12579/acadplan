import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

/**
 * Gets the client's IP address from Vercel's forwarded headers.
 * Falls back to "unknown" if not present (e.g. local dev).
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list; the first is the client
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Checks whether the given identifier (usually an IP) has exceeded
 * `limit` requests to `route` within the last `windowMinutes`.
 * If allowed, records this request. Returns { allowed, remaining, retryAfterSeconds }.
 */
export async function checkRateLimit(
  identifier: string,
  route: string,
  limit: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds?: number }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("api_rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("route", route)
    .gte("created_at", windowStart);

  if (error) {
    // Fail open: if the rate-limit check itself breaks, don't block
    // legitimate users — just log it and let the request through.
    console.warn("[rateLimit] Check failed, failing open:", error.message);
    return { allowed: true, remaining: limit };
  }

  const used = count ?? 0;

  if (used >= limit) {
    // Find the oldest request in the window to calculate retry-after
    const { data: oldest } = await supabase
      .from("api_rate_limits")
      .select("created_at")
      .eq("identifier", identifier)
      .eq("route", route)
      .gte("created_at", windowStart)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    const retryAfterSeconds = oldest
      ? Math.ceil(
          (new Date(oldest.created_at).getTime() + windowMinutes * 60 * 1000 - Date.now()) / 1000
        )
      : windowMinutes * 60;

    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
  }

  // Record this request (fire-and-forget-ish, but await to catch errors)
  const { error: insertError } = await supabase
    .from("api_rate_limits")
    .insert({ identifier, route });

  if (insertError) {
    console.warn("[rateLimit] Failed to record request:", insertError.message);
  }

  return { allowed: true, remaining: limit - used - 1 };
}
