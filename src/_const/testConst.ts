import { Question } from "@/src/stores/questionStore";
import { User } from "@/src/stores/userStore";

export const sampleQuestion = {
  id: 1,
  question: 42,          // difficulty bucket
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

