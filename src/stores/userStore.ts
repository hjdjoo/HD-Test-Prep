import { createStore } from "zustand";
import { persist } from "zustand/middleware";


export interface User {
  id: number,
  uid: string,
  role: "student" | "admin",
  name: string,
  email: string,
  instructor_id: number
}

interface UserState {
  user: User | null,
  setUser: (user: User | null) => void
}

export const userStore = createStore<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user: user }))
    }),
    {
      name: "user-storage"
    }
  )
);