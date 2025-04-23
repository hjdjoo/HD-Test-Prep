import { CamelCasedProperties } from "type-fest";

import { DbStudentData, DbFeedbackFormData, DbInstructorData, DbStudentResponse } from "./server-types";

export interface FileData {
  fileType: string,
  fileData: string
}

export interface ImageData extends FileData {
  fileName: string
}

export type ClientFeedbackFormData = CamelCasedProperties<DbFeedbackFormData>

export type ClientInstructorData = CamelCasedProperties<DbInstructorData>

export type ClientStudentResponse = CamelCasedProperties<DbStudentResponse>;

export type ClientStudentData = CamelCasedProperties<DbStudentData>

export type QuestionImageData = {
  responseId: number
  imageUrl: string
}

export type StudentResponse = {
  id?: number
  sessionId: number
  studentId: number,
  questionId: number,
  response: string,
  feedbackId: number | null,
  timeTaken: number,
}

export type FeedbackData = {
  responseId?: number
  data: ClientFeedbackFormData | undefined
}

export type FeedbackForm = {
  sessionId: number
  questionId: number
  studentId: number
  comment: string
  difficultyRating: number | null
  tags: number[]
  guessed: boolean | null
  instructorId: number
  imageUrl: string
}

export type TagsData = {
  responseId: number
  data: { [tagId: string]: string }
}

export type EditStudentForm = {
  studentId: number
  instructorId: number | null
}

export type Role = "admin" | "tutor" | "student"

export interface NewProfileForm {
  firstName: string
  lastName: string
  name: string
  email: string
  role: Role | ""
  [field: string]: string
}