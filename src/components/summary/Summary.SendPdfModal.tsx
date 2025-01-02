import { Dispatch, SetStateAction } from "react"
import { useQuery } from "@tanstack/react-query";

import { pdf, renderToStream } from "@react-pdf/renderer";

import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

import { QuestionImageData, FeedbackData, TagsData } from "containers/pdf/PdfContainer"
import { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";

import createSupabase from "@/utils/supabase/client";

import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";
import getFeedbackById from "@/src/queries/GET/getFeedbackById";
import getTagsById from "@/src/queries/GET/getTagsById";
import sendSessionSummary from "@/src/queries/POST/sendSessionSummary";

import ErrorPage from "@/src/ErrorPage";
import PdfReport from "components/pdf/Pdf.Report";

interface SendPdfModalProps {
  sessionId: string
  setSendStatus: Dispatch<SetStateAction<"waiting" | "sending" | "sent">>
}

export default function SendPdfModal(props: SendPdfModalProps) {

  const { sessionId, setSendStatus } = props;

  const supabase = createSupabase();
  // get practice session responses based on ID;
  const { data: sessionResponseData, error: sessionResponseError } = useQuery({
    queryKey: ["studentResponses", sessionId],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error("No session ID detected, no report generated");
      }
      if (!Number(sessionId)) {
        throw new Error("Couldn't parse ID number from params");
      }
      const data = await getResponsesBySession(Number(sessionId));

      console.log("PdfContainer/useQuery/data: ", data);

      return data;
    }
  })

  const { data: questionImageData, error: questionImageError } = useQuery({
    queryKey: [`session${sessionId}QuestionImages`, sessionResponseData],
    queryFn: async () => {

      if (!sessionResponseData || !sessionResponseData.length) {
        return [{}] as QuestionImageData[]
      }

      const questionImageNames = sessionResponseData.map(response => {
        return `math/${String(response.questionId)}.png`
      });

      const { data, error } = await supabase.storage.from("questions").createSignedUrls(questionImageNames, 3600)

      if (error) {
        throw new Error("Error while getting signed URLs from supabase")
      }

      return data.map(item => {

        const studentResponse = sessionResponseData.filter(response => {
          return item.signedUrl.includes(String(response.questionId))
        })[0];

        console.log("PdfContainer/useQuery/return/data/map/studentResponse: ", studentResponse);

        return {
          responseId: studentResponse.id,
          imageUrl: item.signedUrl
        } as QuestionImageData
      })
    }
  })

  const { data: feedbackData, error: feedbackError } = useQuery({
    queryKey: [`feedbackData${sessionId}`, sessionResponseData],
    queryFn: async () => {

      if (!sessionResponseData || !sessionResponseData.length) {
        return [{}] as FeedbackData[]
      }

      const feedbackProms = sessionResponseData.map(async (response) => {
        if (response.feedbackId) {
          const feedbackData: ClientFeedbackFormData = await getFeedbackById(response.feedbackId);

          return {
            responseId: response.id,
            data: feedbackData
          } as FeedbackData

        } else {
          return Promise.resolve({} as FeedbackData)
        }
      })

      return Promise.all(feedbackProms);
    }
  })


  const { data: tagsData, error: tagsError } = useQuery({
    queryKey: [`session${sessionId}FeedbackTags`, feedbackData],
    queryFn: async () => {

      if (!feedbackData || !feedbackData.length) {
        return [{}] as TagsData[];
      }

      const tagsProms = feedbackData.map(async (item) => {

        if (!item.data.tags.length) {
          return Promise.resolve({} as TagsData)

        } else {

          const data = await getTagsById(item.data.tags);

          return {
            responseId: item.responseId,
            data: data
          } as TagsData;
        }

      })

      return Promise.all(tagsProms);

    }
  })

  const questionsAnswered = useQuestionsAnswered({ studentResponses: sessionResponseData });
  const questionsCorrect = useQuestionsCorrect({ studentResponses: sessionResponseData, questionsAnswered });

  async function handleSend() {

    if (!sessionResponseData || !feedbackData || !questionImageData || !tagsData) {
      console.log("incomplete data; returning...");
      return;
    }

    if (!questionsAnswered.length || !!questionsCorrect) {
      console.log("No data returned from hooks");
      return;
    }

    const Report = <PdfReport
      studentResponses={sessionResponseData}
      questionImageData={questionImageData}
      feedbackData={feedbackData}
      tagsData={tagsData}
      questionsAnswered={questionsAnswered}
      questionsCorrect={questionsCorrect}
    />

    const pdfBlob = await pdf(Report).toBlob();

    const data = await sendSessionSummary(pdfBlob, sessionId);

  }


  /* Renders: */
  if (sessionResponseError) {
    console.error(sessionResponseError)
    return (
      <ErrorPage />
    )
  }
  if (questionImageError) {
    console.error(questionImageError)
    return (
      <ErrorPage />
    )
  }
  if (feedbackError) {
    console.error(feedbackError)
    return (
      <ErrorPage />
    )
  }
  if (tagsError) {
    console.error(tagsError)
    return (
      <ErrorPage />
    )
  }

  if (!sessionResponseData || !feedbackData || !questionImageData || !tagsData) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <>
      <div>
        Sending report...
      </div>
    </>
  )

}