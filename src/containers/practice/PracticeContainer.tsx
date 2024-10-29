import styles from "./PracticeContainer.module.css";
import { useEffect } from "react"
import { useQuestionStore } from "@/src/stores/questions";
// import createSupabase from "@/utils/supabase/client";

/**
 * 
 * @returns Practice module:
 * 
 * The practice module should consist of the following components:
 * - Timer
 * - Question
 * - Answer choices
 * - Response
 * - Student feedback form
 * 
 * Upon selecting a response for the question, student submits
 * Answer is checked and a correct/incorrect response is given.
 * 
 * After each question, student can rate the question from 1-5 (easy-hard)
 * Student can submit a picture of their work or questions they have for their instructor.
 */
export default function PracticeContainer() {

  const { questions, setQuestions } = useQuestionStore();
  // const [practiceSettings, setPracticeSettings] = useState()
  // const supabase = createSupabase();

  useEffect(() => {

    (async () => {
      const res = await fetch("/api/db/questions/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      setQuestions(data);

    })();

    function getRandomQuestion() {

      const count = questions.length;



    }

    function handleClick() {



    }

    // async function getQuestions() {

    //   const { data, error } = await supabase
    //     .from("math_problems")
    //     .select("*")

    //   if (!data) {
    //     console.log("Couldn't retrieve items from DB")
    //     console.error(error);
    //     return;
    //   }
    //   if (data.length === 0) {
    //     console.log("No questions returned form Database. Did you check RLS settings?")
    //     return;
    //   }

    // }


  }, [])


  return (
    <div id="practice-container" className={[styles.container,].join(" ")}>
      <h1>
        Practice
      </h1>
      <button>{`Quick Start (Randomized Questions)`}</button>
      <p>Or</p>
      <button>{`Customize Session`}</button>
      {/* Settings Component */}
      {/* "Start" */}
      {/* Timer Component
    - Pressing "Go" renders the question and starts the timer. */}
      {/* Question Component
    - Should contain within its state a set of problems.*/}
      {/* Answer Component
    - Should  */}
      <div style={{ width: "30vw", height: "30vh", border: "1px solid black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        Test Space:
        <div>
          <button>
            Get Random Question
          </button>
        </div>
      </div>
    </div>
  )
}