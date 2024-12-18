import SummaryContainer from "containers/summary/SummaryContainer"
import DetailsContainer from "containers/session/SessionContainer.Details"


import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession"
import { Question } from "@/src/stores/questionStore"


interface ReportProps {
  questionsAnswered: Question[]
  questionsCorrect: number
  studentResponses: ClientStudentResponse[]
}

export default function Report(props: ReportProps) {

  const { questionsAnswered, questionsCorrect, studentResponses } = props;

  return (
    <section id="session-report-document">
      <SummaryContainer questionsAnswered={questionsAnswered} questionsCorrect={questionsCorrect} />
      <DetailsContainer questionsAnswered={questionsAnswered} studentResponses={studentResponses} />
    </section>
  )

}