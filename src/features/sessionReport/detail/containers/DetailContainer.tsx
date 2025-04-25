import styles from "./DetailContainer.module.css"

import { Question } from "@/src/stores/questionStore";
import { ClientStudentResponse } from "@/src/_types/client-types";


import SummaryItemContainer from "@/src/features/sessionReport/detail/containers/DetailContainer.Item";
// import ResponseSummary from "components/summary/Summary.Response";

interface DetailsContainerProps {
  questionsAnswered: Question[]
  studentResponses: ClientStudentResponse[]
  children?: React.ReactNode
}

export default function DetailsContainer(props: DetailsContainerProps) {

  const { children, questionsAnswered, studentResponses } = props;

  // // console.log("DetailsContainer/studentResponses: ", studentResponses)

  const responseItems = studentResponses.map((response, idx) => {

    const responseQuestion = questionsAnswered.filter((question) => {

      // // console.log("detailsContainer/question: ", question);

      return question.id === response.questionId;

    })

    return (
      <div key={`student-response-summary-item-${idx + 1}`}
        id={`student-response-summary-item-${idx + 1}`}
        className={[
          styles.sectionMargin,
        ].join(" ")}>
        <div className={[
          styles.textBold,
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
        styles.sectionSize,
        styles.sectionAlign,
      ].join(" ")}>
      {!children && responseItems}
      {children}
    </div>
  )

}