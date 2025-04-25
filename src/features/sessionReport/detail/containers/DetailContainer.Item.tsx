import styles from "./DetailContainer.module.css"

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import createSupabase from "@/utils/supabase/client";

import { Question } from "@/src/stores/questionStore";
import { ClientStudentResponse } from "@/src/_types/client-types"
import { ClientFeedbackFormData } from "@/src/_types/client-types";

import QuestionImage from "@/src/features/practice/components/Practice.questionImage";
import SummaryItem from "@/src/features/sessionReport/detail/components/Detail.Item";

import getFeedbackById from "@/src/queries/GET/getFeedbackById";
import getTagsById from "@/src/queries/GET/getTagsById";

interface DetailItemContainerProps {
  question: Question
  studentResponse: ClientStudentResponse
}

export default function DetailItemContainer(props: DetailItemContainerProps) {

  const { question, studentResponse } = props;

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [questionUrl, setQuestionUrl] = useState<string>("");

  // // console.log("SummaryItemContainer/question: ", question)

  const { data: imageUrlData, error: imageUrlError } = useQuery({
    queryKey: [`summaryQuestion${question.id}`, question],
    queryFn: async () => {
      const supabase = createSupabase();

      const { data, error } = await supabase
        .storage
        .from("questions")
        .createSignedUrl(`math/${String(question.id)}.png`, 3600, {
          transform: {
            width: 600,
            height: 600,
            quality: 70,
            resize: "contain"
          }
        })

      if (error) throw new Error(`Error while getting signed image URL for question: ${error.message}`);

      return data;

    }
  })

  const { data: feedbackData, error: feedbackError } = useQuery({
    queryKey: [`feedback${studentResponse.feedbackId}`],
    queryFn: async () => {

      if (!studentResponse.feedbackId) {
        return {} as ClientFeedbackFormData;
      }

      const data = await getFeedbackById(studentResponse.feedbackId);

      return data;

    }
  })

  const { data: tagsData, error: tagsError } = useQuery({
    queryKey: [`feedback${studentResponse.feedbackId}Tags`, feedbackData],
    queryFn: async () => {

      if (!studentResponse.feedbackId || !feedbackData || !feedbackData.tags.length) {
        return {} as { [tag: string]: string };
      }

      const data = await getTagsById(feedbackData.tags);
      // // console.log("SummaryContainer.Item/useQuery/tagsData: ", data)

      return data;
    }
  })



  useEffect(() => {

    if (imageUrlData) {
      setQuestionUrl(imageUrlData.signedUrl)
    }

  }, [imageUrlData])


  if (imageUrlError) {
    console.error(imageUrlError);
    return (
      <div>
        Something went wrong while getting images
      </div>
    )
  }
  if (feedbackError) {
    console.error(feedbackError);
    return (
      <div>
        Something went wrong while getting feedback data
      </div>
    )
  }
  if (tagsError) {
    console.error(tagsError);
    return (
      <div>
        Something went wrong while getting tags data
      </div>
    )
  }

  return (
    <div id={`summary-item-question-${question.id}-container`}
      className={[
        styles.detailAlign,
      ].join(" ")}>
      <div id={`summary-item-question-${question.id}-image`}
        className={[
          styles.itemImageSize,
        ].join(" ")}>
        <QuestionImage imageUrl={questionUrl} imageLoaded={imageLoaded} setImageLoaded={setImageLoaded} />
      </div>
      {
        imageLoaded &&
        <SummaryItem question={question} studentResponse={studentResponse} feedbackData={feedbackData} tagsData={tagsData} />
      }
    </div>
  )
}