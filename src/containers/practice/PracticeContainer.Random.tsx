import { useEffect, useState } from "react";
import styles from "./PracticeContainer.module.css"
import { useQuery } from "@tanstack/react-query";


import QuestionContainer from "containers/question/QuestionContainer";
import Filter from "@/src/components/practice/Practice.filter";

import { Question as QuestionType, useQuestionStore } from "@/src/stores/questionStore";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { useUserStore } from "@/src/stores/userStore";

// import removeSession from "@/src/queries/DELETE/removeSession";
import endSession from "@/src/queries/PATCH/endPracticeSession";
import getResponses from "@/src/queries/GET/getResponses";

import startPracticeSession from "@/src/queries/POST/startPracticeSession";
import ErrorPage from "@/src/ErrorPage";
import SessionContainer from "containers/session/SessionContainer";
import getPracticeSession from "@/src/queries/GET/getPracticeSession";


export default function RandomPractice() {

  const { filteredQuestions } = useQuestionStore();
  const sessionId = usePracticeSessionStore((state) => state.sessionId);
  const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses);
  const setSessionId = usePracticeSessionStore((state) => state.setSessionId)
  const { user } = useUserStore();

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currQuestion, setCurrQuestion] = useState<QuestionType>();

  const [isPrevSession, setIsPrevSession] = useState<boolean>(false);

  const { data: practiceSessionData, error: practiceSessionError } = useQuery({
    queryKey: ["practice_session", user],
    queryFn: async () => {

      if (!user) {
        throw new Error(`No user detected; no practice session started`);
      };
      if (sessionId) return Promise.resolve({ id: sessionId });

      const activeSessionData = await getPracticeSession(user.id);

      if (!activeSessionData) {
        console.log("no active session detected; starting new session");
        const data = await startPracticeSession(user?.id, "random");

        console.log(data);
        setIsPrevSession(false);
        return data;
      }

      console.log("active session detected.")
      console.log(activeSessionData);
      setIsPrevSession(true);
      return activeSessionData;
    }
  })


  const { data: studentResponseData, error: studentResponseError } = useQuery({
    queryKey: ["studentResponses", sessionResponses],
    queryFn: async () => {
      console.log("useQuery/practice_session/sessionResponses: ", sessionResponses)
      const data = await getResponses(sessionResponses);
      return data;
    }
  })




  // Session management effect - mark empty sessions as abandoned, set practice sessionId for user.

  console.log("PracContainer.Random.tsx/outside of useEffect/sessionResponses: ", sessionResponses)

  useEffect(() => {

    console.log("QuestionContainer/useEffect: ")
    console.log("sessionId, sessionResponses: ", sessionId, sessionResponses)

    function handleBeforeUnload() {
      console.log("useEffect/handleBeforeUnload/sessionResponses: ", sessionResponses)
      if (sessionId && !sessionResponses.length) {

        endSession(sessionId, "abandoned");
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    if (practiceSessionData) {
      setSessionId(practiceSessionData.id)
    }

    return () => {
      console.log("running useEffect cleanup...")
      window.removeEventListener("beforeunload", handleBeforeUnload)

      console.log("useEffect/cleanup/sessionResponses: ", sessionResponses)

      if (sessionId && !sessionResponses.length) {
        console.log("ending session...")
        setSessionId(null);
        endSession(sessionId, "abandoned");
      }

    }
  }, [sessionId, practiceSessionData])

  if (practiceSessionError || studentResponseError) {
    console.error("practiceSessionError: ", practiceSessionError);
    console.error("studentResponseError: ", studentResponseError);
    return (
      <ErrorPage />
    )
  }


  function getRandomQuestion() {

    console.log("getting random question...")

    const count = filteredQuestions.length;

    const randomIdx = Math.floor(Math.random() * count);

    setCurrQuestion(filteredQuestions[randomIdx]);

  }

  console.log("QuestionContainer/sessionId: ", sessionId);


  return (
    <div id="random-practice-container"
      className={[styles.container].join(" ")}>
      <h3>Random Practice:</h3>
      <button id="show-settings-button" className={[styles.buttonMarginY].join(" ")} onClick={() => {
        setShowSettings(!showSettings);
      }}>{`Customize Session`}</button>
      <div id="practice-filter" hidden={showSettings ? false : true}>
        <Filter />
      </div>
      <div className={[].join(" ")}>
        {currQuestion &&
          <div id="question-module" className={[
            styles.nextButtonAlign,
          ].join(" ")}>
            <QuestionContainer question={currQuestion} getNextQuestion={getRandomQuestion} />
            <div>
              <button id="next-question-button"
                className={[
                  styles.nextButtonBorder,
                  styles.nextButtonMargin,
                  styles.nextButtonRound,
                  styles.buttonActive,
                ].join(" ")}
                onClick={getRandomQuestion}
              >{">"}</button>
              <p>Next</p>
            </div>
          </div>
        }
      </div>
      <br />
      {(currQuestion && sessionId) && <SessionContainer studentResponses={studentResponseData || []} />}
      {!currQuestion &&
        <button onClick={getRandomQuestion}>
          Go!
        </button>
      }

    </div>
  )
}