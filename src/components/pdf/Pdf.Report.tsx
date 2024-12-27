import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { PDFViewer } from "@react-pdf/renderer";
import { Page, View, Document, Text, StyleSheet } from "@react-pdf/renderer";

import PdfSessionSummary from "./Pdf.Summary";
import PdfSessionItem from "./Pdf.Item";
import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

import { FeedbackData, QuestionImageData } from "containers/pdf/PdfContainer";

import { useQuery } from "@tanstack/react-query";


interface PdfReportProps {
  studentResponses: ClientStudentResponse[]
  questionImageData: QuestionImageData[]
  feedbackData: FeedbackData[]
}

const styles = StyleSheet.create({
  page: {

  },
  details: {

  },
  detailsOdd: {

  },
  detailsEven: {

  }
})


export default function PdfReport(props: PdfReportProps) {

  const { studentResponses, questionImageData, feedbackData } = props;

  const questionsAnswered = useQuestionsAnswered({ studentResponses });
  const questionsCorrect = useQuestionsCorrect({ studentResponses, questionsAnswered });


  if (!questionsAnswered.length || !!!questionsCorrect) {
    return (
      <div>
        Nothing to render!
      </div>
    )
  }

  const summary = () => {

    if (questionsAnswered.length && !!questionsCorrect) {
      return (
        <View>
          <PdfSessionSummary questionsAnswered={questionsAnswered.length} questionsCorrect={questionsCorrect} />
        </View>
      )
    } else {
      return (
        <View>
          <Text>Error While Rendering Summary Data</Text>
        </View>
      )
    }
  }

  const details = studentResponses.map(((response, idx) => {

    if (questionsAnswered.length) {

      const question = questionsAnswered.filter(question => {

        return question.id === response.questionId;

      })[0]

      const feedbackItem = feedbackData.filter(item => {
        return item.responseId === response.id
      })[0]


      if (question.id) {

        return (
          <View key={`response-item-${idx + 1}`}>
            <Text>{`Question ${idx + 1}`}</Text>
            <PdfSessionItem question={question} feedbackForm={feedbackItem.data} studentResponse={response} />
          </View>
        )

      }
    }
  }))


  return (
    <PDFViewer>
      <Document>
        <Page size="LETTER">
          {summary()}
          {details}
        </Page>
      </Document>
    </PDFViewer>
  )

}