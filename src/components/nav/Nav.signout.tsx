import { MouseEvent } from "react";
import createClient from "@/utils/supabase/client"
import { useNavigate } from "react-router-dom";


export default function Signout() {

  const navigate = useNavigate();

  async function signout(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("couldn't sign out!")
      console.error(error);
      return;
    }
    navigate("/");

  }

  return (
    <div>
      <button onClick={signout}>
        Sign Out
      </button>
    </div>
  )

}