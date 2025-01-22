import { Text, View } from "@react-pdf/renderer";
import { ClientFeedbackFormData } from "@/src/queries/GET/getFeedbackById";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession";
import { Question } from "@/src/stores/questionStore";
import { styles } from "../styles";

interface PdfSessionItemProps {
  question: Question
  studentResponse: ClientStudentResponse
  feedbackForm?: ClientFeedbackFormData
  tagsData?: { [tagId: string]: string }
}

// const styles = StyleSheet.create({

//   container: {

//   },
//   itemName: {

//   },
//   itemValue: {

//   },

// })

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
        <View key={`question-${question.id}-tag-${idx + 1}`}>
          <Text>
            {tag}
          </Text>
        </View>
      )
    }))
  }

  function renderFeedbackItems(feedbackForm: { [key: string]: any }) {

    let renderedItems = 0;

    const itemText: { [key: string]: string } = {
      comment: "Message to Instructor",
      difficultyRating: "Student Rating",
      guessed: "This was a guess",
      tags: "Tags Added",
    }

    return Object.keys(feedbackForm).map((key, idx) => {

      const itemName = itemText[key];

      console.log("key: ", key);
      console.log("feedbackForm[key]: ", feedbackForm[key]);

      let item: React.ReactNode;

      switch (key) {
        case "comment":
          item = (
            <>
              <Text >
                {`${itemName}: `}
              </Text>
              <Text>
                {feedbackForm[key].length ? feedbackForm[key] : "N/A"}
              </Text>
            </>
          )
          break;
        case "difficultyRating":
          item = (
            <>
              <Text >
                {`${itemName}: `}
              </Text>
              <Text>
                {difficulties[feedbackForm[key]]}
              </Text>
            </>
          )
          break;
        case "guessed":
          item = (
            <>
              <Text >
                {`${itemName}`}
              </Text>
            </>
          )
          break;
      }

      if (itemText[key]) {
        renderedItems++;
        return (
          <View key={`question-${question.id}-feedback-item-${idx + 1}`}
            style={styles.questionInfo}>
            {item}
          </View>
        )
      }
    })
  }

  const feedbackItems = feedbackForm ? renderFeedbackItems(feedbackForm) : [];

  return (
    <View>
      <View style={styles.questionInfo}>
        <Text style={{
          fontWeight: "bold",
        }}>
          Student Response:
        </Text>
        <Text>
          {`${studentResponse.response}`}
        </Text>
      </View>
      <View style={styles.questionInfo}>
        <Text>
          Answer:
        </Text>
        <Text>
          {question.answer}
        </Text>
      </View>
      {
        feedbackForm &&
        feedbackItems
      }
      {
        !!tags.length &&
        <View>
          <Text>
            Tags added:
          </Text>
          <View>
            {tagsDisplay}
          </View>
        </View>
      }
      {
        studentResponse.timeTaken &&
        <View>
          <Text>
            Time taken:
          </Text>
          <Text>
            {`${studentResponse.timeTaken}s`}
          </Text>
        </View>
      }


    </View>
  )
};