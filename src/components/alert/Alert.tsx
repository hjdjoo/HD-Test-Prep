import styles from "./Alert.module.css";
import animations from "@/src/animations.module.css";
import { useState, useEffect } from "react";

import SuccessIcon from "@/src/assets/icons/successIcon.svg"
import WarningIcon from "@/src/assets/icons/warningIcon.svg"
import ErrorIcon from "@/src/assets/icons/errorIcon.svg"

type Severity = "success" | "info" | "warning" | "error"

export type UserAlert = {
  severity?: Severity
  message: string
  timestamp: number
}

interface UserAlertProps {
  alert: UserAlert
  // children?: React.ReactNode
}

export default function Alert(props: UserAlertProps) {

  const { alert } = props;

  const alertStyles: {
    success: string,
    info: string,
    warning: string,
    error: string,
  } = {
    success: styles.success,
    info: styles.info,
    warning: styles.warning,
    error: styles.error
  }

  function renderIcon() {
    switch (alert.severity) {
      case "info":
      case "warning":
        return <WarningIcon />;
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
    }
  }

  const icon = renderIcon();

  const currStyle = alert.severity ? alertStyles[alert.severity] : ""

  const [hideAlert, setHideAlert] = useState<boolean>(false);

  useEffect(() => {
    setHideAlert(false);

    if (alert.severity !== "error") {
      setTimeout(() => {
        setHideAlert(true);
      }, 4000);
    }

  }, [alert])

  // console.log("hideAlert: ", hideAlert)

  return (
    <div id="alert"
      className={[
        styles.position,
        styles.size,
        styles.align,
        styles.padding,
        styles.border,
        currStyle
      ].join(" ")}
      style={{
        display: hideAlert ? "none" : "flex"
      }}
    >
      <div className={[
        styles.align,
        styles.justifyCenter,
        styles.grow1,
      ].join(" ")}>
        <div style={{
          height: "1.5rem",
          width: "1.5rem",
          marginTop: "auto",
          marginBottom: "auto",
          marginRight: "1rem",
        }}>
          {icon}
        </div>
        <p>{alert.message}</p>
      </div>
      <div className={[
      ].join(" ")}>
        <button onClick={(e) => {
          e.preventDefault();
          setHideAlert(!hideAlert);
        }}>
          X
        </button>
      </div>
      {alert.severity !== "error" &&
        <div id="alert-timer"
          className={[
            styles.alertTimerPosition,
            styles.alertTimerSize,
            styles.alertTimerStyle,
            styles.align,
            styles.justifyCenter,
            animations.shrinkTimer,
          ].join(" ")}>
        </div>
      }
    </div>
  )

}