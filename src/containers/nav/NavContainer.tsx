// import AccountButton from "components/nav/Nav.account"
import Signout from "components/nav/Nav.signout"
import HomeButton from "components/nav/Nav.home"

import style from "./NavContainer.module.css"

export default function NavContainer() {

  return (
    <nav id="navbar" className={[
      style.navPosition,
      style.navSpacing,
      style.navSize,
      style.alignNav
    ].join(" ")}>
      <div id="menu">
        <HomeButton />
      </div>
      <div id="account-buttons" className={[
        style.alignButtons
      ].join(" ")}>
        {/* <AccountButton /> */}
        <Signout />
      </div>
    </nav>
  )
}