import { Link } from "react-router-dom";
import styles from "./AccountContainer.module.css";
import animations from "@/src/animations.module.css"

import { userStore } from "@/src/stores/userStore";
import ErrorPage from "@/src/ErrorPage";

// import AccountSummary from "@/src/pages/account/components/Account.summary";
// import AccountSettings from "@/src/pages/account/components/Account.settings";

export default function AccountContainer() {

  const user = userStore.getState().user;

  if (!user || !user.id) {

    return (
      <ErrorPage />
    )

  }

  return (
    <div id="account-container"
      className={[
      ].join(" ")}>
      <div id="account-page-heading"
        className={[
          styles.sectionSpacing,
          styles.alignHeading,
        ].join(" ")}>
        <h1>{`Hello ${user?.name.split(" ")[0]}!`}</h1>
        <p>Ready to practice?</p>
      </div>
      {/* <div id="account-information"
        className={[
          styles.sectionSpacing,
        ].join(" ")}>
        <AccountSummary />
      </div> */}
      <Link to="/practice"
        className={[
          styles.linkStyle,
        ].join(" ")}>
        <button id="go-to-practice-button"
          className={[
            styles.buttonStyle,
            styles.buttonSize,
            animations.highlightPrimary,
          ].join(" ")}>
          Go!
        </button>
      </Link>
    </div>
  )
}