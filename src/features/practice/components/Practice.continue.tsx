import styles from "./Practice.Components.module.css"
import animations from "@/src/animations.module.css";
import { Dispatch, SetStateAction } from "react";


import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore"

import endSession from "@/src/queries/PATCH/endPracticeSession";
import startPracticeSession from "@/src/queries/POST/startPracticeSession";

import { User } from "@/src/stores/userStore";

import ModalContainer from "containers/modal/ModalContainer"


interface ContinuePracticeModalProps {
  user: User
  sessionId: number
  setIsPrevSession: Dispatch<SetStateAction<boolean>>
  practiceType: "random" | "structured"
}

export default function ContinuePracticeModal(props: ContinuePracticeModalProps) {

  const { user, sessionId, setIsPrevSession, practiceType } = props;

  const setSessionId = usePracticeSessionStore((state) => state.setSessionId);
  const setSessionResponses = usePracticeSessionStore((state) => state.setSessionResponses)

  function handleContinue() {

    setIsPrevSession(false);

  }

  async function handleNewSession() {

    try {

      await endSession(sessionId, "inactive");

      const data = await startPracticeSession(user.id, practiceType);

      // console.log(data.id);
      setSessionId(data.id);
      setSessionResponses([]);
      setIsPrevSession(false);

    } catch (e) {
      console.error(e);
    }

  }

  return (
    <ModalContainer>
      <div id="continue-practice-session-form"
        className={[
          styles.centerForm,
          styles.modalStyle,
        ].join(" ")}>
        <div className={[
          styles.sectionMargin,
          styles.centerForm,
        ].join(" ")}>
          <p>
            Previous session detected.
          </p>
          <p>
            Continue session?
          </p>
        </div>
        <button onClick={handleContinue}
          className={[
            styles.sectionMargin,
            styles.modalButtonStyle,
            styles.modalButtonSize,
            animations.highlightPrimary,
          ].join(" ")}>
          Continue Previous Session
        </button>
        <button onClick={handleNewSession}
          className={[
            styles.sectionMargin,
            styles.modalButtonStyle,
            styles.modalButtonSize,
            animations.highlightPrimary,
          ].join(" ")}>
          Start New Session
        </button>
      </div>
    </ModalContainer>
  )

}