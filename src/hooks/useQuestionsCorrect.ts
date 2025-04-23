import { Question } from "../stores/questionStore";

import { ClientStudentResponse } from "@/src/_types/client-types";


interface useQuestionsCorrectProps {
  studentResponses?: ClientStudentResponse[]
  questionsAnswered: Question[]
}

export default function useQuestionsCorrect(props: useQuestionsCorrectProps) {

  const { studentResponses, questionsAnswered } = props;

  function calculateQuestionsCorrect() {

    let correct = 0;

    if (!studentResponses || !studentResponses.length) {
      return correct;
    }

    studentResponses.forEach(entry => {
      questionsAnswered.forEach(question => {
        if ((entry.questionId === question.id) && (entry.response === question.answer)) {
          correct += 1;
        }
      })
    });

    return correct;

  }

  return calculateQuestionsCorrect();

}