import { create } from "zustand";

export interface Category {
  id: number,
  category: string
}

export interface ProblemType {
  id: number,
  problemType: string
}

interface Categories {
  categories: Category[],
  problemTypes: ProblemType[],
  setCategories: (categories: Category[]) => void,
  setProblemTypes: (problemTypes: ProblemType[]) => void
}

export const useCategoryStore = create<Categories>((set) => ({
  categories: [],
  problemTypes: [],
  setCategories: (categories) => {
    set(
      () => ({ categories: categories })
    )
  },
  setProblemTypes: (problemTypes) => {
    set(
      () => ({ problemTypes: problemTypes })
    )
  }
}))



