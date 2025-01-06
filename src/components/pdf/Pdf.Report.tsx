import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { PDFViewer } from "@react-pdf/renderer";
import { Page, View, Document, Image, Text, StyleSheet } from "@react-pdf/renderer";

import PdfSessionSummary from "./Pdf.Summary";
import PdfSessionItem from "./Pdf.Item";
import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

import { FeedbackData, QuestionImageData, TagsData } from "containers/pdf/PdfContainer";
import { Question } from "@/src/stores/questionStore";

interface PdfReportProps {
  studentResponses: ClientStudentResponse[]
  questionImageData: QuestionImageData[]
  feedbackData: FeedbackData[]
  tagsData: TagsData[]
  questionsAnswered: Question[]
  questionsCorrect: number
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

  const { studentResponses, questionImageData, feedbackData, tagsData, questionsAnswered, questionsCorrect } = props;



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
        <PdfSessionSummary questionsAnswered={questionsAnswered.length} questionsCorrect={questionsCorrect} />
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

      const imageItem = questionImageData.filter(item => {
        return item.responseId === response.id
      })[0]

      const feedbackItem = feedbackData.filter(item => {
        return item.responseId === response.id
      })[0]

      const feedbackTags = tagsData.filter(item => {
        return item.responseId = response.id
      })[0]


      if (question.id) {

        return (
          <View key={`response-item-${idx + 1}`}>
            <Text>{`Question ${idx + 1}`}</Text>
            <View>
              <Image src={imageItem.imageUrl} />
              <PdfSessionItem question={question} feedbackForm={feedbackItem.data} studentResponse={response} tagsData={feedbackTags.data} />
            </View>
          </View>
        )
      }
    }
  }))


  return (

    <Document>
      <Page size="LETTER">
        {summary()}
        {details}
      </Page>
    </Document>

  )

}