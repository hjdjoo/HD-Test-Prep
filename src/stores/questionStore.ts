import { Json } from "@/database.types";
import { create } from "zustand";

export interface Question {
  id: number,
  question: number,
  testForm: string,
  category: number,
  problemType: number,
  answer: string,
  tags: Json
}

// "categories" and "problemTypes" are exclusive filters - including a category in this filter should exclude those problems.
// testForm, difficulty, and tags are inclusive filters - specifying a testForm, some tags to look for, or a difficulty level should *include* those problems.
export interface Filter {
  categories: number[],
  problemTypes: number[],
  testForm: string,
  difficulty: {
    easy: boolean,
    medium: boolean,
    hard: boolean,
    [level: string]: boolean,
  },
  tags: number[],
}

type Questions = {
  questions: Question[]
  filteredQuestions: Question[]
  filter: Filter
  setFilter: (filter: Filter) => void
  setQuestions: (questions: Question[]) => void
  filterQuestions: () => void

}

export const defaultFilter = {
  categories: [],
  problemTypes: [],
  tags: [],
  testForm: "",
  difficulty: {
    easy: true,
    medium: true,
    hard: true
  }
}

const useQuestionStore = create<Questions>()((set) => ({
  questions: [],
  filteredQuestions: [],
  filter: defaultFilter,
  setFilter:
    (filter) => {
      // console.log("questionStore/setFilter/filter: ", filter);
      return set(() => ({ filter: filter }))
    },
  setQuestions:
    (questions) => set(() => ({ questions: questions })),
  filterQuestions:
    () => set((state) => {

      const { filter, questions } = state;
      // console.log("questionStore/filterQuestions/filter: ", filter)

      const filteredQuestions = questions.filter((question) => {

        const { categories, problemTypes, tags, testForm, difficulty } = filter;

        /* Something seems to be happening in the backend that coerces the values returned form the DB to a string. May want to adjust DB controller, particularly the snakeToCamel method. Issue possibly stems from the change-case library. */
        const categoryId = Number(question.category)
        const problemTypeId = Number(question.problemType)

        if (
          categories.length > 0 && categories.includes(categoryId) ||
          problemTypes.length > 0 && problemTypes.includes(problemTypeId) ||
          testForm.length > 0 && testForm !== question.testForm
        ) {
          return false
        };

        // filter by question number; 1-20 easy, 21-45 medium, 46-60 hard.
        if (question.question <= 20 && !difficulty.easy) {
          return false;
        }
        if (question.question > 20 && question.question <= 45 && !difficulty.medium) {
          return false;
        }
        if (question.question > 45 && question.question <= 60 && !difficulty.hard) {
          return false;
        };

        // filter by tags:
        if (tags.length > 0) {

          const questionTags = question.tags as { [key: string]: number };

          const tagMatches = tags.some(tag => questionTags[String(tag)]);

          if (!tagMatches) return false;

        }

        return true;

      })

      return { filteredQuestions: filteredQuestions }
    }),
}))

export { useQuestionStore };