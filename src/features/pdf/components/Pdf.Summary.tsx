import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";

interface PdfSessionSummaryProps {
  questionsAnswered: number
  questionsCorrect: number
}

export default function PdfSessionSummary(props: PdfSessionSummaryProps) {

  const { questionsAnswered, questionsCorrect } = props;

  return (
    <View style={
      styles.container
    }>
      <View style={{
        ...styles.sectionHeading,
        ...styles.summary
      }}>
        <Text>
          Session Summary:
        </Text>
      </View>
      <View style={styles.summaryInfo}>
        <View style={styles.item}>
          <Text style={styles.itemName}>
            {`Questions Answered: `}
          </Text>
          <Text style={styles.itemDetail}>
            {questionsAnswered}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemName}>
            {`Questions Correct: `}
          </Text>
          <Text style={styles.itemDetail}>
            {questionsCorrect}
          </Text>
        </View>
      </View>
    </View >
  )

}