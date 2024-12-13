import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import createSupabase from "@/utils/supabase/client";

import { Question } from "@/src/stores/questionStore";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession"
import { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";

import QuestionImage from "components/practice/Practice.questionImage";
import SummaryItem from "components/summary/Summary.Item";

import getFeedbackById from "@/src/queries/GET/getFeedbackById";


interface SummaryItemContainerProps {
  question: Question
  studentResponse: ClientStudentResponse
}

export default function SummaryItemContainer(props: SummaryItemContainerProps) {

  const { question, studentResponse } = props;

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [questionUrl, setQuestionUrl] = useState<string>("")

  const { data: imageUrlData, error: imageUrlError } = useQuery({
    queryKey: [`summaryQuestion${question.id}`],
    queryFn: async () => {
      const supabase = createSupabase();

      const { data, error } = await supabase
        .storage
        .from("questions")
        .createSignedUrl(`math/${String(question.id)}.png`, 3600)

      if (error) throw new Error(`Error while getting signed image URL for question: ${error.message}`);

      return data;

    }
  })

  const { data: feedbackData, error: feedbackError } = useQuery({
    queryKey: [`summaryQuestion${question.id}Feedback`],
    queryFn: async () => {

      if (!studentResponse.feedbackId) {
        return {} as ClientFeedbackFormData;
      }

      const data = await getFeedbackById(studentResponse.feedbackId);

      return data;

    }
  })

  useEffect(() => {

    if (imageUrlData) {
      setQuestionUrl(imageUrlData.signedUrl)
    }

  }, [imageUrlData])


  if (imageUrlError || feedbackError) {

    console.error(imageUrlError);
    console.error(feedbackError);

    return (
      <div>
        Something went wrong while getting images
      </div>
    )
  }

  return (
    <div id={`summary-item-question-${question.id}-container`}>
      <div id={`summary-item-question-${question.id}-image`}>
        <QuestionImage imageUrl={questionUrl} imageLoaded={imageLoaded} setImageLoaded={setImageLoaded} />
      </div>
      <SummaryItem question={question} studentResponse={studentResponse} feedbackData={feedbackData} />
    </div>
  )


}