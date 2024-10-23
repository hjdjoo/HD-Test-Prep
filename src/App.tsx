// import styles from "./App.module.css"
import { useEffect, useState } from "react"
import createClient from "@/supabase/client";
import MainContainer from "./containers/MainContainer";
import NavContainer from "containers/nav/NavContainer";
import { User } from "@supabase/supabase-js";

function App() {

  const [user, setUser] = useState<User | null>(null);


  // get & set user upon render;
  useEffect(() => {
    (async () => {

      const supabase = createClient();

      // registering signout handler for app;
      supabase.auth.onAuthStateChange((event, session) => {
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
      <MainContainer user={user} />
    </>
  )
}

export default App
