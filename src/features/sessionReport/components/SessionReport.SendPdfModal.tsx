import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query";
import { pdf } from "@react-pdf/renderer";
import styles from "./Report.module.css"

import { userStore } from "@/src/stores/userStore";

import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

import { QuestionImageData, FeedbackData, TagsData } from "@/src/features/pdf/containers/PdfContainer"
import { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";

import createSupabase from "@/utils/supabase/client";

import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";
import getFeedbackById from "@/src/queries/GET/getFeedbackById";
import getTagsById from "@/src/queries/GET/getTagsById";
import sendSessionSummary from "@/src/queries/POST/sendSessionSummary";

import ErrorPage from "@/src/ErrorPage";
import PdfReport from "@/src/features/pdf/components/Pdf.Report";
import Spinner from "components/loading/Loading.Spinner";
import endSession from "@/src/queries/PATCH/endPracticeSession";

interface SendPdfModalProps {
  sessionId: string
  setSendStatus: Dispatch<SetStateAction<"waiting" | "sending" | "sent">>
}

export default function SendPdfModal(props: SendPdfModalProps) {

  const { sessionId, setSendStatus } = props;

  const sentRef = useRef<boolean>(false);

  const user = userStore.getState().user;

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


  useEffect(() => {

    if (sentRef.current === true) {
      console.log("already sent");
      return;
    }

    if (!sessionResponseData || !questionImageData || !feedbackData || !tagsData || !questionsAnswered.length || !!!questionsCorrect) {
      console.log("missing data, not sending yet");
      return;
    } else {
      sentRef.current = true;
      handleSend();
    }

  }, [sessionResponseData, questionImageData, feedbackData, tagsData, questionsAnswered, questionsCorrect])


  async function handleSend() {
    try {
      if (!user) {
        console.log("No user detected");
        return;
      }

      if (!sessionResponseData || !feedbackData || !questionImageData || !tagsData) {
        console.log("incomplete data; returning...");
        return;
      }

      if (!questionsAnswered.length || !!!questionsCorrect) {
        console.log("No data returned from hooks");
        return;
      }

      console.log("sending report...")
      const Report = <PdfReport
        studentResponses={sessionResponseData}
        questionImageData={questionImageData}
        feedbackData={feedbackData}
        tagsData={tagsData}
        questionsAnswered={questionsAnswered}
        questionsCorrect={questionsCorrect}
        user={user}
      />

      const pdfBlob = await pdf(Report).toBlob();

      console.log('sending session summary');
      await sendSessionSummary(pdfBlob, sessionId, String(user.id));

      console.log("ending session...")
      await endSession(Number(sessionId), "inactive");

      sentRef.current = false;
      setSendStatus("sent");

    } catch (e) {
      console.error(e);
      setSendStatus("waiting");
    }

  }


  /* Renders: */

  if (!user) {
    console.error("No user detected")
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


  return (
    <div id="send-pdf-modal-form"
      className={[
        styles.modalFormBackground,
        styles.sectionAlign,
      ].join(" ")}>
      {(!sessionResponseData || !feedbackData || !questionImageData || !tagsData) ?
        <div>
          Loading Data...
        </div> :
        <div>
          Sending report...
        </div>
      }
      <div>
        <Spinner />
      </div>
    </div>
  )

}