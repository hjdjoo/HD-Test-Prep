import createSupabase from "./supabase/client";

const supabase = createSupabase();

async function refreshSession() {

  // const supabase = createSupabase();
  const { error } = await supabase.auth.refreshSession();

  if (error) {
    return false;
  }

  else return true;

}

export async function apiFetch(url: string, options: RequestInit = {}, retry = true) {

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${session?.access_token}`);

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    const refreshed = await refreshSession();
    if (refreshed) {
      console.log("retrying fetch...");
      return apiFetch(url, { ...options, ...headers }, false);
    }
  }

  return res;

}