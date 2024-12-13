import { Question } from "@/src/stores/questionStore";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";


import SummaryItemContainer from "containers/summary/SummaryContainer.Item";
// import ResponseSummary from "components/summary/Summary.Response";

interface DetailsContainerProps {
  questionsAnswered: Question[]
  studentResponses: ClientStudentResponse[]
}

export default function DetailsContainer(props: DetailsContainerProps) {

  const { questionsAnswered, studentResponses } = props;

  const responseItems = studentResponses.map((response, idx) => {

    const responseQuestion = questionsAnswered.filter((question) => {
      return question.id === response.questionId
    })

    return (
      <SummaryItemContainer
        key={`student-response-summary-item-${idx + 1}`}
        question={responseQuestion[0]}
        studentResponse={response}
      />
    )
  })

  return (
    <div id="session-details-container">
      {responseItems}
    </div>
  )

}