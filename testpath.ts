import "module-alias/register"
import "tsconfig-paths/register"
import createSupabase from "@/utils/supabase/server";

console.log("Path import successful", createSupabase);