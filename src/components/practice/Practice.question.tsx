import createSupabase from "#root/utils/supabase/client";
import { type Question } from "#root/src/stores/questionStore";
import { useEffect, useState } from "react";
import { useQuestionStore } from "#root/src/stores/questionStore";

interface QuestionProps {
  question: number
}

export default function Question(props: QuestionProps) {

  const supabase = createSupabase();

  const { questions } = useQuestionStore();

  const { question } = props;

  const { id, question: questionIdx, testForm, category, problemType, answer, tags } = questions[question];

  const [questionUrl, setQuestionUrl] = useState<string>("")

  useEffect(() => {
    (async () => {
      const supabase = createSupabase();

      const { data } = await supabase
        .storage
        .from("questions")
        .createSignedUrl(`math/${String(questionIdx)}.png`, 3600)

      if (!data) return;

      setQuestionUrl(data.signedUrl);

    })()

  }, [])


  // const questionUrl = getStorageUrl("math", String(questionIdx), "png");

  console.log("Practice.question/questionUrl", questionUrl);


  return (

    <div>
      <img src={questionUrl} alt="sample question" />
    </div>

  )
}