import AccountButton from "components/nav/Nav.account"
import Signout from "components/nav/Nav.signout"

import style from "./NavContainer.module.css"

export default function NavContainer() {

  return (
    <nav id="navbar" className={[
      style.navSpacing,
      style.alignNav
    ].join(" ")}>
      <div id="menu">
        <button>
          <u>==</u>
        </button>
      </div>
      <div id="account-buttons" className={[
        style.alignButtons
      ].join(" ")}>
        <AccountButton />
        <Signout />
      </div>
    </nav>
  )
}