// Globals
import { useEffect } from "react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useStore } from "zustand";
import { Outlet, useNavigate } from "react-router-dom";
// styles
import styles from "./App.module.css"
// utils
import createSupabase from "@/utils/supabase/client";
import { User, userStore } from "./stores/userStore";
import { SERVER_URL } from "./config";
import { apiFetch } from "@/utils/apiFetch";
// components
import NavContainer from "containers/nav/NavContainer";
import { Session } from "@supabase/supabase-js";
import Auth from "./features/auth/Auth";

const queryClient = new QueryClient();

const VITE_SERVER_URL = SERVER_URL;

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

      const user = await getUserProfile(data.session);

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
        console.log('SIGNED_OUT', event);
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
        const userRes: User | null = await getUserProfile(session)

        setUser(userRes);
        navigate("/");
        // }
      }
    })

    return () => {
      subscription.unsubscribe();
    }

  }, [])

  async function getUserProfile(session: Session | null) {

    const supabase = createSupabase();
    if (!session) {
      // console.log("No session detected. Signing out...")
      await supabase.auth.signOut();
      navigate("/");
      return null;
    }

    // use session data to fetch user info;
    const res = await apiFetch(`${VITE_SERVER_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
