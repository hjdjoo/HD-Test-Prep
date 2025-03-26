import { ClientStudentResponse } from "@/src/_types/client-types";
import { Page, View, Document, Image, Text } from "@react-pdf/renderer";

import PdfSessionSummary from "../components/Pdf.Summary";
import PdfSessionItem from "./Pdf.Item";

import { FeedbackData, QuestionImageData, TagsData } from "@/src/features/pdf/containers/PdfContainer";
import { Question } from "@/src/stores/questionStore";
import { User } from "@/src/stores/userStore";
import { styles } from "../styles";

interface PdfReportProps {
  studentResponses: ClientStudentResponse[]
  questionImageData: QuestionImageData[]
  feedbackData: FeedbackData[]
  tagsData: TagsData[]
  questionsAnswered: Question[]
  questionsCorrect: number
  user: User
};

export default function PdfReport(props: PdfReportProps) {

  const {
    studentResponses,
    questionImageData,
    feedbackData,
    tagsData,
    questionsAnswered,
    questionsCorrect,
    user
  } = props;

  if (!questionsAnswered.length || (questionsCorrect !== 0 && !questionsCorrect)) {
    return (
      <View>
        Nothing to render!
      </View>
    )
  }

  const studentInfo = () => {

    return (
      <View style={styles.heading}>
        <Text>{`Student Name: ${user.name}`}</Text>
      </View>
    );
  }

  const summary = () => {

    if (questionsAnswered.length && questionsCorrect >= 0) {
      return (
        <PdfSessionSummary
          questionsAnswered={questionsAnswered.length}
          questionsCorrect={questionsCorrect} />
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

      // console.log("mapping details...")
      const question = questionsAnswered.filter(question => {
        // console.log("questionsAnswered/question: ")
        // console.log(question)
        return question.id === response.questionId;

      })[0]

      const imageItem = questionImageData.filter(item => {
        // console.log("questionImageData/item: ")
        // console.log(item);
        // console.log("response.id", response.id);
        return item.responseId === response.id
      })[0]

      const feedbackItem = feedbackData.filter(item => {
        // console.log("feedbackData/item: ")
        // console.log(item);
        if (item.responseId) {
          return item.responseId === response.id
        }
      })[0]

      const feedbackTags = tagsData.filter(item => {
        // console.log("tagsData/item: ")
        // console.log(item);
        return item.responseId = response.id
      })[0]

      console.log("question: ", question, "imageItem: ", imageItem, "feedbackItem: ", feedbackItem, "feedbackTags: ", feedbackTags)


      if (question.id) {

        console.log(imageItem);

        return (
          <View key={`response-item-${idx + 1}`}
            wrap={false}>
            <View>
              <Text style={styles.questionTitle}>{`Question ${idx + 1}`}</Text>
            </View>
            <View style={{
              ...styles.question,
              ...styles.sectionSpacingLg
            }}>{
                imageItem &&
                <Image src={imageItem.imageUrl}
                  style={{
                    ...styles.image,
                  }} />}
              <PdfSessionItem
                question={question}
                feedbackForm={feedbackItem && feedbackItem.data ? feedbackItem.data : undefined}
                studentResponse={response}
                tagsData={feedbackTags.data} />
            </View>
          </View>
        )
      }
    }
  }))


  return (

    <Document>
      <Page size="LETTER"
        style={styles.page}
      >
        {studentInfo()}
        {summary()}
        {details}
      </Page>
    </Document>

  )

}