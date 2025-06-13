import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLIC_KEY!
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!
console.log(SUPABASE_URL);

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  }
});

; (globalThis as any).__SUPABASE__ = supabase;