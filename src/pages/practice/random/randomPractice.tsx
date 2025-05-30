import RandomPractice from "@/src/features/practice/containers/PracticeContainer.Random"
import styles from "./randomPractice.module.css";

export default function RandomPracticePage() {

  return (
    <div
      id="random-practice-page"
      className={[
        styles.container
      ].join(" ")}>
      <RandomPractice />
    </div>
  )
}