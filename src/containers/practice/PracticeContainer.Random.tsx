
import { useState } from "react";
import styles from "./PracticeContainer.module.css"
import { Question as QuestionType, useQuestionStore } from "@/src/stores/questionStore";

// import Question from "@/src/components/practice/Practice.questionImage";
import QuestionContainer from "containers/QuestionContainer.tsx/QuestionContainer";

import Filter from "@/src/components/practice/Practice.filter";


export default function RandomPractice() {

  const { filteredQuestions } = useQuestionStore();

  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [currQuestion, setCurrQuestion] = useState<QuestionType>()



  async function getRandomQuestion() {

    const count = filteredQuestions.length;

    const randomIdx = Math.floor(Math.random() * count);

    setCurrQuestion(filteredQuestions[randomIdx]);

  }



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
            <QuestionContainer question={currQuestion} />
          </>
        }
      </div>
      <button onClick={getRandomQuestion}>
        {currQuestion ? "Next" : "Go!"}
      </button>
    </div>
  )
}