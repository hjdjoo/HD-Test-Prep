import { useState, useEffect } from "react"

import { Question } from "../stores/questionStore";

import { ClientStudentResponse } from "../queries/GET/getResponsesBySession";


interface useQuestionsCorrectProps {
  studentResponses?: ClientStudentResponse[]
  questionsAnswered: Question[]
}

export default function useQuestionsCorrect(props: useQuestionsCorrectProps) {

  const { studentResponses, questionsAnswered } = props;
  const [questionsCorrect, setQuestionsCorrect] = useState<number>(0);

  useEffect(() => {

    calculateQuestionsCorrect();

  }, [studentResponses, questionsAnswered])

  function calculateQuestionsCorrect() {

    let correct = 0;

    if (!studentResponses) {
      return;
    }

    studentResponses.forEach(entry => {
      questionsAnswered.forEach(question => {
        if ((entry.questionId === question.id) && (entry.response === question.answer)) {
          correct += 1;
        }
      })
    });

    setQuestionsCorrect(correct);
  }

  return questionsCorrect;

}