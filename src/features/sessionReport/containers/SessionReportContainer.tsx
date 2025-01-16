import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import styles from "./SessionReportContainer.module.css"

import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";

import Report from "@/src/features/sessionReport/components/SessionReport.Report";
import ErrorPage from "@/src/ErrorPage";
import ModalContainer from "containers/modal/ModalContainer";
import SendPdfModal from "@/src/features/sessionReport/components/SessionReport.SendPdfModal";

import Loading from "components/loading/Loading";

interface ReportContainerProps {
  sessionId: string
}
// get practice session ID from params;

export default function ReportContainer(props: ReportContainerProps) {

  const { sessionId } = props;

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

      console.log("ReportContainer/useQuery/data: ", data);

      return data;
    }
  })

  const [sendStatus, setSendStatus] = useState<"waiting" | "sending" | "sent">("waiting");


  if (sessionResponseError) {
    console.error(sessionResponseError)
    return (
      <ErrorPage />
    )
  }


  if (!sessionResponseData) {
    return (
      <Loading />
    )
  }


  return (
    <div id={`session-${sessionId}-report`}
      className={[
        styles.pageMargin,
        styles.pagePadding,
      ].join(" ")}>
      {
        (sessionResponseData) &&
        <>
          <Report
            studentResponses={sessionResponseData}
          />
          <button onClick={() => {
            setSendStatus("sending");
          }}>
            Send Report
          </button>
          <Link to={`/report/pdf/${sessionId}`}>
            <button>
              View PDF Report
            </button>
          </Link>
          {
            sendStatus === "sending" &&
            <ModalContainer>
              <SendPdfModal
                sessionId={sessionId}
                setSendStatus={setSendStatus}
              />
            </ModalContainer>
          }
        </>
      }
    </div>
  )
}