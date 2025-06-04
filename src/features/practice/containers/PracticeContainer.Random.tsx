import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";
import styles from "./PracticeContainer.module.css"
import animations from "@/src/animations.module.css";


import QuestionContainer from "@/src/features/practice/containers/PracticeContainer.Question";
import Filter from "@/src/features/practice/components/Practice.filter";

import { Question as QuestionType, questionStore } from "@/src/stores/questionStore";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";
import { userStore } from "@/src/stores/userStore";

import endSession from "@/src/queries/PATCH/endPracticeSession";

import startPracticeSession from "@/src/queries/POST/startPracticeSession";
import ErrorPage from "@/src/ErrorPage";
import SessionReportContainer from "@/src/features/practice/containers/PracticeContainer.Report";
import getPracticeSession from "@/src/queries/GET/getPracticeSession";
import getResponsesBySession from "@/src/queries/GET/getResponsesBySession";

import ContinuePracticeModal from "@/src/features/practice/components/Practice.continue";

export default function RandomPractice() {

  const filteredQuestions = useStore(questionStore, (state) => state.filteredQuestions);

  const sessionId = usePracticeSessionStore((state) => state.sessionId);
  const sessionResponses = usePracticeSessionStore((state) => state.sessionResponses);
  const sessionQuestions = usePracticeSessionStore((state) => state.sessionQuestions);
  const setSessionId = usePracticeSessionStore((state) => state.setSessionId)
  const setSessionResponses = usePracticeSessionStore((state) => state.setSessionResponses)
  const setSessionQuestions = usePracticeSessionStore((state) => state.setSessionQuestions);

  const user = userStore.getState().user;
  const sessionResponsesRef = useRef(sessionResponses);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currQuestion, setCurrQuestion] = useState<QuestionType>();

  const [isPrevSession, setIsPrevSession] = useState<boolean>(false);

  // retrieve practice session id from Db or init/return new one.
  const { data: practiceSessionData, error: practiceSessionError } = useQuery({
    queryKey: ["practice_session", user, sessionId],
    queryFn: async () => {

      if (!user) {
        throw new Error(`No user detected; no practice session started`);
      };
      if (sessionId) return Promise.resolve({ id: sessionId });

      // console.log("getting active session data...");
      const activeSessionData = await getPracticeSession(user.id);

      if (!activeSessionData) {
        // console.log("no active session detected; starting new session");
        const data = await startPracticeSession(user.id, "random");
        // console.log("New practice session started. Setting session ID.")
        setSessionId(data.id)
        return data;
      }

      // console.log("active session detected. Setting session ID.")
      setIsPrevSession(true);
      setSessionId(activeSessionData.id);

      return activeSessionData;
    }
  })

  // StudentResponse query, updated as students answer questions
  const { data: studentResponseData, error: studentResponseError } = useQuery({
    queryKey: ["studentResponses", sessionResponses, sessionId],
    queryFn: async () => {
      // console.log("PracticeContainer.Random/useQuery/studentResponses: ")
      if (!sessionId) {
        // console.log("no session id detected. returning empty array.")
        return [];
      }
      const data = await getResponsesBySession(sessionId);
      return data;
    },
  });

  useEffect(() => {

    sessionResponsesRef.current = sessionResponses;

  }, [sessionResponses]);

  // Session management effect - mark empty sessions as abandoned, set practice sessionId for user.

  useEffect(() => {

    function handleBeforeUnload() {
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

    if (!studentResponseData || !studentResponseData.length) return;

    const questionIds = studentResponseData.map(row => row.questionId)

    const responseIds = studentResponseData.map(row => row.id);

    setSessionQuestions(questionIds);
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
    const count = filteredQuestions.length;

    const randomIdx = Math.floor(Math.random() * count);

    if (!sessionQuestions.includes(randomIdx)) {
      setCurrQuestion(filteredQuestions[randomIdx]);
    } else {
      getRandomQuestion();
    }

  }


  return (
    <div id="random-practice-container"
      className={[
        styles.container,
        styles.sectionMargin,
      ].join(" ")}>
      <button id="show-settings-button"
        className={[
          styles.buttonMarginY,
          styles.buttonStyle,
          styles.buttonSize,
          animations.highlightPrimary,
        ].join(" ")}
        onClick={() => {
          setShowSettings(!showSettings);
        }}>{`${showSettings ? "Close Filters" : "Customize Session"}`}</button>
      {
        (user && sessionId && isPrevSession) &&
        <div id="prev-session-modal"
          style={{
            zIndex: 10
          }}>
          <ContinuePracticeModal
            user={user}
            sessionId={sessionId}
            setIsPrevSession={setIsPrevSession}
            practiceType="random" />
        </div>
      }
      {
        showSettings &&
        <div id="practice-filter"
          hidden={showSettings ? false : true}
          className={[
            styles.container,
          ].join(" ")}>
          <Filter />
        </div>
      }
      {currQuestion &&
        <div id="question-module" className={[
          styles.questionModuleStyle,
          styles.questionModuleAlign,
          styles.questionModuleWidth,
          styles.nextButtonAlign,
        ].join(" ")}>
          <QuestionContainer
            question={currQuestion}
            getNextQuestion={getRandomQuestion}
          />
          <div>
            <button id="next-question-button"
              className={[
                styles.nextButtonStyle,
                styles.nextButtonBorder,
                styles.nextButtonMargin,
                styles.nextButtonRound,
                animations.highlightPrimary,
              ].join(" ")}
              onClick={getRandomQuestion}
            >{">"}</button>
            <p>Next</p>
          </div>
        </div>
      }
      {
        !currQuestion &&
        <button onClick={getRandomQuestion}
          className={[
            styles.sectionMargin,
            styles.buttonStyle,
            styles.buttonSize,
            animations.highlightPrimary,
          ].join(" ")}>
          Start
        </button>
      }
      {
        (sessionId && studentResponseData) &&
        <>
          <br />
          <br />
          <SessionReportContainer
            studentResponses={studentResponseData} />
        </>
      }
    </div>
  )
}