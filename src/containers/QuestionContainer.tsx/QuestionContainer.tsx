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
}

interface StudentResponse {
  studentId: number,
  questionId: number,
  tags: number[],
  studentResponse: string,
  difficultyRating: number | null,
  feedbackId: number | null,
  timeTaken: number
  guessed: boolean
}

export default function QuestionContainer(props: QuestionContainerProps) {

  const { user } = useUserStore();
  const { question } = props;

  const [submitStatus, setSubmitStatus] = useState<"not submitted" | "submitting" | "submitted">("not submitted")
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);


  const [questionUrl, setQuestionUrl] = useState<string>("")
  const [time, setTime] = useState(0);

  const [response, setResponse] = useState<string>()
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm | undefined>(initFeedbackForm)
  const [studentRes, setStudentRes] = useState<StudentResponse | undefined>(initStudentResponse)
  const [errorMessage, setErrorMessage] = useState<string>("");


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

  // return blank student response form
  function initStudentResponse() {

    if (!user || !feedbackForm) return;

    return {
      ...feedbackForm,
      feedbackId: null,
      timeTaken: 0,
      guessed: false
    }

  }

  function initFeedbackForm() {

    if (!user) return;

    return {
      studentId: user.id,
      questionId: question.id,
      studentResponse: "",
      correct: false,
      difficultyRating: null,
      guessed: null,
      tags: [],
      instructorId: user.instructorId
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

    console.log("QuestionContainer/handleSubmit/feedbackForm: ", feedbackForm)
    console.log("QuestionContainer/handleSubmit/studentRes: ", studentRes)

    if (!response) {
      setErrorMessage("Please select an answer");
      return;
    };

    setErrorMessage("");

    if (submitStatus === "not submitted") {
      setSubmitStatus("submitting");
      setShowFeedback(true);
      return;
    }

    if (submitStatus === "submitting") {
      setSubmitStatus("submitted");

      // send call to DB to save student response;
      // 

      return;
    }
  }


  function checkAnswer() {

    return response === question.answer;

  }


  return (
    <div id="question-container"
      className={[styles.questionAlign].join(" ")}>
      <div>
        <h3>Question Number: {question.question}</h3>
        <Timer start={imageLoaded} submitStatus={submitStatus} time={time} setTime={setTime} />
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
        (showFeedback && feedbackForm) &&
        <Feedback feedbackForm={feedbackForm} setFeedbackForm={setFeedbackForm} />
      }
    </div>
  )
}