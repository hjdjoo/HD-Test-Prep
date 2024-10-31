import styles from "./App.module.css"
import { useEffect } from "react"
import { Outlet } from "react-router-dom";
import createSupabase from "@/utils/supabase/client";
// import HomeContainer from "./containers/home/HomeContainer";
import NavContainer from "containers/nav/NavContainer";
// import { User } from "@supabase/supabase-js";
import { User } from "./stores/userStore";

import { useUserStore } from "./stores/userStore";
import LoginContainer from "./containers/auth/LoginContainer";
// import PracticeContainer from "containers/practice/PracticeContainer";
// import AccountContainer from "containers/account/AccountContainer";

function App() {

  // TODO: move to global state
  const { user, setUser } = useUserStore();

  // get & set user upon render;
  useEffect(() => {
    const supabase = createSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT', session);
        // clear local and session storage
        [
          window.localStorage,
          window.sessionStorage,
        ].forEach((storage) => {
          Object.entries(storage)
            .forEach(([key]) => {
              storage.removeItem(key)
            })
        })
        setUser(null);
      };

      if (event === "SIGNED_IN") {
        // get JWTs from session and get user information.
        const accessToken = session?.access_token;
        const refreshToken = session?.refresh_token;

        const res = await fetch(`api/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ accessToken, refreshToken })
        })

        const user: User = await res.json();

        // console.log("App/useEffect/signed_in", user);
        setUser(user);
      }
    })

    return () => {
      subscription.unsubscribe();
    }

  }, [])

  return (
    <>
      <NavContainer />
      <main className={[styles.flexColCenter].join(" ")}>
        {
          user ?
            <Outlet /> :
            <LoginContainer />
        }
      </main>
    </>
  )
}

export default App
