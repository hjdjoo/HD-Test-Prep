import { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { Question } from "@/src/stores/questionStore";

interface SummaryItemProps {
  question: Question
  studentResponse: ClientStudentResponse
  feedbackData?: ClientFeedbackFormData
  tagsData?: { [tag: string]: string }
}

export default function SummaryItem(props: SummaryItemProps) {

  const { question, studentResponse, feedbackData, tagsData } = props;

  const difficulties: { [level: string]: string } = {
    1: "Very Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very Hard"
  }

  const isCorrect = studentResponse.response === question.answer;

  let tags = [] as string[];
  let tagsDisplay = [] as React.ReactNode[];

  if (feedbackData && feedbackData.tags.length && tagsData) {
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
          <p>{tag}</p>
        </div>
      )

    }))

  }

  return (
    <>
      <div id={`summary-item-question-${question.id}-student-response-info`}>
        <div>
          {`Student Response: ${studentResponse.response}`}
        </div>
        <div>
          {isCorrect ? "Correct" : "Miss"}
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
            !!tags.length &&
            <div id={`feedback-${feedbackData.id}-tags`}>
              <p>Tags added: </p>
              {tagsDisplay}
            </div>
          }
        </div>
      }
    </>
  )

}