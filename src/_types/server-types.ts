import { Tables } from "@/database.types";

export type DbStudentData = Tables<"profiles">

export type DbInstructorData = Tables<"tutors">

export type DbStudentResponse = Tables<"student_responses">

export type DbFeedbackFormData = Tables<"question_feedback">
