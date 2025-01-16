import styles from "./PracticeContainer.module.css"
import animations from "@/src/animations.module.css";
import { useState, Suspense } from "react";
import { Link } from "react-router-dom";

import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";
import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";

import SummaryContainer from "@/src/features/sessionReport/summary/containers/SummaryContainer";
import DetailsContainer from "../../sessionReport/detail/containers/DetailContainer";
import ModalContainer from "containers/modal/ModalContainer";
import SendPdfModal from "../../sessionReport/components/SessionReport.SendPdfModal";

import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import ErrorPage from "@/src/ErrorPage";
// import Loading from "components/loading/Loading";
import Spinner from "components/loading/Loading.Spinner"

interface SessionReportContainerProps {
  studentResponses: ClientStudentResponse[]
}

export default function SessionReportContainer(props: SessionReportContainerProps) {

  const sessionId = usePracticeSessionStore((state) => state.sessionId);
  // const sessionId = usePracticeSessionStore((state) => state.sessionId);
  // const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses)

  const [showDetails, setShowDetails] = useState<boolean>(false)


  const [sendStatus, setSendStatus] = useState<"waiting" | "sending" | "sent">("waiting");


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
        styles.sectionAlign,
        styles.containerMargins,
        styles.sectionMargins,
      ].join(" ")}
    >
      <SummaryContainer
        questionsAnswered={questionsAnswered}
        questionsCorrect={questionsCorrect} />
      <button id="show-session-details-button"
        className={[
          styles.sectionMargin,
          styles.buttonStyle,
          styles.buttonWidth,
          styles.sectionMargins,
          animations.highlightPrimary,
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
          <Suspense fallback={<Spinner />}>
            <DetailsContainer questionsAnswered={questionsAnswered} studentResponses={studentResponses} />
          </Suspense>
        </div>
      }
      <div id="link-to-report"
        className={[
          styles.sectionMargin,
          styles.sectionAlign,
          styles.linkAlign,
        ].join(" ")}>
        <Link to={`/report/${sessionId}`}>
          View Session Report
        </Link>
      </div>
      <button id="send-report-button"
        className={[
          styles.buttonStyleSecondary,
          animations.highlightPrimaryDark,
        ].join(" ")}
        onClick={() => {
          setSendStatus("sending");
        }}>
        End Session & Send Report
      </button>
      {
        sendStatus === "sending" &&
        <ModalContainer>
          <SendPdfModal
            sessionId={String(sessionId)}
            setSendStatus={setSendStatus}
          />
        </ModalContainer>
      }
    </div>
  )

}