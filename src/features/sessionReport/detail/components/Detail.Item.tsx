import styles from "./Detail.module.css"

import { ClientFeedbackFormData } from "@/src/_types/client-types";
import { ClientStudentResponse } from "@/src/_types/client-types";
import { Question } from "@/src/stores/questionStore";

interface DetailItemProps {
  question: Question
  studentResponse: ClientStudentResponse
  feedbackData?: ClientFeedbackFormData
  tagsData?: { [tagId: string]: string }
}

export default function DetailItem(props: DetailItemProps) {

  const { question, studentResponse, feedbackData, tagsData } = props;

  const difficulties: { [level: string]: string } = {
    1: "Very Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very Hard"
  }

  let tags = [] as string[];
  let tagsDisplay = [] as React.ReactNode[];

  if (feedbackData && feedbackData.tags && feedbackData.tags.length && tagsData) {
    feedbackData.tags.forEach(id => {
      if (tagsData[String(id)]) {
        tags.push(tagsData[String(id)]);
      }
    })
    console.log("SummaryItem/tags: ", tags);
  }

  if (tags.length) {

    tagsDisplay = tags.map(((tag, idx) => {

      return (
        <div key={`feedback-tag-${idx + 1}`}>
          <i>{tag}</i>
        </div>
      )

    }))

  }

  return (
    <>
      <div id={`summary-item-question-${question.id}-student-response-info`}
        className={[
          styles.detailsBg,
          styles.responseWidth,
          styles.detailsTextSm,
        ].join(" ")}>
        <div id={`summary-item-question-${question.id}-question-number`}
          className={[
            styles.detailsAlign,
          ].join(" ")}>
          <p className={[
            styles.dataHeaderAlign
          ].join(" ")}>
            {`Question Number:`}
          </p>
          <p className={[
            styles.dataMargin,
            styles.dataAlign,
          ].join(" ")}>{`${question.question}`}</p>
        </div>
        <div id={`summary-item-question-${question.id}-student-answer`}
          className={[
            styles.detailsAlign,
          ].join(" ")}>
          <p className={[
            styles.dataHeaderAlign
          ].join(" ")}>
            {`Student Response:`}
          </p>
          <p className={[
            styles.dataMargin,
            styles.dataAlign,
          ].join(" ")}>{`${studentResponse.response}`}</p>
        </div>
        <div id={`summary-item-question-${question.id}-answer`}
          className={[
            styles.detailsAlign,
          ].join(" ")}>
          <p className={[
            styles.dataHeaderAlign
          ].join(" ")}>Answer: </p>
          <p className={[
            styles.dataMargin,
            styles.dataAlign,
          ].join(" ")}>{question.answer}</p>
        </div>
        {
          feedbackData &&
          <div id={`summary-item-question-${question.id}-feedback-info`}
            className={[
              styles.feedbackBg,
            ].join(" ")}>
            {
              feedbackData.difficultyRating &&
              <div id={`feedback-${feedbackData.id}-difficulty-rating`}
                className={[
                  styles.detailsAlign,
                ].join(" ")}>
                <p className={[
                  styles.dataHeaderAlign
                ].join(" ")}>Student Rating: </p>
                <p className={[
                  styles.dataMargin,
                  styles.dataAlign,
                ].join(" ")}>{difficulties[feedbackData.difficultyRating]}</p>
              </div>
            }
            {
              feedbackData.guessed &&
              <div id={`feedback-${feedbackData.id}-guessed`}
                className={[
                  styles.detailsAlign,
                ].join(" ")}>
                This was a guess.
              </div>
            }
            {
              (feedbackData.comment && feedbackData.comment.length) &&
              <div id={`feedback-${feedbackData.id}-comment`}
                className={[
                  styles.detailsAlign,
                ].join(" ")}>
                <p className={[
                  styles.dataHeaderAlign
                ].join(" ")}>Message to instructor: </p>
                <p className={[
                  styles.dataMargin,
                  styles.dataAlign,
                ].join(" ")}>{feedbackData.comment}</p>
              </div>
            }
            {
              !!tags.length &&
              <div id={`feedback-${feedbackData.id}-tags`}
                className={[
                  styles.detailsAlign,
                ].join(" ")}>
                <p className={[
                  styles.dataHeaderAlign
                ].join(" ")}>Tags added: </p>
                <div id={`feedback-${feedbackData.id}-tags-display`}
                  className={[
                    styles.dataMargin,
                    styles.dataAlign,
                  ].join(" ")}>
                  {tagsDisplay}
                </div>
              </div>
            }
            {
              studentResponse.timeTaken &&
              <div id={`student-response-time`}
                className={[
                  styles.detailsAlign,
                ].join(" ")}>
                <p className={[
                  styles.dataHeaderAlign
                ].join(" ")}>Time taken: </p>
                <p className={[
                  styles.dataMargin,
                  styles.dataAlign,
                ].join(" ")}>
                  {`${studentResponse.timeTaken}s`}
                </p>
              </div>
            }
          </div>
        }
      </div>
    </>
  )

}