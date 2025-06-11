import { createContext, useEffect } from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router-dom";
import { User, userStore } from "../stores/userStore";
import { apiFetch } from "@/utils/apiFetch";
import { SERVER_URL } from "../config";

import { supabase } from "@/utils/supabase/client";

import { Session } from "@supabase/supabase-js";

const VITE_SERVER_URL = SERVER_URL;

export const AuthContext = createContext<{ user: User | null }>({
  user: null
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {

  // const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const user = useStore(userStore, (state) => state.user);
  const setUser = useStore(userStore, (state) => state.setUser)

  useEffect(() => {

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthContext/event, session: ", event, session);

      switch (event) {
        case "INITIAL_SESSION":
        case "SIGNED_IN":
          setTimeout(async () => {
            const user = await getUserProfile(session);
            // console.log(user);
            setUser(user);
          }, 0)
          break;
        case "SIGNED_OUT":
          setUser(null);
          navigate("/");
          break;
      }
    })

    supabase.auth.refreshSession();

    return () => {

      subscription.unsubscribe();

    }


  }, [])


  async function getUserProfile(session: Session | null) {

    if (!session) {
      // console.log("No session detected. Signing out...")
      await supabase.auth.signOut();
      navigate("/");
      return null;
    }

    // use session data to fetch user info;
    const res = await apiFetch(`${VITE_SERVER_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // console.log("getUser/res: ", res);
    if (!res.ok) {
      // console.log("Error while getting user. Signing out...");
      await supabase.auth.signOut();
      setUser(null);
      // console.log("signed out, navigating home...");
      navigate("/");
      return null;
    }

    const user: User = await res.json();

    // console.log("getUser/user: ", user);

    if (!user.id) {
      // console.log("No user Id returned");
      // console.log("signing out...");
      await supabase.auth.signOut();
      setUser(null);
      // console.log("signed out, navigating home...");
      navigate("/");
      return null;
    }

    return user;

  }


  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )

}