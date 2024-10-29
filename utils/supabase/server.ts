import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { Response, Request } from "express";
import { Database } from "#root/database.types";


const SUPABASE_PUBLIC_KEY = process.env.VITE_SUPABASE_PUBLIC_KEY!

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!

const createClient = (req: Request, res: Response) => {

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.cookie ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
        )
      },
    },
  })
};

export default createClient;