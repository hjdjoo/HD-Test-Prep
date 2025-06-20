import { createStore } from "zustand";
import { persist } from "zustand/middleware";


export interface User {
  id: number,
  uid: string,
  role: "student" | "admin",
  name: string,
  email: string,
  instructor_id: number | null
}

interface UserState {
  user: User | null,
  bootstrapped: boolean,
  setUser: (user: User | null) => void
}

export const userStore = createStore<UserState>()(
  persist(
    (set) => ({
      user: null,
      bootstrapped: false,
      setUser: (user) => set(() => ({ user: user, bootstrapped: true }))
    }),
    {
      name: "user-storage"
    }
  )
);