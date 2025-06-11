// Globals
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useStore } from "zustand";
import { Outlet } from "react-router-dom";
// styles
import styles from "./App.module.css";
import AuthProvider from "./contexts/AuthContext";
// utils
import { userStore } from "./stores/userStore";
// components
import NavContainer from "containers/nav/NavContainer";
// import { Session } from "@supabase/supabase-js";
import Auth from "./features/auth/Auth";
import Loading from "components/loading/Loading";

const queryClient = new QueryClient();

function App() {

  const user = useStore(userStore, (state) => state.user);
  const bootstrapped = useStore(userStore, (state) => state.bootstrapped);

  if (!bootstrapped) {
    return (
      <Loading />
    )
  }

  return (
    <div id="app" className={[
      styles.fullHeight,
      styles.flexColCenter
    ].join(" ")}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavContainer />
          <main className={[
            styles.flexColCenter,
            styles.widthFull,
            styles.flexGrow,
          ].join(" ")}>
            <div id="outlet"
              className={[
                styles.outletDisplay,
                styles.widthFull,
                styles.outletPadding,
              ].join(" ")}>
              {
                user ?
                  <Outlet />
                  :
                  <Auth />
              }
            </div>
          </main>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
