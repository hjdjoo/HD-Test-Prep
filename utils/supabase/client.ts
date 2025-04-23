import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLIC_KEY!
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!

const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
  auth: {
    detectSessionInUrl: true,
  }
});

const createSupabase = () => {
  return client
};

export default createSupabase;

