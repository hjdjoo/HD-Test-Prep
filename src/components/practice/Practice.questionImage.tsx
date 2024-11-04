import createSupabase from "@/utils/supabase/client";
import { type Question } from "@/src/stores/questionStore";
import { useEffect, useState, Suspense } from "react";

interface QuestionProps {
  question: Question
}

export default function QuestionImage(props: QuestionProps) {

  const { question } = props;
  const { id } = question;
  // console.log(question);
  const [questionUrl, setQuestionUrl] = useState<string>("")

  useEffect(() => {
    (async () => {
      const supabase = createSupabase();

      const { data } = await supabase
        .storage
        .from("questions")
        .createSignedUrl(`math/${String(id)}.png`, 3600)

      if (!data) return;

      setQuestionUrl(data.signedUrl);

    })()

  }, [question])

  // const questionUrl = getStorageUrl("math", String(questionIdx), "png");

  // console.log("Practice.question/questionUrl", questionUrl);


  return (

    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <img src={questionUrl} alt="sample question" />
      </Suspense>
    </div>

  )
}