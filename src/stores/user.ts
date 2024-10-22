import {create} from "zustand";


interface User {
  id: number,
  username: string,
  email: string,
  instructorId: number
}
interface UserState {
  user?: User,
  setUser: (user: User) => void
  // firstName: string,
  // lastName: string,
  // email: string,
  // instructorId: number
}

export const useUserStore = create<UserState>()((set) => ({
  user: undefined,
  setUser: (user) => set(() => ({ user: user}))
}))