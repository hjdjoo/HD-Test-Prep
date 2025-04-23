import style from "./HomeContainer.module.css"
import Auth from "@/src/features/auth/Auth";
// import AccountContainer from "../account/AccountContainer"
import Account from "@/src/pages/account/account";

import { userStore } from "@/src/stores/userStore";


export default function HomeContainer() {

  // const [user, setUser] = useState(0)
  const user = userStore.getState().user;

  return (
    <div id="home-container"
      className={[
        style.container,
      ].join(" ")}>
      {user ? <Account /> : <Auth />}
    </div>
  )
}