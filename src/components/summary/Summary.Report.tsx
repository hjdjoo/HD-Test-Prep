import styles from "./Summary.module.css"

import SummaryContainer from "containers/summary/SummaryContainer"
import DetailsContainer from "containers/session/SessionContainer.Details"

import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession"


interface ReportProps {
  studentResponses: ClientStudentResponse[]
  children?: React.ReactNode
}

export default function Report(props: ReportProps) {

  const { studentResponses, children } = props;

  const questionsAnswered = useQuestionsAnswered({ studentResponses });
  const questionsCorrect = useQuestionsCorrect({ studentResponses, questionsAnswered })

  if (!studentResponses) {
    return (
      <div>
        No student responses!
      </div>
    )
  }

  if (!questionsAnswered.length || (questionsCorrect !== 0 && !questionsCorrect)) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <article id="session-report-document"
      className={[
        styles.pageBorder,
        styles.sectionAlign,
      ].join(" ")}>
      {!children
        && (questionsAnswered.length && !!questionsCorrect) &&
        <>
          <SummaryContainer questionsAnswered={questionsAnswered} questionsCorrect={questionsCorrect} />
          <DetailsContainer questionsAnswered={questionsAnswered} studentResponses={studentResponses} />
        </>}
      {children}
    </article>
  )

}