import { describe, it, expect, beforeEach } from "vitest";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";

describe("practiceSessionStore", () => {
  /**
   * Reset the store to its initial snapshot before every spec.
   * Zustand exposes setState/ getState directly on the store creator.
   */
  beforeEach(() => {
    usePracticeSessionStore.setState({
      sessionId: null,
      sessionResponses: [],
      sessionQuestions: [],
    });
  });

  it("initialises with empty values", () => {
    const state = usePracticeSessionStore.getState();

    expect(state.sessionId).toBeNull();
    expect(state.sessionResponses).toEqual([]);
    expect(state.sessionQuestions).toEqual([]);
  });

  it("setSessionId updates the id and can be cleared", () => {
    const { setSessionId } = usePracticeSessionStore.getState();

    setSessionId(42);
    expect(usePracticeSessionStore.getState().sessionId).toBe(42);

    setSessionId(null);
    expect(usePracticeSessionStore.getState().sessionId).toBeNull();
  });

  it("setSessionQuestions overwrites the question array", () => {
    const { setSessionQuestions } = usePracticeSessionStore.getState();

    setSessionQuestions([1, 2, 3]);
    expect(usePracticeSessionStore.getState().sessionQuestions).toEqual([1, 2, 3]);

    // overwrite, not append
    setSessionQuestions([99]);
    expect(usePracticeSessionStore.getState().sessionQuestions).toEqual([99]);
  });

  it("setSessionResponses overwrites the response array", () => {
    const { setSessionResponses } = usePracticeSessionStore.getState();

    setSessionResponses([10]);
    expect(usePracticeSessionStore.getState().sessionResponses).toEqual([10]);

    setSessionResponses([]);
    expect(usePracticeSessionStore.getState().sessionResponses).toEqual([]);
  });

  it("addResponse appends immutably", () => {
    const { addResponse } = usePracticeSessionStore.getState();

    // first push
    addResponse(5);
    const firstArr = usePracticeSessionStore.getState().sessionResponses;
    expect(firstArr).toEqual([5]);

    // second push should return a *new* array instance
    addResponse(7);
    const secondArr = usePracticeSessionStore.getState().sessionResponses;

    expect(secondArr).toEqual([5, 7]);
    expect(secondArr).not.toBe(firstArr); // immutability check
  });
});
