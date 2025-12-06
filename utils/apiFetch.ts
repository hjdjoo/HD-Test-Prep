import { supabase } from "@/utils/supabase/client";

// const VITE_URL = import.meta.env.VITE_URL!

export async function apiFetch(url: string, options: RequestInit = {}, retry = true) {

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error)
    throw error;
  }

  const headers = new Headers(options.headers || {});

  if (session && session.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`)
  }

  if (document) {
    document.cookie = `refresh_token=${session?.refresh_token}`
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    // const refreshed = await refreshSession();
    console.log("retrying fetch...");
    return apiFetch(url, { ...options, ...headers }, false);
  }

  return res;

}