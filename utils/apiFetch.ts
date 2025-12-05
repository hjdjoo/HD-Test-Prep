import { supabase } from "@/utils/supabase/client";

// const VITE_URL = import.meta.env.VITE_URL!

export async function apiFetch(url: string, options: RequestInit = {}, retry = true) {

  const { data: { session }, error } = await supabase.auth.getSession();

  console.log(session);

  if (error) {
    console.error(error)
    throw error;
  }

  const headers = new Headers(options.headers || {});
  if (session?.refresh_token && session.access_token) {
    headers.set("Authorization", `Bearer ${session?.access_token}`);
    cookieStore.set("refresh_token", session?.refresh_token)
    // headers.set("Origin", VITE_URL);
    // headers.set()
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // cookieStore.get()
  // console.log(res);

  if (res.status === 401 && retry) {
    // const refreshed = await refreshSession();
    console.log("retrying fetch...");
    return apiFetch(url, { ...options, ...headers }, false);
  }

  return res;

}