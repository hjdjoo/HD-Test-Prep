import style from "containers/MainContainer.module.css"
import LoginContainer from "containers/auth/LoginContainer"


export default function MainContainer() {

  return (
    <main className={style.container}>
      <LoginContainer />
    </main>
  )
}