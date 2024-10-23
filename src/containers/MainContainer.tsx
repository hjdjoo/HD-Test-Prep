import style from "containers/MainContainer.module.css"
import LoginContainer from "containers/auth/LoginContainer"
import AccountContainer from "./account/AccountContainer"

interface MainContainerProps {
  user?: any
}

export default function MainContainer(props: MainContainerProps) {

  const { user } = props;

  return (
    <main className={style.container}>
      {user ? <AccountContainer /> : <LoginContainer />}
    </main>
  )
}