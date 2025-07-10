import { create } from "zustand";

interface PracticeSessionState {
  sessionId: number | null
  sessionResponses: number[]
  sessionQuestions: number[]
  setSessionResponses: (sessionResponses: PracticeSessionState["sessionResponses"]) => void
  setSessionQuestions: (sessionQuestions: number[]) => void
  setSessionId: (sessionId: number | null) => void
  addResponse: (responseId: number) => void
}

export const usePracticeSessionStore = create<PracticeSessionState>()((set) => ({
  sessionId: null,
  sessionResponses: [],
  sessionQuestions: [],
  setSessionResponses: (sessionResponses) => {
    set(() => ({
      sessionResponses: sessionResponses
    }))
  },
  setSessionQuestions: (sessionQuestions) => {
    set(() => ({
      sessionQuestions: sessionQuestions
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