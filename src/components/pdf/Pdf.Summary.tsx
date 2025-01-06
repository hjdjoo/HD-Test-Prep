import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface PdfSessionSummaryProps {
  questionsAnswered: number
  questionsCorrect: number
}

export default function PdfSessionSummary(props: PdfSessionSummaryProps) {

  const { questionsAnswered, questionsCorrect } = props;

  return (
    <View>
      <section id="session-summary">
        <Text>
          Session Summary:
        </Text>
        <div id="summary-data">
          <div id="questions-answered">
            <Text>
              Questions Answered:
            </Text>
            <Text>
              {questionsAnswered}
            </Text>
          </div>
          <div id="questions-correct">
            <Text>
              Questions Correct:
            </Text>
            <Text>
              {questionsCorrect}
            </Text>
          </div>
        </div>
      </section>
    </View>
  )

}