import { create } from "zustand";
// import 


interface PracticeSessionState {
  sessionId: number | null
  sessionResponses: number[]
  setSessionResponses: (sessionResponses: PracticeSessionState["sessionResponses"]) => void
  setSessionId: (sessionId: number | null) => void
  addResponse: (responseId: number) => void
}

export const usePracticeSessionStore = create<PracticeSessionState>()((set) => ({
  sessionId: null,
  sessionResponses: [],
  setSessionResponses: (sessionResponses) => {
    set(() => ({
      sessionResponses: sessionResponses
    }))
  },
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

