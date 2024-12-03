import { useEffect, useState } from "react";
import SessionSummary from "components/session/Session.Summary"
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { useQuery } from "@tanstack/react-query"
import { StudentResponse } from "containers/question/QuestionContainer"

import getResponses from "@/src/queries/GET/getResponses";


interface SessionContainerProps {
  studentResponses: StudentResponse[]
}


export default function SessionContainer(props: SessionContainerProps) {

  // const { sessionId, sessionResponses } = usePracticeSessionStore();
  // const sessionId = usePracticeSessionStore((state) => state.sessionId);
  // const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses)

  const { studentResponses } = props;
  // const [studentResponses, setStudentResponses] = useState<StudentResponse[]>([]);

  // const { data: responseData } = useQuery({
  //   queryKey: ["studentResponses"],
  //   queryFn: async () => {
  //     const data = await getResponses(sessionResponses);
  //     return data;
  //   }
  // })

  // useEffect(() => {
  //   if (responseData) {
  //     console.log("SessionContainer/useEffect/responseData: ", responseData)
  //     setStudentResponses(responseData)
  //   }
  // }, [responseData])


  // if (!sessionId) {
  //   return (
  //     <div>
  //       No session detected!
  //     </div>
  //   )
  // }

  return (
    <div>
      <SessionSummary studentResponses={studentResponses} />
    </div>
  )

}