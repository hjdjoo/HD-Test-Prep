import ReportContainer from "@/src/features/sessionReport/containers/SessionReportContainer";
import { useStore } from "zustand";
import { userStore } from "@/src/stores/userStore";
import { useParams } from "react-router-dom";
import ErrorPage from "@/src/ErrorPage";


export default function SessionReport() {

  // check user;
  const user = useStore(userStore, (state) => state.user);

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