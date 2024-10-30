

import style from "containers/home/HomeContainer.module.css"
import LoginContainer from "containers/auth/LoginContainer"
import AccountContainer from "../account/AccountContainer"

import { useUserStore } from "#root/src/stores/userStore";


export default function HomeContainer() {

  // const [user, setUser] = useState(0)
  const { user } = useUserStore();

  return (
    <div className={style.container}>
      {user ? <AccountContainer /> : <LoginContainer />}
    </div>
  )
}