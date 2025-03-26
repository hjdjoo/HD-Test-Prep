import styles from "./Report.module.css"

import SummaryContainer from "@/src/features/sessionReport/summary/containers/SummaryContainer"
import DetailsContainer from "@/src/features/sessionReport/detail/containers/DetailContainer"

import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

import { ClientStudentResponse } from "@/src/_types/client-types";


interface ReportProps {
  studentResponses: ClientStudentResponse[]
  children?: React.ReactNode
}

export default function Report(props: ReportProps) {

  const { studentResponses, children } = props;

  console.log("Report/studentResponses: ", studentResponses);

  const questionsAnswered = useQuestionsAnswered({ studentResponses });
  const questionsCorrect = useQuestionsCorrect({ studentResponses, questionsAnswered })

  console.log("questionsAnswered, questionsCorrect: ", questionsAnswered, questionsCorrect)

  if (!studentResponses || !studentResponses.length) {
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