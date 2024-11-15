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


  function getRandomQuestion() {

    const count = filteredQuestions.length;

    const randomIdx = Math.floor(Math.random() * count);

    setCurrQuestion(filteredQuestions[randomIdx]);

  }


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
      {!currQuestion &&
        <button onClick={getRandomQuestion}>
          Go!
        </button>
      }
    </div>
  )
}