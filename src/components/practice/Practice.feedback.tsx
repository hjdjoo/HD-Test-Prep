import { Dispatch, SetStateAction, useState } from "react"
import styles from "./Practice.module.css"

import Autocomplete from "components/feedback/Feedback.Autocomplete"
// import debounce from "@/utils/debounce"


export type FeedbackForm = {
  questionId: number
  studentId: number
  correct: boolean
  response: string
  difficultyRating: number | null
  tags: number[]
  guessed: boolean | null
}

interface FeedbackFormProps {
  feedbackForm: FeedbackForm
  setFeedbackForm: Dispatch<SetStateAction<FeedbackForm | undefined>>
}

/**
 * 
 * Student should be able to:
 * - Select difficulty rating
 * - Add tags (optional)
 * - Say if it was a guess
 * - Add a picture of their work
 * - Add a note for the tutor.
 * 
 */
export default function FeedbackForm(props: FeedbackFormProps) {

  const { feedbackForm, setFeedbackForm } = props;

  const difficulties: { [level: string]: string } = {
    1: "Very Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very Hard"
  }

  const [difficulty, setDifficulty] = useState<number>(0);

  const difficultySelect = () => {

    return Object.keys(difficulties).map(level => {
      return (
        <div key={`difficulty-select-${level}`} className={[
          styles.difficultyLabelAlign,
          styles.difficultyLabelText,
        ].join(" ")}>
          <input type="radio" id={level} value={Number(level)} />
          <label htmlFor={level} className={styles.difficultyLabelText}>
            {difficulties[level]}
          </label>
        </div>
      )
    });

  }

  const difficultyRadios = difficultySelect();


  return (
    <div id="modal-backdrop"
      className={[
        styles.backdropStyle,
        styles.centerForm,
      ].join(" ")}>
      <div id="feedback-modal"
        className={[
          styles.formDisplay,
          styles.formAlign,
        ].join(" ")}>
        <h2>Feedback Form</h2>
        <div className={[
          styles.formSectionDetailText
        ].join(" ")}>
          <p>Responses help your instructor AND other students!</p>
        </div>
        <div id="response-confirm"
          className={[
            styles.formSectionHeading,
            styles.resultTextSize
          ].join(" ")}>
          <p>
            {feedbackForm.correct ? "You got it!" : "You missed this one :("}
          </p>
        </div>
        <div id="difficulty-feedback"
          className={[
            styles.formSectionAlign,
          ].join(" ")}>
          <div className={[styles.formSectionHeading].join(" ")}>
            <p>How hard did this feel?</p>
          </div>
          <div id="difficulty-radio-buttons"
            className={[
              styles.difficultyRadioAlign,
            ].join(" ")}>
            {difficultyRadios}
          </div>
        </div>
        <div id="guess-feedback"
          className={[
            styles.formSectionAlign,
          ].join(" ")}>
          <div className={[
            styles.formSectionHeading,
          ].join(" ")}>
            <div id="guess-input" className={[
              styles.guessInputAlign
            ].join(" ")}>
              <label htmlFor="guess">Check this if you took a guess:</label>
              <input type="checkbox" id="guess" />
            </div>
          </div>
        </div>
        <div id="instructor-feedback-section"
          className={[
            styles.formSectionAlign
          ].join(" ")}>
          <div className={[styles.formSectionHeading].join(" ")}>
            <p>Add a note or question for your instructor:</p>
          </div>
          <textarea id="instructor-feedback" />
        </div>
        <div id="image-upload-section"
          className={[
            styles.formSectionAlign
          ].join(" ")}>
          <div className={[styles.formSectionHeading].join(" ")}>
            <p>Upload a picture of your work for more context if you'd like:</p>
          </div>
          <input type="file" />
        </div>
        <div id={"add-tags-section"}>
          <div className={[styles.formSectionHeading].join(" ")}>
            <p>{"Add any tags that fit this problem (e.g., quadratic equations, linear equations, sohcahtoa, etc)"}
            </p>
          </div>
          <Autocomplete setFeedbackForm={setFeedbackForm}></Autocomplete>
        </div>
      </div>
    </div>
  )

}