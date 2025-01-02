import { Text, View } from "@react-pdf/renderer";
import { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { Question } from "@/src/stores/questionStore";

interface PdfSessionItemProps {
  question: Question
  studentResponse: ClientStudentResponse
  feedbackForm?: ClientFeedbackFormData
  tagsData?: { [tagId: string]: string }
}

export default function PdfSessionItem(props: PdfSessionItemProps) {


  const { question, studentResponse, feedbackForm, tagsData } = props;

  const difficulties: { [level: string]: string } = {
    1: "Very Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very Hard"
  }

  let tags = [] as string[];
  let tagsDisplay = [] as React.ReactNode[];

  if (feedbackForm && feedbackForm.tags.length && tagsData) {
    feedbackForm.tags.forEach(id => {
      if (tagsData[String(id)]) {
        tags.push(tagsData[String(id)]);
      }
    })
    console.log("PdfSessionItem/tags: ", tags);
  }

  if (tags.length) {

    tagsDisplay = tags.map(((tag, idx) => {

      return (
        <div key={`feedback-tag-${idx + 1}`}>
          <Text>
            {tag}
          </Text>
        </div>
      )

    }))

  }

  return (
    <View>
      <div id={`summary-item-question-${question.id}-student-response-info`}>
        <div id={`summary-item-question-${question.id}-student-answer`}>
          <Text>
            Student Response:
          </Text>
          <Text>
            {`${studentResponse.response}`}
          </Text>
        </div>
        <div id={`summary-item-question-${question.id}-answer`}>
          <Text>
            Answer:
          </Text>
          <Text>
            {question.answer}
          </Text>
        </div>
        {
          feedbackForm &&
          <div id={`summary-item-question-${question.id}-feedback-info`}>
            {
              feedbackForm.difficultyRating &&
              <div id={`feedback-${feedbackForm.id}-difficulty-rating`}>
                <Text>
                  Student Rating:
                </Text>
                <Text>
                  {difficulties[feedbackForm.difficultyRating]}
                </Text>
              </div>
            }
            {
              feedbackForm.guessed &&
              <div id={`feedback-${feedbackForm.id}-guessed`}>
                <Text>
                  This was a guess.
                </Text>
              </div>
            }
            {
              (feedbackForm.comment && feedbackForm.comment.length) &&
              <div id={`feedback-${feedbackForm.id}-comment`}>
                <Text>
                  Message to instructor:
                </Text>
                <Text>
                  {feedbackForm.comment}
                </Text>
              </div>
            }
            {
              !!tags.length &&
              <div id={`feedback-${feedbackForm.id}-tags`}>
                <Text>
                  Tags added:
                </Text>
                <div id={`feedback-${feedbackForm.id}-tags-display`}
                >
                  {tagsDisplay}
                </div>
              </div>
            }
            {
              studentResponse.timeTaken &&
              <div id={`student-response-time`}>
                <Text>
                  Time taken:
                </Text>
                <Text>
                  {`${studentResponse.timeTaken}s`}
                </Text>
              </div>
            }
          </div>
        }
      </div>
    </View>
  )
};