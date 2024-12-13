import styles from "./Session.module.css"

interface SessionSummaryProps {
  questionsAnswered: number
  questionsCorrect: number
}

export default function SessionSummary(props: SessionSummaryProps) {

  const { questionsAnswered, questionsCorrect } = props;


  return (
    <section id="session-summary"
      className={[
        styles.sectionAlign,
        styles.sectionSize,
      ].join(" ")}>
      <h3>Session Summary:</h3>
      <div id="summary-data"
        className={[
          styles.summaryAlign,
          styles.summarySize,
        ].join(" ")}>
        <div id="questions-answered"
          className={[
            styles.summaryItem,
          ].join(" ")}>
          <p>Questions Answered: </p>
          <p>{questionsAnswered}</p>
        </div>
        <div id="questions-correct"
          className={[
            styles.summaryItem,
          ].join(" ")}>
          <p>Questions Correct: </p>
          <p>{questionsCorrect}</p>
        </div>
      </div>
    </section>
  )

}