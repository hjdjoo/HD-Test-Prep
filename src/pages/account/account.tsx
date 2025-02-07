import styles from "./account.module.css"
import AccountContainer from "@/src/pages/account/containers/AccountContainer";
import { userStore } from "@/src/stores/userStore";
import { useStore } from "zustand";
import ErrorPage from "@/src/ErrorPage";
// import AdminContainer from "../admin/containers/AdminContainer";
import AdminPage from "../admin/admin";


export default function AccountPage() {

  const user = useStore(userStore, (state) => state.user);

  if (!user || !user.id) {
    return (
      <ErrorPage />
    )
  }

  const isAdmin = user.role === "admin"

  return (
    <>
      {isAdmin ?
        <div id="admin-page"
          className={[
            styles.pageDisplay,
            styles.pageSizing,
            styles.pageMargins,
          ].join(" ")}>
          <AdminPage />
        </div> :
        <div id="account-page"
          className={[
            styles.pageDisplay,
            styles.pageSizing,
            styles.pageMargins,
          ].join(" ")}>
          <AccountContainer />
        </div>
      }
    </>
  )
}