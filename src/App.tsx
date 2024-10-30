import styles from "./App.module.css"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import createSupabase from "@/utils/supabase/client";
// import HomeContainer from "./containers/home/HomeContainer";
import NavContainer from "containers/nav/NavContainer";
import { User } from "@supabase/supabase-js";
// import PracticeContainer from "containers/practice/PracticeContainer";
// import AccountContainer from "containers/account/AccountContainer";

const SERVER_URL = process.env.SERVER_URL

function App() {

  // TODO: move to global state
  const [user, setUser] = useState<User | null>(null);

  // get & set user upon render;
  useEffect(() => {
    (async () => {

      const supabase = createSupabase();
      // registering signout handler for app;'=

      supabase.auth.onAuthStateChange(async (event, session) => {
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
          console.log("SIGNED_IN", session);

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

          const data = await res.json();

          console.log(data);

        }
      })

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        return;
      }

      const { user } = data;
      console.log(user);

      setUser(user);
    })();

  }, [])

  return (
    <>
      <NavContainer />
      <main className={[styles.flexColCenter].join(" ")}>
        <Outlet />
      </main>
    </>
  )
}

export default App
