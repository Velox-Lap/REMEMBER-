import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const authClient = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const EXACT_ALLOWED_HOSTS = new Set([
  "project-29-12.vercel.app",
  "project-29-12-velox19.vercel.app",
  "project-29-12-git-main-velox19.vercel.app",
]);

function allowedOrigin(origin: string | null): boolean {
  if (!origin || origin === "http://localhost:3000") return true;
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:") return false;
    if (EXACT_ALLOWED_HOSTS.has(url.hostname)) return true;
    // Vercel preview deployment URLs for this project use the team suffix.
    return url.hostname.startsWith("project-29-12-") &&
      url.hostname.endsWith("-velox19.vercel.app");
  } catch {
    return false;
  }
}

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ? (allowedOrigin(origin) ? origin : "null") : "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function fingerprint(req: Request): Promise<string> {
  const forwarded = req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  const bytes = new TextEncoder().encode(`${forwarded}:${userAgent}:${SERVICE_ROLE_KEY}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return null;

  const { data, error } = await authClient.auth.getUser(tokenMatch[1]);
  if (error || !data.user || !data.user.email_confirmed_at) return null;
  return { user: data.user, token: tokenMatch[1] };
}

async function getAdminUser(req: Request) {
  const authenticated = await getAuthenticatedUser(req);
  if (!authenticated || authenticated.user.app_metadata?.project_2912_admin !== true) return null;
  return authenticated;
}

async function verifyPin(pin: string, clientFingerprint: string): Promise<boolean> {
  const { data, error } = await adminClient.rpc("project_2912_verify_admin_pin", {
    input_pin: pin,
    input_client_fingerprint: clientFingerprint,
  });
  if (error) throw error;
  return data === true;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (!allowedOrigin(origin)) return json({ error: "origin_not_allowed" }, 403, origin);
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ANON_KEY) return json({ error: "server_configuration_error" }, 500, origin);

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > 4096) return json({ error: "payload_too_large" }, 413, origin);

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 4096) return json({ error: "payload_too_large" }, 413, origin);
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400, origin);
  }

  const clientFingerprint = await fingerprint(req);
  const action = body.action;

  if (action === "verify_memory") {
    const questionKey = typeof body.questionKey === "string" ? body.questionKey : "";
    const answer = typeof body.answer === "string" ? body.answer : "";
    if (answer.length > 40 || !["first_meeting", "first_trip", "first_24_hours"].includes(questionKey)) {
      return json({ verified: false }, 200, origin);
    }
    const { data, error } = await adminClient.rpc("project_2912_verify_memory_answer", {
      input_question_key: questionKey,
      input_answer: answer,
      input_client_fingerprint: clientFingerprint,
    });
    if (error) {
      console.error("Memory verification failed:", error.code ?? "database_error");
      return json({ error: "verification_unavailable" }, 503, origin);
    }
    return json({ verified: data === true }, 200, origin);
  }

  if (action === "activate_admin") {
    const authenticated = await getAuthenticatedUser(req);
    if (!authenticated) return json({ error: "confirmed_email_required" }, 401, origin);
    const email = authenticated.user.email ?? "";
    const { data: allowed, error: allowlistError } = await adminClient.rpc("project_2912_is_admin_email", {
      input_email: email,
    });
    if (allowlistError) {
      console.error("Admin allowlist lookup failed:", allowlistError.code ?? "database_error");
      return json({ error: "activation_unavailable" }, 503, origin);
    }
    if (allowed !== true) return json({ error: "email_not_allowlisted" }, 403, origin);

    const { data, error } = await adminClient.auth.admin.updateUserById(authenticated.user.id, {
      app_metadata: {
        ...authenticated.user.app_metadata,
        project_2912_admin: true,
        project_2912_pin_unlocked_until: null,
      },
    });
    if (error || !data.user) {
      console.error("Admin activation failed:", error?.message ?? "auth_error");
      return json({ error: "activation_unavailable" }, 503, origin);
    }
    return json({ activated: true }, 200, origin);
  }

  if (action === "rotate_admin_pin") {
    const admin = await getAdminUser(req);
    if (!admin) return json({ error: "admin_access_required" }, 403, origin);

    const currentPin = typeof body.currentPin === "string" ? body.currentPin : "";
    const newPin = typeof body.newPin === "string" ? body.newPin : "";
    if (!/^[0-9]{4,12}$/.test(currentPin) || !/^[0-9]{6,12}$/.test(newPin)) {
      return json({ rotated: false, error: "invalid_pin_format" }, 400, origin);
    }
    if (currentPin === newPin) {
      return json({ rotated: false, error: "new_pin_must_differ" }, 400, origin);
    }

    let currentPinVerified = false;
    try {
      currentPinVerified = await verifyPin(currentPin, clientFingerprint);
    } catch (error) {
      console.error("Admin PIN rotation verification failed:", error instanceof Error ? error.name : "database_error");
      return json({ rotated: false, error: "verification_unavailable" }, 503, origin);
    }
    if (!currentPinVerified) return json({ rotated: false, error: "current_pin_invalid" }, 403, origin);

    // Revoke the existing elevated write window before changing the stored credential.
    const { data: revoked, error: revokeError } = await adminClient.auth.admin.updateUserById(admin.user.id, {
      app_metadata: {
        ...admin.user.app_metadata,
        project_2912_admin: true,
        project_2912_pin_unlocked_until: null,
      },
    });
    if (revokeError || !revoked.user) {
      console.error("Admin PIN rotation could not revoke the active window:", revokeError?.name ?? "auth_error");
      return json({ rotated: false, error: "session_revoke_failed" }, 503, origin);
    }

    const { data: rotated, error: rotationError } = await adminClient.rpc("project_2912_rotate_admin_pin", {
      input_new_pin: newPin,
    });
    if (rotationError || rotated !== true) {
      console.error("Admin PIN rotation failed:", rotationError?.code ?? "rotation_rejected");
      return json({ rotated: false, error: "rotation_failed_reauthenticate" }, 503, origin);
    }

    return json({ rotated: true }, 200, origin);
  }

  if (action === "verify_admin_pin" || action === "update_memory_answer") {
    const admin = await getAdminUser(req);
    if (!admin) return json({ error: "admin_access_required" }, 403, origin);
    const pin = typeof body.pin === "string" ? body.pin : "";

    let pinVerified = false;
    try {
      pinVerified = await verifyPin(pin, clientFingerprint);
    } catch (error) {
      console.error("Admin PIN verification failed:", error instanceof Error ? error.message : "database_error");
      return json({ error: "verification_unavailable" }, 503, origin);
    }
    if (!pinVerified) return json({ verified: false }, 200, origin);

    if (action === "verify_admin_pin") {
      const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;
      const { data, error } = await adminClient.auth.admin.updateUserById(admin.user.id, {
        app_metadata: {
          ...admin.user.app_metadata,
          project_2912_admin: true,
          project_2912_pin_unlocked_until: expiresAt,
        },
      });
      if (error || !data.user) {
        console.error("PIN session update failed:", error?.message ?? "auth_error");
        return json({ error: "session_update_failed" }, 503, origin);
      }
      return json({ verified: true, expiresAt }, 200, origin);
    }

    const questionKey = typeof body.questionKey === "string" ? body.questionKey : "";
    const answer = typeof body.answer === "string" ? body.answer : "";
    if (!["first_meeting", "first_trip", "first_24_hours"].includes(questionKey) || answer.length > 40) {
      return json({ updated: false, error: "invalid_checkpoint" }, 400, origin);
    }

    const { data, error } = await adminClient.rpc("project_2912_update_memory_answer", {
      input_question_key: questionKey,
      input_answer: answer,
    });
    if (error) {
      console.error("Checkpoint update failed:", error.code ?? "database_error");
      return json({ updated: false, error: "update_unavailable" }, 503, origin);
    }
    return json({ updated: data === true }, 200, origin);
  }

  return json({ error: "unknown_action" }, 400, origin);
});
