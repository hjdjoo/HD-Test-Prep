import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";
import styles from "./PdfContainer.module.css"
import animations from "@/src/animations.module.css";
import { PDFViewer } from "@react-pdf/renderer";


import { supabase } from "@/utils/supabase/client";
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";
import getFeedbackById from "@/src/queries/GET/getFeedbackById";
import getTagsById from "@/src/queries/GET/getTagsById";

import { ClientFeedbackFormData } from "@/src/_types/client-types";

import { userStore } from "@/src/stores/userStore";
import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

import ErrorPage from "@/src/ErrorPage";
import Loading from "components/loading/Loading";
import ModalContainer from "containers/modal/ModalContainer";
import PdfReport from "@/src/features/pdf/components/Pdf.Report";
import SendPdfModal from "../../sessionReport/components/SessionReport.SendPdfModal";


// const SendPdfModal = lazy(() => import("@/src/features/sessionReport/components/SessionReport.SendPdfModal"))
// const PdfReport = lazy(() => import("@/src/features/pdf/components/Pdf.Report"))

interface PdfContainerProps {
  sessionId: string
}

export type QuestionImageData = {
  responseId: number
  imageUrl: string
}

export type FeedbackData = {
  responseId?: number
  data: ClientFeedbackFormData | undefined
}

export type TagsData = {
  responseId: number
  data: { [tagId: string]: string }
}

export default function PdfContainer(props: PdfContainerProps) {

  // 

  const navigate = useNavigate();

  const [sendStatus, setSendStatus] = useState<"waiting" | "sending" | "sent">("waiting");

  const user = useStore(userStore, (state) => state.user);


  useEffect(() => {
    if (sendStatus === "sent") {
      navigate("/");
    }
  })

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

      // console.log("PdfContainer/useQuery/sessionResponseData: ", data);

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

      // console.log("questionImageData/imageNames: ", questionImageNames);

      const { data, error } = await supabase.storage.from("questions").createSignedUrls(questionImageNames, 3600 * 24 * 7,)

      if (error) {
        throw new Error("Error while getting signed URLs from supabase")
      }
      const responseCache: number[] = [];

      // console.log(data);
      return data.map(item => {
        // console.log(item.signedUrl);

        const studentResponse = sessionResponseData.filter((response, idx) => {
          if (responseCache.includes(idx)) {
            return false;
          }
          if (item.signedUrl.includes(`${String(response.questionId)}.png`)) {
            // console.log("caching response idx");
            responseCache.push(idx);
          }
          return item.signedUrl.includes(`${String(response.questionId)}.png`)

        })[0];

        // console.log("PdfContainer/useQuery/return/data/map/studentResponse: ", studentResponse);


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
        return [{ data: undefined }] as FeedbackData[]
      }

      const feedbackProms = sessionResponseData.map(async (response) => {
        if (response.feedbackId) {
          const feedbackData: ClientFeedbackFormData = await getFeedbackById(response.feedbackId);

          return {
            responseId: response.id,
            data: feedbackData
          } as FeedbackData

        } else {
          return Promise.resolve({ responseId: response.id, data: undefined } as FeedbackData)
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

        if (!item || !item.data || !item.data.tags || !item.data.tags.length) {
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

    // console.log("PdfContainer: ")
    // console.log("sessionResponseData", sessionResponseData)
    // console.log("questionImageData", questionImageData)
    // console.log("feedbackData", feedbackData)
    // console.log("tagsData", tagsData)


    return (
      <Loading />
    )
  }

  return (
    <div id="pdf-summary-container" className={[
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
          <SendPdfModal
            sessionId={sessionId}
            setSendStatus={setSendStatus} />
        </ModalContainer>
      }
    </div>
  )
}