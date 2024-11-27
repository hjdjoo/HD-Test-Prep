
import {
  // useQuery,
  QueryClient,
  QueryClientProvider,
  // QueryClientProviderProps
} from "@tanstack/react-query"
import { useEffect } from "react"
import { Outlet } from "react-router-dom";
import styles from "./App.module.css"
// import Cookies from "js-cookie";
// import HomeContainer from "./containers/home/HomeContainer";
import createSupabase from "@/utils/supabase/client";
import NavContainer from "containers/nav/NavContainer";
// import { User } from "@supabase/supabase-js";
import { User } from "./stores/userStore";

import { useUserStore } from "./stores/userStore";
import LoginContainer from "./containers/auth/LoginContainer";
// import PracticeContainer from "containers/practice/PracticeContainer";
// import AccountContainer from "containers/account/AccountContainer";

const queryClient = new QueryClient();

function App() {

  // TODO: move to global state
  const { user, setUser } = useUserStore();

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

        // console.log(typeof document.cookie);
        console.log("App/signed_out/before delete: ", document.cookie);

        // remove sb auth cookies
        // const cookies = document.cookie.split(" ")

        // // cookies.forEach(cookie => {
        // //   Cookies.remove(cookie);
        // // })
        // document.cookie = document.cookie.replace(/(sb)\S*/g, "")

        console.log("after delete: ", document.cookie)

        setUser(null);
      };

      if (event === "SIGNED_IN") {

        // get JWTs from session.
        const accessToken = session?.access_token;
        const refreshToken = session?.refresh_token;

        if (!accessToken || !refreshToken) {
          console.log("Access token or refresh token missing")
          return;
        }

        // use session data to fetch user info;
        const res = await fetch(`api/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ accessToken, refreshToken })
        })

        const user: User = await res.json();

        setUser(user);
      }
    })

    return () => {
      subscription.unsubscribe();
    }

  }, [])

  console.log("App.tsx/user: ", user)

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavContainer />
        <main className={[styles.flexColCenter].join(" ")}>
          {
            user ?
              <Outlet /> :
              <LoginContainer />
          }
        </main>
      </QueryClientProvider>
    </>
  )
}

export default App
