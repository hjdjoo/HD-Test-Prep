import { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { Question } from "@/src/stores/questionStore";
import { View } from "@react-pdf/renderer";

interface PdfSessionItemProps {
  question: Question
  studentResponse: ClientStudentResponse
  feedbackForm?: ClientFeedbackFormData
}

export default function PdfSessionItem(props: PdfSessionItemProps) {

  const { question, studentResponse, feedbackForm } = props;

  return (
    <View>

    </View>
  )
}