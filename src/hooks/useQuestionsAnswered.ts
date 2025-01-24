import { useEffect, useState } from "react";
import { ClientStudentResponse } from "../queries/GET/getResponsesBySession";
import { Question } from "../stores/questionStore";
import { useStore } from "zustand";
import { questionStore } from "../stores/questionStore";

interface useQuestionsAnsweredProps {
  studentResponses?: ClientStudentResponse[]
}

export default function useQuestionsAnswered(props: useQuestionsAnsweredProps) {

  const { studentResponses } = props;

  console.log("useQuestionsAnswered/studentResponses: ", studentResponses);

  const filteredQuestions = useStore(questionStore, (state) => state.filteredQuestions);
  console.log("filteredQuestions.length", filteredQuestions.length)

  const [questionsAnswered, setQuestionsAnswered] = useState<Question[]>([]);

  useEffect(() => {

    if (!studentResponses) {
      setQuestionsAnswered([]);
      return;
    }

    const questionIds = studentResponses.map(response => response.questionId);

    const currQuestionsAnswered = filteredQuestions.filter(item => {
      return questionIds.includes(item.id);
    })

    setQuestionsAnswered(currQuestionsAnswered);

  }, [studentResponses])


  console.log("useQuestionsAnswered/questionsAnswered: ", questionsAnswered)
  return questionsAnswered;
}