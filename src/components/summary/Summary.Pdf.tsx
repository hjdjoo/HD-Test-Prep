// import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
// import { PDFViewer } from "@react-pdf/renderer";
// import { Page, View, Document, Text, StyleSheet } from "@react-pdf/renderer";
// import SummaryContainer from "containers/summary/SummaryContainer";

// import PdfSessionSummary from "components/pdf/Pdf.Summary";
// import SummaryItemContainer from "containers/summary/SummaryContainer.Item";

// import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
// import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// interface PdfSummaryProps {
//   studentResponses: ClientStudentResponse[]
// }

// const styles = StyleSheet.create({
//   page: {

//   },
//   details: {

//   },
//   detailsOdd: {

//   },
//   detailsEven: {

//   }
// })


// export default function PdfSummary(props: PdfSummaryProps) {

//   const { studentResponses } = props;

//   const client = new QueryClient();

//   const questionsAnswered = useQuestionsAnswered({ studentResponses });
//   const questionsCorrect = useQuestionsCorrect({ studentResponses, questionsAnswered });

//   if (!questionsAnswered.length || !!!questionsCorrect) {
//     return (
//       <div>
//         Nothing to render!
//       </div>
//     )
//   }

//   const summary = () => {

//     if (questionsAnswered.length && !!questionsCorrect) {
//       return (
//         <View>
//           <PdfSessionSummary questionsAnswered={questionsAnswered.length} questionsCorrect={questionsCorrect}></PdfSessionSummary>
//         </View>
//       )
//     } else {
//       return (
//         <View>
//           <Text>Error While Rendering Summary Data</Text>
//         </View>
//       )
//     }
//   }

//   const details = studentResponses.map(((response, idx) => {

//     if (questionsAnswered.length) {

//       const question = questionsAnswered.filter(question => {

//         return question.id === response.questionId;

//       })[0]

//       if (question.id) {

//         return (
//           <View key={`response-item-${idx + 1}`}>
//             <Text>{`Question ${idx + 1}`}</Text>
//             <QueryClientProvider client={client}>
//               <SummaryItemContainer question={question} studentResponse={response} />
//             </QueryClientProvider>
//           </View>
//         )

//       }
//     }
//   }))


//   return (
//     <PDFViewer>
//       <Document>
//         <Page size="LETTER">
//           {summary()}
//           {details}
//         </Page>
//       </Document>
//     </PDFViewer>
//   )

// }