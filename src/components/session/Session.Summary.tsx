import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore"
import { useQuestionStore } from "@/src/stores/questionStore";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { useEffect, useState } from "react";


interface SessionSummaryProps {
  studentResponses: ClientStudentResponse[]
}

function SessionItem(response: ClientStudentResponse) {



}


export default function SessionSummary(props: SessionSummaryProps) {

  const { filteredQuestions } = useQuestionStore();
  const [questionsCorrect, setQuestionsCorrect] = useState<number>(0);

  const { studentResponses } = props;

  // const responses = studentResponses.map((response, idx) => {
  //   return (
  //     <div>

  //     </div>
  //   )
  // })

  useEffect(() => {

    calculateQuestionsCorrect();

  }, [studentResponses])

  const questionIds = studentResponses.map(response => response.questionId);

  console.log("questionIds: ", questionIds)

  const questionsAnswered = filteredQuestions.filter(item => {
    return questionIds.includes(item.id);
  })

  console.log("SessionSummary/questionsAnswered: ", questionsAnswered);


  function calculateQuestionsCorrect() {

    let correct = 0;

    studentResponses.forEach(entry => {

      questionsAnswered.forEach(question => {

        if ((entry.questionId === question.id) && (entry.response === question.answer)) {
          correct += 1;
        }

      })

    });

    setQuestionsCorrect(correct);

  }


  return (
    <div>
      Session Summary
      <div>
        <p>Questions Answered: </p>
        <p>{studentResponses.length}</p>
        <p>Questions Correct: </p>
        <p>{questionsCorrect}</p>
      </div>
    </div>
  )

}