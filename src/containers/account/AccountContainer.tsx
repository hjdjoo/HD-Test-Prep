
import { Link } from "react-router-dom"

import AccountSummary from "components/account/Account.summary"
import AccountSettings from "components/account/Account.settings"



export default function AccountContainer() {

  return (
    <div id="account-container">
      <h1>This is your account</h1>
      <AccountSettings></AccountSettings>
      <AccountSummary></AccountSummary>
      <button>
        <Link to="/practice">
          Practice
        </Link>
      </button>
    </div>
  )
}