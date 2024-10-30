
import { Link } from "react-router-dom"

import AccountSummary from "components/account/Account.summary"
import AccountSettings from "components/account/Account.settings"

import { useUserStore } from "#root/src/stores/userStore"


export default function AccountContainer() {

  const { user } = useUserStore();

  return (
    <div id="account-container">
      <h1>{`Hello ${user?.name}!`}</h1>
      <h2>This is your account</h2>
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