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
import getResponsesById from "@/src/queries/GET/getResponsesById";

import startPracticeSession from "@/src/queries/POST/startPracticeSession";
import ErrorPage from "@/src/ErrorPage";
import SessionContainer from "containers/session/SessionContainer";
import getPracticeSession from "@/src/queries/GET/getPracticeSession";
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";

export default function RandomPractice() {

  const { filteredQuestions } = useQuestionStore();
  const sessionId = usePracticeSessionStore((state) => state.sessionId);
  const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses);
  const setSessionId = usePracticeSessionStore((state) => state.setSessionId)
  const setSessionResponses = usePracticeSessionStore((state) => state.setSessionResponses)
  const { user } = useUserStore();

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currQuestion, setCurrQuestion] = useState<QuestionType>();

  const [isPrevSession, setIsPrevSession] = useState<boolean>(false);

  // retrieve practice session id from Db or init/return new one.
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

  // StudentResponse query, updated as students answer questions
  const { data: studentResponseData, error: studentResponseError } = useQuery({
    queryKey: ["studentResponses", sessionResponses, sessionId],
    queryFn: async () => {
      console.log("PracticeContainer.Random/useQuery/studentResponses: ")
      if (!sessionId) {
        console.log("no session id detected. returning empty array.")
        return [];
      }
      if (!sessionResponses.length) {
        console.log("no session responses detected. returning empty array.")
        return [];
      }
      console.log("useQuery/studentResponses/sessionResponses: ", sessionResponses, sessionId);
      const data = await getResponsesBySession(sessionId);
      return data;
    },
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

    // return () => {
    //   console.log("running useEffect cleanup...")f
    //   window.removeEventListener("beforeunload", handleBeforeUnload)

    //   console.log("useEffect/cleanup/sessionResponses: ", sessionResponses)

    //   if (sessionId && !sessionResponses.length) {
    //     console.log("ending session...")
    //     setSessionId(null);
    //     endSession(sessionId, "abandoned");
    //   }

    // }
  }, [sessionId, practiceSessionData])

  useEffect(() => {

    if (!isPrevSession) return;
    if (!studentResponseData) return;
    if (!studentResponseData.length) return;

    const responseIds = studentResponseData.map(entry => entry.id);

    setSessionResponses(responseIds);

  }, [isPrevSession])

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