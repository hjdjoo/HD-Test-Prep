import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.css"
import animations from "@/src/animations.module.css"

import createClient from "@/utils/supabase/client"
import SignoutIcon from "@/src/assets/icons/signoutIcon.svg"

export default function Signout() {

  const navigate = useNavigate();

  async function signout(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const supabase = createClient();
    console.log('signing out...')
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("couldn't sign out!")
      console.error(error);
      return;
    }
    navigate("/");

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