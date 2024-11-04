import { useState, useEffect } from "react";

import QuestionImage from "@/src/components/practice/Practice.questionImage.js";
import Answers from "@/src/components/practice/Practice.answers.js";
import { Question } from "@/src/stores/questionStore";

import createSupabase from "@/utils/supabase/client";


interface QuestionContainerProps {
  question: Question
}

export default function QuestionContainer(props: QuestionContainerProps) {

  const { question } = props;

  const [response, setResponse] = useState<string>()
  const [questionUrl, setQuestionUrl] = useState<string>("")
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);


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

  const ae = ["A", "B", "C", "D", "E"];
  const fk = ["F", "G", "H", "J", "K"];

  const answerChoices = ae.includes(question.answer) ? ae : fk


  return (
    <div>
      <QuestionImage imageUrl={questionUrl} imageLoaded={imageLoaded} setImageLoaded={setImageLoaded} />
      {imageLoaded ?
        <Answers answerChoices={answerChoices} question={question} response={response} setResponse={setResponse} /> :
        <p>Loading...</p>
      }
    </div>
  )
}