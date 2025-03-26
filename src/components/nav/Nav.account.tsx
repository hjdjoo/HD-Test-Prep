import { Link } from "react-router-dom"
import styles from "./Nav.module.css"
import animations from "@/src/animations.module.css"

import AccountIcon from "@/src/assets/icons/accountIcon.svg"

export default function NavAccount() {

  return (
    <div id="nav-to-account-button">
      <button className={[
        styles.buttonStyle,
        animations.grow,
      ].join(" ")}>
        <Link to="/account">
          <AccountIcon />
        </Link>
      </button>
    </div>
  )

}