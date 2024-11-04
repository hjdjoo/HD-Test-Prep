import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { Response, Request } from "express";
import { Database } from "@/database.types";


const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!

interface Context {
  req: Request,
  res: Response
}

const createServiceClient = (context: Context) => {

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.req.headers.cookie ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          context.res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
        )
      },
    },
  })
};

export default createServiceClient;