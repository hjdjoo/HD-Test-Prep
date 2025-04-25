import { useEffect } from "react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useStore } from "zustand";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./App.module.css"

import createSupabase from "@/utils/supabase/client";
import NavContainer from "containers/nav/NavContainer";

import { User } from "./stores/userStore";

import { userStore } from "./stores/userStore";

import Auth from "./features/auth/Auth";
import { Session } from "@supabase/supabase-js";

import { SERVER_URL } from "./config";

const queryClient = new QueryClient();

const VITE_SERVER_URL = SERVER_URL;

const isProd = import.meta.env.MODE === "production";

function App() {

  const user = useStore(userStore, (state) => state.user);
  const setUser = useStore(userStore, (state) => state.setUser)
  const navigate = useNavigate();

  // console.log("App.tsx/user: ", user);

  // check session and get user from session data.
  useEffect(() => {

    (async () => {

      const supabase = createSupabase();

      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error("refreshSession/error: ", error);
        // console.error(error.message);
        setUser(null);
        return;
      }

      const user = await getUser(data.session);

      if (!user) {
        setUser(null);
        return;
      }

      setUser(user);

    })()

  }, [])

  useEffect(() => {

    const supabase = createSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (event === 'SIGNED_OUT') {
        // console.log('SIGNED_OUT', session);
        // clear local and session storage;
        [
          window.localStorage,
          window.sessionStorage,
        ].forEach((storage) => {
          Object.entries(storage)
            .forEach(([key]) => {
              storage.removeItem(key)
            })
        });

        setUser(null);
        navigate("/");

      };

      if (event === "SIGNED_IN") {

        // console.log("SIGNED_IN/Session: ", session);
        // get JWTs from session.
        const userRes: User | null = await getUser(session)

        setUser(userRes);
        navigate("/");
        // }
      }
    })

    return () => {
      subscription.unsubscribe();
    }

  }, [])

  async function getUser(session: Session | null) {

    const supabase = createSupabase();

    if (!session) {
      // console.log("No session detected. Signing out...")
      await supabase.auth.signOut();
      navigate("/");
      return null;
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

    if (!accessToken || !refreshToken) {
      // console.log("Access token or refresh token missing")
      await supabase.auth.signOut();
      navigate("/");
      return null;
    }

    // use session data to fetch user info;
    const res = await fetch(`${VITE_SERVER_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })

    // console.log("getUser/res: ", res);
    if (!res.ok) {
      // console.log("Error while getting user. Signing out...");
      await supabase.auth.signOut();
      setUser(null);
      // console.log("signed out, navigating home...");
      navigate("/");
      return null;
    }

    const user: User = await res.json();

    // console.log("getUser/user: ", user);

    if (!user.id) {
      // console.log("No user Id returned");
      // console.log("signing out...");
      await supabase.auth.signOut();
      setUser(null);
      // console.log("signed out, navigating home...");
      navigate("/");
      return null;
    }

    return user;

  }

  return (
    <div id="app" className={[
      styles.fullHeight,
      styles.flexColCenter
    ].join(" ")}>
      <QueryClientProvider client={queryClient}>
        <NavContainer />
        <main className={[
          styles.flexColCenter,
          styles.widthFull,
          styles.flexGrow,
        ].join(" ")}>
          <div id="outlet"
            className={[
              styles.outletDisplay,
              styles.widthFull,
              styles.outletPadding,
            ].join(" ")}>
            {
              user ?
                <Outlet />
                :
                <Auth />
            }
          </div>
        </main>
      </QueryClientProvider>
    </div>
  )
}

export default App
