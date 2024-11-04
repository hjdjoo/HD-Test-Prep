
import { useState } from "react";
import styles from "./PracticeContainer.module.css"
import { Question as QuestionType, useQuestionStore } from "@/src/stores/questionStore";

import Question from "@/src/components/practice/Practice.question.js";
import Answers from "@/src/components/practice/Practice.answers.js";
import Filter from "@/src/components/practice/Practice.filter.js";


export default function RandomPractice() {

  const { filteredQuestions } = useQuestionStore();

  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [currQuestion, setCurrQuestion] = useState<QuestionType>()
  const [response, setResponse] = useState<string>()


  async function getRandomQuestion() {

    const count = filteredQuestions.length;

    const randomIdx = Math.floor(Math.random() * count);

    setCurrQuestion(filteredQuestions[randomIdx]);

  }

  const ae = ["A", "B", "C", "D", "E"];
  const fk = ["F", "G", "H", "J", "K"];

  const answerChoices = currQuestion && ae.includes(currQuestion.answer) ? ae : fk


  return (
    <div id="random-practice-container"
      className={[styles.questionSize, styles.questionAlign].join(" ")}>
      <h4>Random Practice:</h4>
      <button onClick={() => {
        setShowSettings(!showSettings);
      }}>{`Customize Session`}</button>
      <div id="practice-filter" hidden={showSettings ? false : true}>
        <Filter />
      </div>
      <div className={[styles.questionSize, styles.questionAlign].join(" ")}>
        {currQuestion &&
          <>
            <Question question={currQuestion} />
            <Answers question={currQuestion} answerChoices={answerChoices} response={response} setResponse={setResponse} />
          </>
        }
      </div>
      <button onClick={getRandomQuestion}>
        {currQuestion ? "Next" : "Go!"}
      </button>
    </div>
  )
}