

import style from "containers/home/HomeContainer.module.css"
import LoginContainer from "containers/auth/LoginContainer"
import AccountContainer from "../account/AccountContainer"

// import createSupabase from "@/utils/supabase/client";
import { useState } from "react";


export default function HomeContainer() {

  const [user, setUser] = useState(0)

  return (
    <div className={style.container}>
      {user ? <AccountContainer /> : <LoginContainer />}
    </div>
  )
}