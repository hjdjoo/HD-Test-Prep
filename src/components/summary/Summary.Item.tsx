import { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { Question } from "@/src/stores/questionStore";

import { useTagStore } from "@/src/stores/tagStore";

interface SummaryItemProps {
  question: Question
  studentResponse: ClientStudentResponse
  feedbackData?: ClientFeedbackFormData
}

export default function SummaryItem(props: SummaryItemProps) {

  const { question, studentResponse, feedbackData } = props;

  const difficulties: { [level: string]: string } = {
    1: "Very Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very Hard"
  }

  const isCorrect = studentResponse.response === question.answer;

  return (
    <>
      <div id={`summary-item-question-${question.id}-student-response-info`}>
        <div>
          {`Student Response: ${studentResponse.response}`}
        </div>
        <div>
          {isCorrect ? "Got it!" : "Missed >_<"}
        </div>
      </div>
      {
        feedbackData &&
        <div id={`summary-item-question-${question.id}-feedback-info`}>
          {
            feedbackData.difficultyRating &&
            <div id={`feedback-${feedbackData.id}-difficulty-rating`}>
              <p>Your Rating: </p>
              <p>{difficulties[feedbackData.difficultyRating]}</p>
            </div>
          }
          {
            feedbackData.guessed &&
            <div id={`feedback-${feedbackData.id}-guessed`}>
              You guessed on this one.
            </div>
          }
          {
            (feedbackData.comment && feedbackData.comment.length) &&
            <div id={`feedback-${feedbackData.id}-comment`}>
              <p>Message to instructor: </p>
              <p>{feedbackData.comment}</p>
            </div>
          }
          {
            feedbackData.tags.length &&
            <div id={`feedback-${feedbackData.id}-tags`}></div>
          }
        </div>
      }
    </>
  )

}