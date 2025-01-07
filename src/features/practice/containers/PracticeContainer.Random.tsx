import { useEffect, useState, useRef } from "react";
import styles from "./PracticeContainer.module.css"
import { useQuery } from "@tanstack/react-query";


import QuestionContainer from "@/src/features/practice/containers/PracticeContainer.Question";
import Filter from "@/src/features/practice/components/Practice.filter";

import { Question as QuestionType, useQuestionStore } from "@/src/stores/questionStore";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { useUserStore } from "@/src/stores/userStore";

import endSession from "@/src/queries/PATCH/endPracticeSession";

import startPracticeSession from "@/src/queries/POST/startPracticeSession";
import ErrorPage from "@/src/ErrorPage";
import SessionContainer from "containers/session/SessionContainer";
import getPracticeSession from "@/src/queries/GET/getPracticeSession";
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";

import ContinuePracticeModal from "@/src/features/practice/components/Practice.continue";

export default function RandomPractice() {

  const { filteredQuestions } = useQuestionStore();

  const sessionId = usePracticeSessionStore((state) => state.sessionId);
  const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses);
  const setSessionId = usePracticeSessionStore((state) => state.setSessionId)
  const setSessionResponses = usePracticeSessionStore((state) => state.setSessionResponses)

  const { user } = useUserStore();

  const sessionResponsesRef = useRef(sessionResponses)

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

      // const inactiveSessionData = 

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
      console.log("useQuery/studentResponses/sessionResponses: ", sessionResponses, sessionId);
      const data = await getResponsesBySession(sessionId);
      return data;
    },
  });

  useEffect(() => {

    sessionResponsesRef.current = sessionResponses;

  }, [sessionResponses]);

  // Session management effect - mark empty sessions as abandoned, set practice sessionId for user.



  useEffect(() => {
    console.log("running unload registration useEffect...")
    console.log("sessionId, practiceSessionData: ", sessionId)

    function handleBeforeUnload() {
      console.log("useEffect/handleBeforeUnload/sessionResponses: ", sessionResponses)
      if (sessionId) {

        if (!sessionResponsesRef.current.length) {
          endSession(sessionId, "abandoned");
          return;
        }

      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    if (practiceSessionData) {
      setSessionId(practiceSessionData.id)
    }

  }, [])

  useEffect(() => {
    console.log("detected previous session, running session Id useEffect...")

    if (!isPrevSession) return;
    if (!practiceSessionData) return;

    setSessionId(practiceSessionData.id)

  }, [isPrevSession, practiceSessionData]);

  useEffect(() => {

    if (!studentResponseData || !studentResponseData.length) return;

    const responseIds = studentResponseData.map(row => row.id);

    setSessionResponses(responseIds);

  }, [studentResponseData])

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


  return (
    <div id="random-practice-container"
      className={[styles.container].join(" ")}>
      <h3>Random Practice:</h3>
      <button id="show-settings-button"
        className={[styles.buttonMarginY].join(" ")}
        onClick={() => {
          setShowSettings(!showSettings);
        }}>{`Customize Session`}</button>
      {
        (user && sessionId && isPrevSession) &&
        <div id="prev-session-modal">
          <ContinuePracticeModal user={user} sessionId={sessionId} setIsPrevSession={setIsPrevSession} practiceType="random" />
        </div>
      }
      <div id="practice-filter"
        hidden={showSettings ? false : true}>
        <Filter />
      </div>
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
      <br />
      {
        !currQuestion &&
        <button onClick={getRandomQuestion}>
          Go!
        </button>
      }
      {
        (!isPrevSession && sessionId) &&
        <SessionContainer studentResponses={studentResponseData || []} />
      }
    </div>
  )
}