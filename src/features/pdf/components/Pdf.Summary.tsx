import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface PdfSessionSummaryProps {
  questionsAnswered: number
  questionsCorrect: number
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    marginBottom: "0.25in"
  },
  sectionSpacing: {

  },
  summary: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  details: {
    display: "flex",
    flexDirection: "row",
  }
})

export default function PdfSessionSummary(props: PdfSessionSummaryProps) {

  const { questionsAnswered, questionsCorrect } = props;

  return (
    <View style={
      styles.container
    }>
      <View style={
        styles.heading
      }>
        <Text>
          Session Summary:
        </Text>
      </View>
      <View style={styles.summary}>
        <View style={styles.details}>
          <Text>
            {`Questions Answered: `}
          </Text>
          <Text>
            {questionsAnswered}
          </Text>
        </View>
        <View style={styles.details}>
          <Text>
            {`Questions Correct: `}
          </Text>
          <Text>
            {questionsCorrect}
          </Text>
        </View>
      </View>
    </View >
  )

}