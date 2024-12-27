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
      <h2 id="section-header" className={[
        styles.sectionHeaderText
      ].join(" ")}>Session Summary:</h2>
      <div id="summary-data"
        className={[
          styles.summaryAlign,
          styles.summarySize,
        ].join(" ")}>
        <div id="questions-answered"
          className={[
            styles.summaryItem,
            styles.summaryAlign,
          ].join(" ")}>
          <p className={[
            styles.textBold
          ].join(" ")}>Questions Answered: </p>
          <p className={[
            styles.detailMargin,
          ].join(" ")}>{questionsAnswered}</p>
        </div>
        <div id="questions-correct"
          className={[
            styles.summaryItem,
            styles.summaryAlign,
          ].join(" ")}>
          <p className={[
            styles.textBold
          ].join(" ")}>Questions Correct: </p>
          <p className={[
            styles.detailMargin,
          ].join(" ")}>{questionsCorrect}</p>
        </div>
      </div>
    </section>
  )

}