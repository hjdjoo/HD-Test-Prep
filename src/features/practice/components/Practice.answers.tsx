import { MouseEvent } from "react";
import styles from "./Practice.Components.module.css"
import type { Question } from "@/src/stores/questionStore";

interface AnswersProps {
  answerChoices: string[]
  question: Question
  response: string | undefined
  setResponse: (response: string) => void
}

export default function Answers(props: AnswersProps) {

  const { answerChoices, response, setResponse } = props;

  function handleClick(e: MouseEvent<HTMLInputElement>) {

    const { value } = e.target as HTMLInputElement;
    // setResponse(e.target.value)
    console.log(value)
    setResponse(value);

  }

  const radios = answerChoices.map(choice => {
    return (

      <label htmlFor={`answer-radio-${choice}`}
        key={`answer-radio-${choice}`}
        className={[
          `${choice === response && styles.radioButtonSelected}`,
          styles.radioButtonsWidth,
          styles.radioButtonsAlign,
          styles.radioButtonsMouse,

        ].join(" ")}
      >{choice}
        <input type="radio" id={`answer-radio-${choice}`} hidden={true} value={choice} onClick={handleClick} />
      </label>

    )
  })


  return (
    <div className={[
      styles.radioButtonsVertical, styles.answersWidth].join(" ")}>
      {/* {answersAE.includes(answer) && radiosAE}
      {answersFK.includes(answer) && radiosFK} */}
      {radios}
    </div>
  )
}