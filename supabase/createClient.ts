import { createClient as createBrowserClient } from "@supabase/supabase-js";

const SUPABASE_PUBLIC_KEY=process.env.VITE_SUPABASE_PUBLIC_KEY!
const SUPABASE_URL=process.env.VITE_SUPABASE_URL!

export function createClient () {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
} 

