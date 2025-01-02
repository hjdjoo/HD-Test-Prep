import { useUserStore } from "../stores/userStore";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";

// import PdfSummary from "components/summary/Summary.Pdf";
// import PdfReportContainer from "containers/report/ReportContainer.Pdf";
import PdfContainer from "containers/pdf/PdfContainer";

export default function PdfReport() {

  const user = useUserStore((state) => state.user)

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
    <PdfContainer sessionId={sessionId} />
  )

}