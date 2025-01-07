import ReportContainer from "containers/report/ReportContainer";
import { useUserStore } from "@/src/stores/userStore";
import { useParams } from "react-router-dom";
import ErrorPage from "@/src/ErrorPage";


export default function Report() {

  // check user;
  const user = useUserStore((state) => state.user)

  // get practice session ID from params;
  const { id: sessionId } = useParams();

  if (!user) {
    console.error("No user detected - not authorized");
    return (
      <ErrorPage />
    )
  }

  return (
    <>
      {!!sessionId &&
        <ReportContainer sessionId={sessionId}></ReportContainer>}
    </>
  )


}