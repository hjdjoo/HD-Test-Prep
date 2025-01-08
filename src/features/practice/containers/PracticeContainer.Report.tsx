import styles from "./PracticeContainer.module.css"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";
import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";

import SummaryContainer from "@/src/features/sessionReport/summary/containers/SummaryContainer";
import DetailsContainer from "../../sessionReport/detail/containers/DetailContainer";

import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import ErrorPage from "@/src/ErrorPage";

interface SessionContainerProps {
  studentResponses: ClientStudentResponse[]
}

export default function PracticeReportContainer(props: SessionContainerProps) {

  const sessionId = usePracticeSessionStore((state) => state.sessionId);
  // const sessionId = usePracticeSessionStore((state) => state.sessionId);
  // const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses)

  const [showDetails, setShowDetails] = useState<boolean>(false)

  const { studentResponses } = props;

  const questionsAnswered = useQuestionsAnswered({ studentResponses })
  const questionsCorrect = useQuestionsCorrect({ studentResponses, questionsAnswered })

  console.log("SessionContainer/questionsAnswered: ", questionsAnswered)
  console.log("SessionContainer/questionsCorrect: ", questionsCorrect)

  function handleShowDetails() {
    setShowDetails(!showDetails);
  }

  if (!sessionId) {
    console.error("No session ID detected!")
    return (
      <ErrorPage />
    )
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
      >
        {
          !showDetails ?
            "Click to view details +" :
            "Click to hide details -"
        }
      </button>
      {
        showDetails &&
        <div>
          <DetailsContainer questionsAnswered={questionsAnswered} studentResponses={studentResponses} />
        </div>
      }
      <Link to={`/report/${sessionId}`}>
        View Session Report
      </Link>
    </div>
  )

}