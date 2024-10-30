import { create } from "zustand";

export interface User {
  id: number,
  uid: string,
  role: "student" | "admin",
  name: string,
  email: string,
  instructorId: number
}

interface UserState {
  user: User | null,
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user }))
}))