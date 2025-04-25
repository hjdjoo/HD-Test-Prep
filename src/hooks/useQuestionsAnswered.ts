// import { useEffect, useState } from "react";
import { ClientStudentResponse } from "@/src/_types/client-types"
// import { Question } from "../stores/questionStore";
import { useStore } from "zustand";
import { questionStore } from "../stores/questionStore";

interface useQuestionsAnsweredProps {
  studentResponses?: ClientStudentResponse[]
}

export default function useQuestionsAnswered(props: useQuestionsAnsweredProps) {

  const { studentResponses } = props;

  // console.log("useQuestionsAnswered/studentResponses: ", studentResponses);

  const filteredQuestions = useStore(questionStore, (state) => state.filteredQuestions);

  if (!studentResponses || !studentResponses.length) {
    return [];
  }

  const questionIds = studentResponses.map(response => response.questionId);

  const currQuestionsAnswered = filteredQuestions.filter(item => {
    return questionIds.includes(item.id);
  })

  // console.log("useQuestionsAnswered/useEffect/currQsAnswered", currQuestionsAnswered);

  return currQuestionsAnswered;
}