import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""; const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Export as supabase for backward compatibility
export const supabase = supabaseClient;