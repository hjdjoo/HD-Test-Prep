import style from "./HomeContainer.module.css"
import Auth from "@/src/features/auth/Auth";
// import AccountContainer from "../account/AccountContainer"
import Account from "@/src/pages/account/account";

import { useUserStore } from "@/src/stores/userStore";


export default function HomeContainer() {

  // const [user, setUser] = useState(0)
  const { user } = useUserStore();

  return (
    <div className={style.container}>
      {user ? <Account /> : <Auth />}
    </div>
  )
}