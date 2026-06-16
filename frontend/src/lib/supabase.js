import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const isConfigured =
  supabaseUrl &&
  supabaseUrl.startsWith("https://") &&
  supabaseKey &&
  supabaseKey.length > 10;

if (!isConfigured) {
  if (typeof window === "undefined") {
    // Server-side: only warn once
    console.warn(
      "[HustleHub] Supabase is not fully configured. Auth and database calls will be skipped. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local"
    );
  }
}

// Always create a client — even with empty strings it won't throw
// because we guard every call site with isConfigured checks.
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDAwMDAwMH0.placeholder"
    );

export const isSupabaseConfigured = isConfigured;
export default supabase;
