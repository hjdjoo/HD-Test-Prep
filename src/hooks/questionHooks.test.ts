import {
  describe,
  it,
  expect,
  beforeEach,
} from "vitest";
import { act, renderHook } from "@testing-library/react";

import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";  // :contentReference[oaicite:3]{index=3}
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";    // :contentReference[oaicite:4]{index=4}
import { questionStore } from "@/src/stores/questionStore";
import { mockQuestions, mockSessionResponseData } from "../_const/testConst";

beforeEach(() => {
  act(() =>
    questionStore.setState({
      questions: mockQuestions,
      filteredQuestions: mockQuestions.slice(0, 1),
      filter: questionStore.getState().filter,
    }),
  );
});

describe("useQuestionsAnswered", () => {
  it("returns empty array when no responses", () => {
    const { result } = renderHook(() =>
      useQuestionsAnswered({ studentResponses: [] }),
    );
    expect(result.current).toEqual([]);
  });

  it("maps responses → questions via id filter", () => {
    const { result } = renderHook(() =>
      useQuestionsAnswered({ studentResponses: mockSessionResponseData }),
    );
    expect(result.current).toEqual(mockQuestions.slice(0, 1));
  });
});

describe("useQuestionsCorrect", () => {
  it("returns 0 when no responses", () => {
    const { result } = renderHook(() =>
      useQuestionsCorrect({
        studentResponses: [],
        questionsAnswered: mockQuestions.slice(0, 1),
      }),
    );
    expect(result.current).toBe(0);
  });

  it("counts only matching response=answer pairs", () => {
    const { result } = renderHook(() =>
      useQuestionsCorrect({
        studentResponses: mockSessionResponseData,
        questionsAnswered: mockQuestions.slice(0, 1),
      }),
    );
    expect(result.current).toBe(1);
  });
});
