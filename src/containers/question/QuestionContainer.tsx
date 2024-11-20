import { useState, useEffect } from "react";
import styles from "./QuestionContainer.module.css"

import createSupabase from "@/utils/supabase/client";

import { Question } from "@/src/stores/questionStore";
import { useUserStore } from "@/src/stores/userStore";

import Answers from "@/src/components/practice/Practice.answers.js";
import Timer from "components/practice/Practice.timer";
import QuestionImage from "@/src/components/practice/Practice.questionImage.js";
import Feedback from "components/practice/Practice.feedback";
import { type FeedbackForm } from "components/practice/Practice.feedback";

interface QuestionContainerProps {
  question: Question
  getNextQuestion: () => void;
}

export interface StudentResponse {
  studentId: number,
  questionId: number,
  response: string,
  feedbackId: number | null,
  timeTaken: number
}

// type StudentResponseQuery = {
//   studentId: number
//   questionId: number
//   feedbackId: number | null
//   timeTaken: number
//   studentResponse: string
// }

export default function QuestionContainer(props: QuestionContainerProps) {

  const { user } = useUserStore();
  const { question, getNextQuestion } = props;

  const [submitStatus, setSubmitStatus] = useState<"waiting" | "submitting" | "submitted">("waiting");

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  // const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const [questionUrl, setQuestionUrl] = useState<string>("")
  const [time, setTime] = useState(0);

  const [response, setResponse] = useState<string>("")
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm | undefined>(initFeedbackForm)
  const [studentRes, setStudentRes] = useState<StudentResponse | undefined>(initStudentResponse)
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [loadingNext, setLoadingNext] = useState<boolean>(false);


  const showFeedback = (submitStatus === "submitting")

  useEffect(() => {

    setImageLoaded(false);

    (async () => {
      const supabase = createSupabase();

      const { data } = await supabase
        .storage
        .from("questions")
        .createSignedUrl(`math/${String(question.id)}.png`, 3600)

      if (!data) {
        return;
      }

      setQuestionUrl(data.signedUrl);

    })()

  }, [question])

  useEffect(() => {

    if (submitStatus !== "submitted") return;

    async function submitResponse() {

      const finalStudentResponse = { ...studentRes };
      // finalStudentResponse.feedbackId;

      finalStudentResponse.timeTaken = time;

      console.log("final student response: ", finalStudentResponse);

      const res = await fetch("api/db/student_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalStudentResponse)
      })

      if (!res.ok) {
        console.error(res.status, res.statusText);
        throw new Error(`Error while submitting student response!`)
      }

      const data = await res.json();

      console.log(data);

      setSubmitStatus("waiting");
      getNextQuestion();

    }

    submitResponse();

  }, [submitStatus])

  // return blank student response form
  function initStudentResponse() {

    if (!user || !feedbackForm) return;

    return {
      studentId: user.id,
      questionId: question.id,
      response: response,
      feedbackId: null,
      timeTaken: 0,
    }

  }

  function initFeedbackForm() {

    if (!user) return;

    return {
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

    // console.log("QuestionContainer/handleSubmit/feedbackForm: ", feedbackForm);
    // console.log("QuestionContainer/handleSubmit/studentRes: ", studentRes);
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
      setSubmitStatus("submitting");
      // setShowFeedback(true);
      return;
    }

    if (submitStatus === "submitting") {
      // send call to DB to save student response;
      setSubmitStatus("submitted");
      return;
    }
  }



  return (
    <div id="question-container"
      className={[styles.questionAlign].join(" ")}>
      <div>
        <h3>Question Number: {question.question}</h3>
        <Timer start={imageLoaded && !showFeedback} submitStatus={submitStatus} time={time} setTime={setTime} />
      </div>

      <QuestionImage imageUrl={questionUrl} imageLoaded={imageLoaded} setImageLoaded={setImageLoaded} />
      {
        imageLoaded ?
          <Answers answerChoices={answerChoices} question={question} response={response} setResponse={setResponse} /> :
          <p>Loading...</p>
      }
      {imageLoaded &&
        <div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      }
      {
        errorMessage.length > 0 &&
        <p>{errorMessage}</p>
      }
      {
        (showFeedback && feedbackForm && studentRes) &&
        <Feedback question={question} studentResponse={studentRes} setStudentResponse={setStudentRes} feedbackForm={feedbackForm} setFeedbackForm={setFeedbackForm} setSubmitStatus={setSubmitStatus} />
      }
    </div>
  )
}