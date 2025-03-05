import styles from "./Alert.module.css";
import { useState, useEffect } from "react";

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

  const currStyle = alert.severity ? alertStyles[alert.severity] : ""

  const [hideAlert, setHideAlert] = useState<boolean>(false);

  useEffect(() => {
    setHideAlert(false);
  }, [alert])

  return (
    <div id="alert"
      className={[
        styles.position,
        styles.size,
        currStyle
      ].join(" ")}
      hidden={hideAlert}
    >
      <div>
        <p>{alert.message}</p>
      </div>
      <div>
        <button onClick={(e) => {
          e.preventDefault();
          setHideAlert(!hideAlert);
        }}>
          X
        </button>
      </div>
    </div>
  )

}