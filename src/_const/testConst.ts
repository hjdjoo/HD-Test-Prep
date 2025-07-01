import { Question } from "@/src/stores/questionStore";
import { User } from "@/src/stores/userStore";
import { FeedbackData, ClientFeedbackFormData, ClientStudentResponse, QuestionImageData, FeedbackForm, StudentResponse, } from "../_types/client-types";
import { Category, ProblemType } from "../stores/categoryStore";
import { TagsData } from "../_types/client-types";

export const sampleQuestion = {
  id: 1,
  question: 42,
  testForm: "A",
  category: 3,
  problemType: 2,
  answer: "C",
  tags: { "101": 1 },
} as Question;

export const sampleUser = {
  id: 7,
  uid: "8",
  role: "student",
  name: "Alice",
  email: "a@example.com",
  instructor_id: 2,
} as User;

export const mockError = {
  ok: false,
  status: 500,
  statusText: "boom"
}

/* ─────────── Mock Question[] for useQuestionsAnswered ─────────── */

export const mockQuestions: Question[] = [
  {
    id: 42,
    question: 42,
    testForm: "A",
    category: 1,
    problemType: 1,
    answer: "C",
    tags: { "301": 1, "401": 1 },
  },
  {
    id: 43,
    question: 43,
    testForm: "A",
    category: 2,
    problemType: 2,
    answer: "A",
    tags: { "305": 1 },
  },
  {
    id: 44,
    question: 44,
    testForm: "B",
    category: 3,
    problemType: 3,
    answer: "E",
    tags: { "612": 1 },
  },
];


/* ───────────── QuestionImageData ───────────── */

export const mockQuestionImages: QuestionImageData[] = [
  {
    responseId: 1,
    imageUrl: "https://cdn.local/img/q42.png",
  },
  {
    responseId: 2,
    imageUrl: "https://cdn.local/img/q43.png",
  },
  {
    responseId: 3,
    imageUrl: "https://cdn.local/img/q44.png",
  },
];


/* ───────────── sessionResponseData ───────────── */

export const mockStudentResponses: StudentResponse[] = [
  {
    feedbackId: 101,
    id: 1,
    questionId: 42,
    response: "C",
    sessionId: 9001,
    studentId: 7,
    timeTaken: 18,
  },
  {
    feedbackId: 102,
    id: 2,
    questionId: 43,
    response: "A",
    sessionId: 9001,
    studentId: 7,
    timeTaken: 23,
  },
  {
    feedbackId: 103,
    id: 3,
    questionId: 44,
    response: "E",
    sessionId: 9001,
    studentId: 7,
    timeTaken: 15,
  },
]

export const mockSessionResponseData: ClientStudentResponse[] = mockStudentResponses.map((res) => {
  return Object.assign(res, { createdAt: "yyyy-mm-dd" }) as ClientStudentResponse
})

/* ───────────── ClientFeedbackFormData ───────────── */

export const mockFeedbackForms: FeedbackForm[] = [
  {
    sessionId: 9001,
    comment: "Tricky wording on part (b).",
    difficultyRating: 4,
    guessed: false,
    imageUrl: "https://cdn.local/img/q42.png",
    instructorId: 3,
    questionId: 42,
    studentId: 7,
    tags: [301, 502],
  },
  {
    sessionId: 9001,
    comment: "",
    difficultyRating: 2,
    guessed: true,
    imageUrl: "",
    instructorId: 3,
    questionId: 43,
    studentId: 7,
    tags: [401],
  },
  {
    sessionId: 9001,
    comment: "Need review of completing-the-square.",
    difficultyRating: 5,
    guessed: false,
    imageUrl: "https://cdn.local/img/q44.png",
    instructorId: 3,
    questionId: 44,
    studentId: 7,
    tags: [305, 612],
  },
]

export const mockClientFeedback: ClientFeedbackFormData[] = [
  {
    id: 101,
    comment: "Tricky wording on part (b).",
    createdAt: "2025-06-18T14:00:10Z",
    difficultyRating: 4,
    guessed: false,
    imageUrl: "https://cdn.local/img/q42.png",
    instructorId: 3,
    questionId: 42,
    studentId: 7,
    tags: [301, 502],
  },
  {
    id: 102,
    comment: null,
    createdAt: "2025-06-18T14:01:17Z",
    difficultyRating: 2,
    guessed: true,
    imageUrl: null,
    instructorId: 3,
    questionId: 43,
    studentId: 7,
    tags: [401],
  },
  {
    id: 103,
    comment: "Need review of completing-the-square.",
    createdAt: "2025-06-18T14:02:35Z",
    difficultyRating: 5,
    guessed: false,
    imageUrl: "https://cdn.local/img/q44.png",
    instructorId: 3,
    questionId: 44,
    studentId: 7,
    tags: [305, 612],
  },
];

/* ───────────── FeedbackData (links response→feedback) ───────────── */

export const mockFeedbackData: FeedbackData[] = [
  {
    responseId: 1,
    data: mockClientFeedback[0],
  },
  {
    responseId: 2,
    data: mockClientFeedback[1],
  },
  {
    responseId: 3,
    data: mockClientFeedback[2],
  },
];


/* ─────────── Category ─────────── */

export const mockCategories: Category[] = [
  { id: 1, category: "Algebra" },
  { id: 2, category: "Geometry" },
  { id: 3, category: "Probability" },
];

/* ─────────── ProblemType ───────── */

export const mockProblemTypes: ProblemType[] = [
  { id: 1, problemType: "Coordinate Geometry" },
  { id: 2, problemType: "Combinatorics" },
  { id: 3, problemType: "Similar Figures" },
];

/* ─────────── TagsData ────────────
   Matches responseIds 1-3 used in the other mock sets
──────────────────────────────────── */

export const mockTagsData: TagsData[] = [
  {
    responseId: 1,
    data: {
      "301": "Linear Equations",
      "401": "Word Problems",
    },
  },
  {
    responseId: 2,
    data: {
      "305": "Quadratics",
    },
  },
  {
    responseId: 3,
    data: {
      "612": "Combinations & Permutations",
    },
  },
];

export const mockTagStoreState: { [name: string]: number } = {
  "Linear Equations": 301,
  "Word Problems": 401,
  "Quadratics": 305,
  "Combinations & Permutations": 612
} 
