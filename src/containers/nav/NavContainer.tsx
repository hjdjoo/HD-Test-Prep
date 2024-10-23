import NavAccount from "components/nav/Nav.account"
import Signout from "components/nav/Nav.signout"

import style from "./NavContainer.module.css"

export default function NavContainer() {

  return (
    <nav id="navbar" className={style.alignNav}>
      <NavAccount />
      <Signout />
    </nav>
  )
}