import { useRef } from "react";
import { Text, View, Link } from "@react-pdf/renderer";

import { ClientFeedbackFormData, ClientStudentResponse } from "@/src/_types/client-types";
import { Question } from "@/src/stores/questionStore";
import { styles } from "../styles";

interface PdfSessionItemProps {
  question: Question
  studentResponse: ClientStudentResponse
  feedbackForm?: ClientFeedbackFormData
  tagsData?: { [tagId: string]: string }
}

export default function PdfSessionItem(props: PdfSessionItemProps) {

  const renderCountRef = useRef(1);

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

    console.log(tagsData);

    feedbackForm.tags.forEach(id => {
      if (tagsData[String(id)]) {
        tags.push(tagsData[String(id)]);
      }
    })
    // console.log("PdfSessionItem/tags: ", tags);
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

    const itemText: { [key: string]: string } = {
      comment: "Message to Instructor",
      difficultyRating: "Student Rating",
      guessed: "This was a guess",
    }

    return Object.keys(feedbackForm).map((key, idx) => {

      const itemName = itemText[key];

      let item: React.ReactNode;

      switch (key) {
        case "comment":
          item = (
            <>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ ...styles.questionTitle, marginBottom: "0.05in" }}>
                  {`${itemName}: `}
                </Text>
                <Text style={styles.questionInfoDetails}>
                  {feedbackForm[key].length ? feedbackForm[key] : "N/A"}
                </Text>
              </View>
            </>
          )
          break;
        case "difficultyRating":
          item = (
            <>
              <Text style={styles.questionTitle}>
                {`${itemName}: `}
              </Text>
              <Text style={styles.questionInfoDetails}>
                {difficulties[feedbackForm[key]]}
              </Text>
            </>
          )
          break;
        case "guessed":
          item = (
            <>
              <View style={{ width: "100%", textAlign: "right" }}>
                <Text style={{ fontFamily: "Helvetica-Oblique" }}>
                  {`${itemName}.`}
                </Text>
              </View>
            </>
          )

          break;
      }

      if (itemText[key] && feedbackForm[key]) {
        // console.log(itemText[key]);
        renderCountRef.current += 1;
        console.log("renderCountRef.current: ", renderCountRef.current);
        const background = (renderCountRef.current % 2 === 0) ? styles.itemEven : styles.itemOdd

        const itemStyle = {
          ...styles.questionInfo,
          ...background
        }

        return (
          <View key={`question-${question.id}-feedback-item-${idx + 1}`}
            style={{ ...itemStyle }}>
            {item}
          </View>
        )
      }
    }).filter((item) => {
      // console.log(item)
      // console.log(item === undefined);
      return item !== undefined
    });
  }

  function renderOtherItems() {

    const output: React.ReactNode[] = [];

    if (tags.length) {
      renderCountRef.current += 1;

      const tagsBackground = (renderCountRef.current % 2 === 0) ? styles.itemEven : styles.itemOdd

      const tagsStyle = {
        ...styles.questionInfo,
        ...tagsBackground
      }

      output.push(
        (
          <>
            <View style={tagsStyle}>
              <Text style={styles.questionTitle}>
                Tags added:
              </Text>
              <View style={styles.questionInfoDetails}>
                {tagsDisplay}
              </View>
            </View>
          </>
        )
      )
    }

    const timeBackground = (renderCountRef.current % 2 === 0) ? styles.itemOdd : styles.itemEven;

    const timeStyle = {
      ...styles.questionInfo,
      ...timeBackground
    };

    output.push(
      (
        <>
          <View style={timeStyle}>
            <Text style={styles.questionTitle}>
              Time taken:
            </Text>
            <Text style={styles.questionInfoDetails}>
              {`${studentResponse.timeTaken}s`}
            </Text>
          </View>
        </>
      )
    )

    const linkBackground = (renderCountRef.current % 2 === 0) ? styles.itemEven : styles.itemOdd;

    const linkStyle = {
      ...styles.questionInfo,
      ...linkBackground
    };

    if (feedbackForm?.imageUrl && feedbackForm.imageUrl.length) {
      output.push(
        (
          <>
            <View style={linkStyle}>
              <Text style={styles.questionTitle}>
                Student's Work:
              </Text>
              <Text style={styles.questionInfoDetails}>
                <Link src={feedbackForm.imageUrl}>
                  {`Link to Image`}
                </Link>
              </Text>
            </View>
          </>
        )
      )
    }

    renderCountRef.current = 1;

    return output;
  }


  const feedbackItems = feedbackForm ? renderFeedbackItems(feedbackForm) : [];

  const otherItems = renderOtherItems();

  return (
    <View style={styles.questionInfoContainer}>
      <View style={{ ...styles.questionInfo, ...styles.itemOdd }}>
        <Text style={styles.questionTitle}>
          Question Number:
        </Text>
        <Text>
          {`${question.question}`}
        </Text>
      </View>
      <View style={{ ...styles.questionInfo, ...styles.itemEven }}>
        <Text style={styles.questionTitle}>
          Student Response:
        </Text>
        <Text>
          {`${studentResponse.response}`}
        </Text>
      </View>
      <View style={{ ...styles.questionInfo, ...styles.itemOdd }}>
        <Text style={styles.questionTitle}>
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
        otherItems
      }
    </View>
  )
};