import Report from "components/summary/Summary.Report";
import { useUserStore } from "@/src/stores/userStore";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";
import ErrorPage from "@/src/ErrorPage";
import useQuestionsAnswered from "@/src/hooks/useQuestionsAnswered";
import useQuestionsCorrect from "@/src/hooks/useQuestionsCorrect";

// get practice session ID from params;

export default function ReportContainer() {

  // check user;
  const user = useUserStore((state) => state.user)

  // get practice session ID from params;
  const { id: sessionId } = useParams();

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

      return data;
    }
  })

  const questionsAnswered = useQuestionsAnswered({ studentResponses: sessionResponseData });
  const questionsCorrect = useQuestionsCorrect({ studentResponses: sessionResponseData, questionsAnswered })

  if (sessionResponseError) {
    console.error(sessionResponseError)
    return (
      <ErrorPage />
    )
  }
  if (!user) {
    console.error("No user detected - not authorized");
    return (
      <ErrorPage />
    )
  }


  return (
    <>
      {
        (sessionResponseData) &&
        <Report
          studentResponses={sessionResponseData}
          questionsAnswered={questionsAnswered}
          questionsCorrect={questionsCorrect}
        />
      }
    </>
  )
}