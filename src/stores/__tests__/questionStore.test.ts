import { describe, it, expect, beforeEach } from "vitest";
import { questionStore, defaultFilter } from "@/src/stores/questionStore";
import type { Question } from "@/src/stores/questionStore";
import { act } from "react";

// helper so we don’t repeat getState()
const state = () => questionStore.getState();

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: 5,          // easy bucket
    testForm: "TEST1",
    category: 1,
    problemType: 1,
    answer: "A",
    tags: { "101": 1 },
  },
  {
    id: 2,
    question: 25,         // medium bucket
    testForm: "TEST1",
    category: 2,
    problemType: 2,
    answer: "E",
    tags: { "102": 1 },
  },
  {
    id: 3,
    question: 50,         // hard bucket
    testForm: "TEST2",
    category: 3,
    problemType: 1,
    answer: "J",
    tags: { "101": 1 },
  },
];

describe("questionStore", () => {
  beforeEach(() => {
    // reset the entire slice before every test
    questionStore.setState({
      questions: [],
      filteredQuestions: [],
      filter: { ...defaultFilter },
    });
    state().setQuestions(sampleQuestions);
  });

  it("starts with all questions when no filter applied", () => {

    act(() => {
      state().filterQuestions();
    })

    expect(state().filteredQuestions.map((q) => q.id)).toEqual([1, 2, 3]);
  });

  it("excludes categories & problemTypes (exclusive filters)", () => {
    state().setFilter({ ...defaultFilter, categories: [1] });
    state().filterQuestions();
    expect(state().filteredQuestions.map((q) => q.id)).toEqual([2, 3]);

    // now problemTypes
    state().setFilter({ ...defaultFilter, problemTypes: [2] });
    state().filterQuestions();
    expect(state().filteredQuestions.map((q) => q.id)).toEqual([1, 3]);
  });

  it("includes only matching testForm (inclusive filter)", () => {
    state().setFilter({ ...defaultFilter, testForm: "TEST1" });
    state().filterQuestions();
    expect(state().filteredQuestions.map((q) => q.id)).toEqual([1, 2]);
  });

  it("filters by difficulty buckets", () => {
    // disable easy questions
    state().setFilter({
      ...defaultFilter,
      difficulty: { easy: false, medium: true, hard: true },
    });
    state().filterQuestions();
    expect(state().filteredQuestions.map((q) => q.id)).toEqual([2, 3]);

    // now disable medium as well
    state().setFilter({
      ...defaultFilter,
      difficulty: { easy: false, medium: false, hard: true },
    });
    state().filterQuestions();
    expect(state().filteredQuestions.map((q) => q.id)).toEqual([3]);
  });

  it("keeps only questions containing one of the tag IDs", () => {
    state().setFilter({ ...defaultFilter, tags: [101] });
    state().filterQuestions();
    expect(state().filteredQuestions.map((q) => q.id)).toEqual([1, 3]);

    // tag that no sample question has → empty result
    state().setFilter({ ...defaultFilter, tags: [999] });
    state().filterQuestions();
    expect(state().filteredQuestions).toHaveLength(0);
  });

  it("combines filters correctly", () => {
    state().setFilter({
      categories: [3],          // exclude hard-coded category 3
      problemTypes: [],         // none
      testForm: "TEST1",        // include only form A
      tags: [101],              // must include tag 101
      difficulty: { easy: true, medium: true, hard: true },
    });
    state().filterQuestions();
    // category 3 excluded, testForm "A" required, tag 101 required ⇒ only id 1
    expect(state().filteredQuestions.map((q) => q.id)).toEqual([1]);
  });
});