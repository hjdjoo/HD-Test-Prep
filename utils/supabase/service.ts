import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";


const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!

const createServiceClient = () => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY)
};

export default createServiceClient;