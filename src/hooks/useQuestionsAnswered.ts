import { useEffect, useState } from "react";
import { ClientStudentResponse } from "../queries/GET/getResponsesBySession";
import { Question } from "../stores/questionStore";
import { useQuestionStore } from "../stores/questionStore";

interface useQuestionsAnsweredProps {
  studentResponses?: ClientStudentResponse[]
}

export default function useQuestionsAnswered(props: useQuestionsAnsweredProps) {

  const { studentResponses } = props;
  const filteredQuestions = useQuestionStore((state) => state.filteredQuestions)
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


  return questionsAnswered;
}