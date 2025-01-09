import { Link } from "react-router-dom"
import styles from "./Nav.module.css"
import animations from "@/src/animations.module.css"

import HomeIcon from "@/src/assets/icons/homeIcon.svg"

export default function NavHome() {

  return (
    <div id="nav-to-home-button">
      <button className={[
        styles.buttonStyle,
        animations.grow,
      ].join(" ")}>
        <Link to="/">
          <HomeIcon />
        </Link>
      </button>
    </div>
  )

}