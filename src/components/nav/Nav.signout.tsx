import { MouseEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { useStore } from "zustand";
// import { userStore } from "@/src/stores/userStore";
import styles from "./Nav.module.css"
import animations from "@/src/animations.module.css"

// import createClient from "@/utils/supabase/client"
import { supabase } from "@/utils/supabase/client";
import SignoutIcon from "@/src/assets/icons/signoutIcon.svg"


export default function Signout() {

  // const setUser = useStore(userStore, (state) => state.setUser)
  // const navigate = useNavigate();

  async function signout(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      // const supabase = createClient();
      console.log('signing out...');
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log("couldn't sign out!")
        console.error(error);
        throw error;
      };

      const { error: sessionError } = await supabase.auth.getSession();
      // console.log('session after signOut:', session);
      if (sessionError) throw sessionError;

    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  return (
    <div id="nav-signout-button">
      <button
        className={[
          styles.buttonStyle,
          animations.grow,
        ].join(" ")}
        onClick={signout}>
        <SignoutIcon />
      </button>
    </div>
  )

}