// import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
// import { Question } from "@/src/stores/questionStore";
// import ResponseSummary from "components/summary/Summary.Response";

// interface SessionDetailsProps {
//   questionsAnswered: Question[]
//   studentResponses: ClientStudentResponse[]
// }

// export default function SessionDetails(props: SessionDetailsProps) {

//   const { questionsAnswered, studentResponses } = props;

//   const responseItems = studentResponses.map((response, idx) => {

//     const responseQuestion = questionsAnswered.filter((question) => {
//       return question.id === response.questionId
//     })

//     return (
//       <ResponseSummary
//         key={`student-response-summary-item-${idx + 1}`}
//         studentResponse={response}
//       />
//     )
//   })

//   return (
//     <div>
//       Session Details:
//       {responseItems}
//     </div>
//   )

// }