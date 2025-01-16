import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import styles from "./PracticeContainer.module.css";
import animations from "@/src/animations.module.css";

import createSupabase from "@/utils/supabase/client";

import { Question } from "@/src/stores/questionStore";
import { useUserStore } from "@/src/stores/userStore";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";

import Answers from "@/src/features/practice/components/Practice.answers.js";
import Timer from "@/src/features/practice/components/Practice.timer";
import QuestionImage from "@/src/features/practice/components/Practice.questionImage.js";
import Feedback from "@/src/features/practice/components/Practice.feedback";
import { type FeedbackForm } from "@/src/features/practice/components/Practice.feedback";
import ErrorPage from "@/src/ErrorPage";
import Spinner from "components/loading/Loading.Spinner";


interface QuestionContainerProps {
  question: Question
  getNextQuestion: () => void;
}

export interface StudentResponse {
  id?: number
  sessionId: number
  studentId: number,
  questionId: number,
  response: string,
  feedbackId: number | null,
  timeTaken: number,
}

// type StudentResponseQuery = {
//   studentId: number
//   questionId: number
//   feedbackId: number | null
//   timeTaken: number
//   studentResponse: string
// }

export default function QuestionContainer(props: QuestionContainerProps) {

  // const sessionId = usePracticeSession();
  const { sessionId, addResponse } = usePracticeSessionStore();
  const { user } = useUserStore();
  const { question, getNextQuestion } = props;

  const [submitStatus, setSubmitStatus] = useState<"waiting" | "submitting" | "submitted">("waiting");

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  // const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const [questionUrl, setQuestionUrl] = useState<string>("")
  const [time, setTime] = useState(0);

  const [response, setResponse] = useState<string>("")
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm | undefined>()
  const [studentRes, setStudentRes] = useState<StudentResponse | undefined>()
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [timerStart, setTimerStart] = useState<boolean>(false);

  const [loadingNext, setLoadingNext] = useState<boolean>(false);

  const showFeedback = (submitStatus === "submitting");

  const { data: imageUrlData, status: imageUrlStatus, error: imageUrlError } = useQuery({
    queryKey: ["imageUrl", question],
    queryFn: async () => {

      const supabase = createSupabase();

      const { data, error } = await supabase
        .storage
        .from("questions")
        .createSignedUrl(`math/${String(question.id)}.png`, 3600)

      if (error) {
        throw new Error(`Error while getting signed Url: ${error.message}`)
      }

      return data.signedUrl
    }
  })

  // fetch and set question image url
  useEffect(() => {

    if (imageUrlData) {
      setQuestionUrl(imageUrlData);
    }

  }, [imageUrlData]);

  useEffect(() => {

    if (imageLoaded) {
      setTimerStart(true);
    } else {
      setTimerStart(false);
    }
  }, [imageLoaded])

  useEffect(() => {

    console.log("QuestionContainer/useEffect/question: ", question);

    setFeedbackForm(initFeedbackForm(sessionId));
    setStudentRes(initStudentResponse(sessionId));

  }, [question]);

  // useEffect(() => {

  //   if (!sessionId) return;
  //   console.log("QuestionContainer/useEffect/sessionId found: ", sessionId)
  //   initStudentResponse(sessionId);

  // }, [sessionId])

  // submit student response once feedback is submitted.
  useEffect(() => {

    console.log("QuestionContainer/useEffect/submitStatus: ", submitStatus)

    if (submitStatus !== "submitted") return;

    console.log("submitting student response...")
    submitResponse();

  }, [submitStatus])

  async function submitResponse() {

    try {

      console.log("submitResponse: starting...")

      const finalStudentResponse = { ...studentRes };
      // finalStudentResponse.feedbackId;

      finalStudentResponse.timeTaken = time;

      // console.log("final student response: ", finalStudentResponse);

      const res = await fetch("api/db/student_responses/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalStudentResponse)
      })

      // console.log("submitResponse/res: ", res);

      if (!res.ok) {
        console.error(res.status, res.statusText);
        throw new Error(`Error while submitting student response!`)
      }

      const data = await res.json();

      // console.log("submitResponse/data: ", data);
      console.log("adding response...")
      addResponse(data.id);
      console.log("getting next question...")
      getNextQuestion();
      console.log("resetting submit status and response...")
      setSubmitStatus("waiting");
      // console.log("")
      setResponse("");
    } catch (e) {
      console.error(e);
    }

  }

  // return blank student response form
  function initStudentResponse(sessionId: number | null) {

    if (!sessionId) {
      console.log(`No sessionId detected. No response initiated.`)
      return;
    };
    if (!user) {
      console.log(`No user detected. No response initiated.`)
      return;
    };

    return {
      sessionId: sessionId,
      studentId: user.id,
      questionId: question.id,
      response: response,
      feedbackId: null,
      timeTaken: 0,
    }

  }
  // return blank feedback form
  function initFeedbackForm(sessionId: number | null) {

    if (!sessionId) {
      console.log(`No sessionId detected. No feedback form initiated.`)
      return;
    };
    if (!user) {
      console.log(`No user detected. No feedback form initiated.`)
      return;
    };

    return {
      sessionId: sessionId,
      studentId: user.id,
      questionId: question.id,
      comment: "",
      difficultyRating: null,
      guessed: null,
      tags: [],
      instructorId: user.instructor_id,
      imageUrl: ""
    }
  }


  // set up answer choices for question;
  const ae = ["A", "B", "C", "D", "E"];
  const fk = ["F", "G", "H", "J", "K"];
  const answerChoices = ae.includes(question.answer) ? ae : fk

  // submit button -> should load feedback form
  // feedback form -> submitting feedback should also submit response
  // exiting feedback form should submit the response without feedback.
  async function handleSubmit() {

    if (!feedbackForm || !studentRes) {
      console.log("no feedback form or student response form detected; check user")
      return;
    }

    if (!response) {
      setErrorMessage("Please select an answer");
      return;
    };

    setErrorMessage("");

    if (submitStatus === "waiting") {

      const updatedStudentRes = structuredClone(studentRes);

      updatedStudentRes.response = response;

      setStudentRes(updatedStudentRes);
      // show feedback form.
      setSubmitStatus("submitting");
      // setShowFeedback(true);
      return;
    }

    if (submitStatus === "submitting") {
      // send call to DB to save student response;
      console.log("QuestionContainer/handleSubmit/submitStatus: ", submitStatus)
      setSubmitStatus("submitted");
      return;
    }
  }


  if (imageUrlStatus === "pending") {
    return (
      <div>
        Loading...
      </div>
    )
  }

  if (imageUrlStatus === "error") {

    console.error("QuesetionContainer/imageUrlError: ", imageUrlError.message)

    return (
      <ErrorPage />
    )
  }

  return (
    <div id="question-container"
      className={[
        styles.questionAlign
      ].join(" ")}>
      <div id="timer-container"
        className={[
          styles.container,
          styles.sectionMarginSm,
        ].join(" ")}>
        <h3>Question Number: {question.question}</h3>
        <Timer start={timerStart} submitStatus={submitStatus} time={time} setTime={setTime} />
      </div>
      <QuestionImage imageUrl={questionUrl} imageLoaded={imageLoaded} setImageLoaded={setImageLoaded} />
      {
        imageLoaded ?
          <div id="answer-choices-container"
            className={[
              styles.container,
              styles.sectionMarginSm,
            ].join(" ")}>
            <Answers answerChoices={answerChoices} question={question} response={response} setResponse={setResponse} />
          </div> :
          <Spinner />
      }
      {imageLoaded &&
        <div id="submit-answer-button"
          className={[
            styles.sectionMargin,
          ].join(" ")}>
          <button
            className={[
              styles.buttonStyleSecondary,
              animations.highlightPrimaryDark,
            ].join(" ")}
            onClick={handleSubmit}>Submit</button>
        </div>
      }
      {
        errorMessage.length > 0 &&
        <p>{errorMessage}</p>
      }
      {
        (showFeedback && feedbackForm && studentRes) &&
        <Feedback
          question={question}
          studentResponse={studentRes} setStudentResponse={setStudentRes} feedbackForm={feedbackForm} setFeedbackForm={setFeedbackForm} setSubmitStatus={setSubmitStatus}
        />
      }
    </div>
  )
}