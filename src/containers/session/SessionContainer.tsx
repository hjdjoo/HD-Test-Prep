import styles from "./SessionContainer.module.css"
import { useState, useEffect } from "react";

import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { useQuestionStore } from "@/src/stores/questionStore";

import SummaryContainer from "containers/summary/SummaryContainer";

import DetailsContainer from "./SessionContainer.Details";

interface SessionContainerProps {
  studentResponses: ClientStudentResponse[]
}


export default function SessionContainer(props: SessionContainerProps) {

  // const { sessionId, sessionResponses } = usePracticeSessionStore();
  // const sessionId = usePracticeSessionStore((state) => state.sessionId);
  // const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses)

  const [showDetails, setShowDetails] = useState<boolean>(false)

  const { studentResponses } = props;

  const { filteredQuestions } = useQuestionStore();
  const [questionsCorrect, setQuestionsCorrect] = useState<number>(0);
  console.log("SessionContainer/studentResponses: ", studentResponses)

  useEffect(() => {

    calculateQuestionsCorrect();

  }, [studentResponses])

  const questionIds = studentResponses.map(response => response.questionId);

  const questionsAnswered = filteredQuestions.filter(item => {
    return questionIds.includes(item.id);
  })

  console.log("SessionContainer/questionIds: ", questionIds)
  console.log("SessionContainer/questionsAnswered: ", questionsAnswered);


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

  function handleShowDetails() {
    setShowDetails(!showDetails);
  }

  return (
    <div id="session-container"
      className={[
        styles.containerMargins,
      ].join(" ")}
    >
      <SummaryContainer
        questionsAnswered={questionsAnswered}
        questionsCorrect={questionsCorrect} />
      <button id="show-session-details-button"
        className={[
          styles.buttonWidth,
          styles.sectionMargins,
        ].join(" ")}
        onClick={handleShowDetails}
      >{!showDetails ? "Click to view details +" : "Click to hide details -"}</button>
      {
        showDetails &&
        <div>
          <DetailsContainer questionsAnswered={questionsAnswered} studentResponses={studentResponses} />
        </div>
      }
    </div>
  )

}