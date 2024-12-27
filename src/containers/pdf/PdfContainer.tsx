import styles from "./PdfContainer.module.css"
import { useQuery } from "@tanstack/react-query";
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";
import ErrorPage from "@/src/ErrorPage";
import PdfReport from "components/pdf/Pdf.Report";
import getFeedbackById, { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";
import { PDFViewer } from "@react-pdf/renderer";
import createSupabase from "@/utils/supabase/client";

interface PdfContainerProps {
  sessionId: string
}

export type QuestionImageData = {
  responseId: number
  imageUrl: string
}

export type FeedbackData = {
  responseId: number
  data: ClientFeedbackFormData
}

export default function PdfContainer(props: PdfContainerProps) {

  const supabase = createSupabase();
  const { sessionId } = props;
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

      console.log("ReportContainer/useQuery/data: ", data);

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

      const feedbackPromises = sessionResponseData.map(async (response) => {
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
      return Promise.all(feedbackPromises)
    }
  })


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

  if (!sessionResponseData || !questionImageData || !feedbackData) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div id="pdf-summary-container" className={[
      styles.centerReport
    ].join(" ")}>
      <PdfReport studentResponses={sessionResponseData} questionImageData={questionImageData} feedbackData={feedbackData} />
    </div>
  )
}