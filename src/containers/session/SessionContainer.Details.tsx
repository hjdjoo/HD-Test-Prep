import styles from "./SessionContainer.module.css"

import { Question } from "@/src/stores/questionStore";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";


import SummaryItemContainer from "containers/summary/SummaryContainer.Item";
// import ResponseSummary from "components/summary/Summary.Response";

interface DetailsContainerProps {
  questionsAnswered: Question[]
  studentResponses: ClientStudentResponse[]
  children?: React.ReactNode
}

export default function DetailsContainer(props: DetailsContainerProps) {

  const { children, questionsAnswered, studentResponses } = props;

  // console.log("DetailsContainer/studentResponses: ", studentResponses)

  const responseItems = studentResponses.map((response, idx) => {

    const responseQuestion = questionsAnswered.filter((question) => {

      console.log("detailsContainer/question: ", question);

      return question.id === response.questionId;

    })

    return (
      <div key={`student-response-summary-item-${idx + 1}`}
        id={`student-response-summary-item-${idx + 1}`}
        className={[
          styles.itemBg,
          styles.itemPadding,
        ].join(" ")}>
        <div className={[
          styles.textMd,
          styles.textMb,
        ].join(" ")}>
          <p>{`Question ${idx + 1}:`}</p>
        </div>
        <SummaryItemContainer
          question={responseQuestion[0]}
          studentResponse={response}
        />
      </div>
    )
  })

  return (
    <div id="session-details-container"
      className={[
        styles.itemWidth,
      ].join(" ")}>
      {!children && responseItems}
      {children}
    </div>
  )

}