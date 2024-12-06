import SessionSummary from "components/session/Session.Summary"
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";


interface SessionContainerProps {
  studentResponses: ClientStudentResponse[]
}


export default function SessionContainer(props: SessionContainerProps) {

  // const { sessionId, sessionResponses } = usePracticeSessionStore();
  // const sessionId = usePracticeSessionStore((state) => state.sessionId);
  // const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses)

  const { studentResponses } = props;
  console.log("SessionContainer/studentResponses: ", studentResponses)
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