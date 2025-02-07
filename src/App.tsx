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

const queryClient = new QueryClient();

function App() {

  const user = useStore(userStore, (state) => state.user);
  const setUser = useStore(userStore, (state) => state.setUser)
  const navigate = useNavigate();

  console.log("App.tsx/user: ", user);

  // check if user exists. Also check 
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

  // get & set user upon render;
  useEffect(() => {

    const supabase = createSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT', session);
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

        console.log("SIGNED_IN/Session: ", session);
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
      await supabase.auth.signOut();
      navigate("/");
      return null;
    }

    const accessToken = session.access_token;
    const refreshToken = session.refresh_token;

    Cookies.set("accessToken", accessToken);
    Cookies.set("refreshToken", refreshToken);

    if (!accessToken || !refreshToken) {
      console.log("Access token or refresh token missing")
      await supabase.auth.signOut();
      navigate("/");
      return null;
    }

    // use session data to fetch user info;
    const res = await fetch(`api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })

    const user: User = await res.json();

    if (!user.id) {
      console.log("No user Id returned");
      console.log("signing out...");
      await supabase.auth.signOut();
      setUser(null);
      console.log("signed out, navigating home...");
      navigate("/");
      return null;
    }

    return user;

  }

  // // log out if closing window.
  // useEffect(() => {

  //   async function beforeUnload() {

  //     const supabase = createSupabase();

  //     await supabase.auth.signOut();

  //   }

  //   window.addEventListener("beforeunload", beforeUnload);

  // }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavContainer />
        <main className={[
          styles.flexColCenter,
        ].join(" ")}>
          {
            user ?
              <div id="outlet"
                className={[
                  styles.outletDisplay,
                  styles.outletWidthFull,
                  styles.outletPadding
                ].join(" ")}>
                <Outlet />
              </div>
              :
              <div id="auth-outlet"
                className={[
                  styles.outletDisplay,
                  styles.outletWidthFull,
                  styles.outletPadding
                ].join(" ")}>
                <Auth />
              </div>
          }
        </main>
      </QueryClientProvider>
    </>
  )
}

export default App
