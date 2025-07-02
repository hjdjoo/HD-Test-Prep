import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,

} from "vitest";
import { act, fireEvent, render, renderHook } from "@testing-library/react";

import FilterSettings from "@/src/features/practice/components/Practice.filter";
import { questionStore } from "@/src/stores/questionStore";
import { useCategoryStore } from "@/src/stores/categoryStore";
import { mockCategories, mockProblemTypes } from "@/src/_const/testConst";


/* render category store hook */

const {
  result: { current },
} = renderHook(() =>
  useCategoryStore(),
);

const { setCategories, setProblemTypes } = current;
setCategories(mockCategories);
setProblemTypes(mockProblemTypes);

/* Helpers */
const filter = () => questionStore.getState().filter;
const renderUI = () => render(<FilterSettings />);

/* =================================================================== */
describe("<Practice.filter>", () => {

  beforeEach(() => {
    // reset questionStore to defaults before each test

    act(() => {
      questionStore.setState({
        filter: {
          categories: [],
          problemTypes: [],
          difficulty: { easy: true, medium: true, hard: true },
          testForm: "",
          tags: [],
        },
      });
    })

  });

  afterEach(() => vi.clearAllMocks());

  /* ---- Maps stores → checkboxes --------------------------------------- */
  it("renders checkboxes for categories, problem types and difficulties", () => {
    const { getByLabelText } = renderUI();

    // category labels
    expect(getByLabelText("Algebra")).toBeInTheDocument();
    expect(getByLabelText("Geometry")).toBeInTheDocument();
    expect(getByLabelText("Probability")).toBeInTheDocument();

    // problem-type labels
    expect(getByLabelText("Coordinate Geometry")).toBeInTheDocument();
    expect(getByLabelText("Combinatorics")).toBeInTheDocument();
    expect(getByLabelText("Similar Figures")).toBeInTheDocument();

    // difficulty labels (capitalised)
    expect(getByLabelText("Easy")).toBeInTheDocument();
    expect(getByLabelText("Medium")).toBeInTheDocument();
    expect(getByLabelText("Hard")).toBeInTheDocument();
  });

  /* ---- Category toggle calls setFilter ------------------------------- */
  it("updates filter.categories when a category checkbox is toggled", () => {
    const { getByLabelText } = renderUI();

    const algebra = getByLabelText("Algebra") as HTMLInputElement;

    expect(algebra.checked).toBe(true);
    act(() => fireEvent.click(algebra));

    expect(filter().categories).toContain(1);
    expect(algebra.checked).toBe(false);

    // toggle again ⇒ id removed
    act(() => fireEvent.click(algebra));
    expect(filter().categories).not.toContain(1);
    expect(algebra.checked).toBe(true);
  });

  /* ---- ProblemType toggle ------------------------------------------- */
  it("updates filter.problemTypes when a problem-type checkbox is toggled", () => {
    const { getByLabelText } = renderUI();

    const input = getByLabelText("Similar Figures") as HTMLInputElement;
    act(() => fireEvent.click(input));
    expect(filter().problemTypes).toContain(3);
  });

  /* ---- Difficulty toggle -------------------------------------------- */
  it("toggles difficulty flags in filter.difficulty", () => {
    const { getByLabelText } = renderUI();

    const hard = getByLabelText("Hard") as HTMLInputElement;
    expect(hard.checked).toBe(true);
    expect(filter().difficulty.hard).toBe(true);

    act(() => fireEvent.click(hard));

    expect(filter().difficulty.hard).toBe(false);
    expect(hard.checked).toBe(false);
  });

  /* ---- Multiple toggles combined ------------------------------------ */
  it("persists independent filter fields", async () => {
    const { getByLabelText } = renderUI();

    const geometry = getByLabelText("Geometry");
    const coordGeo = getByLabelText("Coordinate Geometry");
    const medium = getByLabelText("Medium");

    act(() => {
      fireEvent.click(geometry);
      fireEvent.click(coordGeo);
      fireEvent.click(medium);
    });

    // const f = filter();
    expect(filter().categories).toEqual([2]);
    expect(filter().problemTypes).toEqual([1]);
    expect(filter().difficulty.medium).toBe(false);

  });
});
