import styles from "./account.module.css"
import AccountContainer from "@/src/pages/account/containers/AccountContainer";


export default function AccountPage() {

  return (
    <div id="account-page"
      className={[
        styles.pageSizing,
        styles.pageMargins,
      ].join(" ")}>
      <AccountContainer />
    </div>
  )
}