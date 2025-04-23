import { lazy, Suspense } from "react";
import { userStore } from "@/src/stores/userStore";
import { useParams } from "react-router-dom";
import ErrorPage from "@/src/ErrorPage";
import Loading from "components/loading/Loading";

const PdfContainer = lazy(() => import("@/src/features/pdf/containers/PdfContainer"))

export default function PdfReport() {

  const user = userStore.getState().user;

  // get practice session ID from params;
  const { id: sessionId } = useParams();

  if (!user) {
    console.error("No user detected - not authorized");
    return (
      <ErrorPage />
    )
  }

  if (!sessionId) {
    console.error("No session Id detected");
    return (
      <ErrorPage />
    )

  }


  return (
    <Suspense fallback={<Loading />}>
      <PdfContainer sessionId={sessionId} />
    </Suspense>

  )

}