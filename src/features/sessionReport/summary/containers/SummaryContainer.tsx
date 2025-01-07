import styles from "./SummaryContainer.module.css"
// import { StudentResponse } from "containers/question/QuestionContainer"
import { Question } from "@/src/stores/questionStore";

import SessionSummary from "@/src/features/sessionReport/summary/components/SessionReport.Summary"


interface SummaryContainerProps {
  questionsAnswered: Question[],
  questionsCorrect: number
}

export default function SummaryContainer(props: SummaryContainerProps) {

  const { questionsAnswered, questionsCorrect } = props;

  return (
    <div id="session-summary-container"
      className={[
        styles.containerMargins
      ].join(" ")}>
      <SessionSummary questionsAnswered={questionsAnswered.length} questionsCorrect={questionsCorrect} />
    </div>
  )
}