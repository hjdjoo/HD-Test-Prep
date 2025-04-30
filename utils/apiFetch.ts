import Cookies from "js-cookie";
import createSupabase from "./supabase/client";

const isProd = import.meta.env.MODE === "production";

const supabase = createSupabase();

async function refreshSession() {

  const { data: { session }, error } = await supabase.auth.refreshSession();

  if (error || !session) {
    return false;
  }

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

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // important if you're relying on cookies being sent
  });


  if (res.status === 401 && retry) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiFetch(url, options, false); // Retry once after refresh
    } else {
      // Optional: handle logout if refresh fails
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/";
    }
  }

  return res;

}