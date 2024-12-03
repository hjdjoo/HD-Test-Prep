import { create } from "zustand";
// import 


interface PracticeSessionState {
  sessionId: number | null
  sessionResponses: number[]
  setSessionId: (sessionId: number | null) => void
  addResponse: (responseId: number) => void
}

export const usePracticeSessionStore = create<PracticeSessionState>()((set) => ({
  sessionId: null,
  sessionResponses: [],
  setSessionId: (sessionId: number | null) => {
    set(() => ({
      sessionId: sessionId
    }))
  },
  addResponse: (responseId: number) => {
    set((state) => ({
      sessionResponses: [...state.sessionResponses, responseId]
    }))
  }
}))

