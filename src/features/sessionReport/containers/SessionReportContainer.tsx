import { useState, useEffect, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import styles from "./SessionReportContainer.module.css";
import animations from "@/src/animations.module.css";

import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";

import Report from "@/src/features/sessionReport/components/SessionReport.Report";
import ErrorPage from "@/src/ErrorPage";
import ModalContainer from "containers/modal/ModalContainer";
// import SendPdfModal from "@/src/features/sessionReport/components/SessionReport.SendPdfModal";

const SendPdfModal = lazy(() => import("@/src/features/sessionReport/components/SessionReport.SendPdfModal"))

import Alert, { UserAlert } from "components/alert/Alert";

import Loading from "components/loading/Loading";

interface ReportContainerProps {
  sessionId: string
}
// get practice session ID from params;

export default function ReportContainer(props: ReportContainerProps) {

  const { sessionId } = props;
  const navigate = useNavigate();

  const [userAlert, setUserAlert] = useState<UserAlert>({
    message: "",
    timestamp: Date.now()
  });

  // // console.log(userAlert);

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

      // console.log("ReportContainer/useQuery/data: ", data);

      return data;
    }
  })

  const [sendStatus, setSendStatus] = useState<"waiting" | "sending" | "sent">("waiting");


  useEffect(() => {
    if (sendStatus === "sent") {
      navigate("/");
    }
  })

  if (sessionResponseError) {
    console.error(sessionResponseError)
    return (
      <ErrorPage />
    )
  }


  if (!sessionResponseData) {
    // console.log("No session data: loading...");
    return (
      <Loading />
    )
  }

  function handleSend() {
    if (!sessionResponseData || !sessionResponseData.length) {
      // console.log("sessionreportcontainer/sessionResponsedata: ", sessionResponseData)

      setUserAlert({
        severity: "warning",
        message: "Nothing to send!",
        timestamp: Date.now()
      })

      return;
    } else {
      setSendStatus("sending");
    }
  }


  return (
    <div id={`session-${sessionId}-report`}
      className={[
        styles.pageMargin,
        styles.pagePadding,
        styles.pageWidth,
        styles.centerReport,
      ].join(" ")}>

      <>
        <div id="report"
          className={[
            styles.sectionSpacing,
            styles.widthFull,
            styles.centerReport,
          ].join(" ")}>
          <Report
            studentResponses={sessionResponseData}
          />
        </div>
        <div id="session-report-actions-container"
          className={[
            styles.buttonsContainer,
            styles.widthFull,
          ].join(" ")}>
          <Link
            className={[
              styles.buttonSize,
              styles.sectionSpacing,
            ].join(" ")}
            to={`/report/pdf/${sessionId}`}>
            <button
              className={[
                styles.buttonStyle,
                styles.widthFull,
                animations.highlightPrimary,
              ].join(" ")}
            >
              View PDF Report
            </button>
          </Link>
          <button
            className={[
              styles.buttonStyleSecondary,
              styles.buttonSize,
              styles.sectionSpacing,
              animations.highlightPrimaryDark,
            ].join(" ")}
            onClick={(e) => {
              e.preventDefault();
              handleSend();
            }}>
            Send Report
          </button>
          <Link
            className={[
              styles.buttonSize,
              styles.sectionSpacing,
              styles.centerReport,
            ].join(" ")}
            to={`/`}>
            Back to Practice
          </Link>
        </div>
        {
          userAlert.severity &&
          <Alert alert={userAlert} />
        }
        {
          sendStatus === "sending" &&
          <ModalContainer>
            <Suspense fallback={<Loading />}>
              <SendPdfModal
                sessionId={sessionId}
                setSendStatus={setSendStatus}
              />
            </Suspense>
          </ModalContainer>
        }
      </>
    </div >
  )
}