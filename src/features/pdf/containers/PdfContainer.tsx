import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";
import styles from "./PdfContainer.module.css"
import animations from "@/src/animations.module.css";
import { PDFViewer } from "@react-pdf/renderer";


import createSupabase from "@/utils/supabase/client";
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";
import getFeedbackById, { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";
import getTagsById from "@/src/queries/GET/getTagsById";

import { userStore } from "@/src/stores/userStore";
import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

import ErrorPage from "@/src/ErrorPage";
import PdfReport from "@/src/features/pdf/components/Pdf.Report";
import Loading from "components/loading/Loading";
import SendPdfModal from "../../sessionReport/components/SessionReport.SendPdfModal";
import ModalContainer from "containers/modal/ModalContainer";


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

export type TagsData = {
  responseId: number
  data: { [tagId: string]: string }
}

export default function PdfContainer(props: PdfContainerProps) {

  const supabase = createSupabase();

  const [sendStatus, setSendStatus] = useState<"waiting" | "sending" | "sent">("waiting");

  const user = useStore(userStore, (state) => state.user);
  const { sessionId } = props;
  // const user = useUserStore((state) => state.user);
  // get practice session responses based on ID, using query key to cache data for repeated calls (for example when sending PDF).
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

  if (!user) {
    console.error("No user detected.");
    return (
      <ErrorPage />
    )
  }
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

  if (!sessionResponseData || !questionImageData || !feedbackData || !tagsData) {

    console.log("PdfContainer: ")
    console.log("sessionResponseData", sessionResponseData)
    console.log("questionImageData", questionImageData)
    console.log("feedbackData", feedbackData)
    console.log("sessionResponseData", sessionResponseData)

    return (
      <Loading />
    )
  }

  return (
    <div id="pdf-summary-container" className={[
      styles.pageMargins,
      styles.centerReport
    ].join(" ")}>
      <PDFViewer
        className={[
          styles.viewerSize,
          styles.viewerFont,
          styles.sectionSpacing,
        ].join(" ")}
      >
        <PdfReport
          studentResponses={sessionResponseData}
          questionImageData={questionImageData}
          feedbackData={feedbackData}
          tagsData={tagsData}
          questionsAnswered={questionsAnswered}
          questionsCorrect={questionsCorrect}
          user={user}
        />
      </PDFViewer>
      <div className={[
        styles.fullWidth,
        styles.centerReport,
        styles.sectionSpacingLg,
      ].join(" ")}>
        <button id="send-pdf-button"
          className={[
            styles.buttonStyle,
            animations.highlightPrimaryDark,
          ].join(" ")}
          onClick={() => {
            setSendStatus("sending");
          }}>
          Send Report
        </button>
      </div>
      {sendStatus === "sending" &&
        <ModalContainer>
          <SendPdfModal sessionId={sessionId} setSendStatus={setSendStatus} />
        </ModalContainer>
      }
    </div>
  )
}