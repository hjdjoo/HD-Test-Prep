import Cookies from "js-cookie";
import createSupabase from "./supabase/client";

const isProd = import.meta.env.MODE === "production";

const supabase = createSupabase();

export async function refreshSession() {

  const { data: { session }, error } = await supabase.auth.refreshSession();

  if (error || !session) {
    console.log("refreshSession: No supabase session detected.")
    return false;
  }

  console.log("refreshSession: Supabase tokens detected. Saving to cookies.")
  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;

  Cookies.set("accessToken", accessToken, {
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
    domain: isProd ? ".hdprep.me" : undefined
  });
  Cookies.set("refreshToken", refreshToken, {
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
    domain: isProd ? ".hdprep.me" : undefined
  });

  return true;

}

export async function apiFetch(url: string, options: RequestInit = {}, retry = true) {

  const accessToken = Cookies.get("accessToken");

  console.log("setting headers")
  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  console.log("trying fetch");
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });


  if (res.status === 401 && retry) {
    const refreshed = await refreshSession();
    console.log("refreshed: ", refreshed)
    if (refreshed) {
      console.log("retrying fetch...");
      return apiFetch(url, options, false);
    } else {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/";
    }
  }

  return res;

}