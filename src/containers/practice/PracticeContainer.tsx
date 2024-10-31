import styles from "./PracticeContainer.module.css";
import { useEffect, useState } from "react"
import { useQuestionStore } from "#root/src/stores/questionStore";
import { useCategoryStore } from "#root/src/stores/categoryStore";

import Question from "@/src/components/practice/Practice.question.js";


import Filter from "@/src/components/practice/Practice.filter.js";

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

  const { setCategories, setProblemTypes } = useCategoryStore();
  const { filter, filteredQuestions, setQuestions, filterQuestions } = useQuestionStore();
  // const [practiceSettings, setPracticeSettings] = useState()
  // const supabase = createSupabase();
  const [randomQuestion, setRandomQuestion] = useState<number>(NaN)

  // get question data upon render and save to global state.
  useEffect(() => {

    async function getQuestions() {
      try {
        const res = await fetch("/api/db/questions/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        setQuestions(data);
        filterQuestions();
      } catch (e) {
        console.error(`PracticeContainer/useEffect/getQuestions`, e);
      }
    };

    async function getCategories() {

      try {
        const res = await fetch("/api/db/categories/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();
        // console.log(data);
        setCategories(data);

      } catch (e) {
        console.error(`PracticeContainer/useEffect/getCategories/`, e);
      }
    }

    async function getProblemTypes() {
      try {
        const res = await fetch("/api/db/problemTypes/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();
        // console.log(data);
        setProblemTypes(data);

      } catch (e) {
        console.error(`PracticeContainer/useEffect/getCategories/`, e);
      }
    }

    getQuestions();
    getCategories();
    getProblemTypes();

  }, [])

  useEffect(() => {
    filterQuestions();
  }, [filter])


  async function getRandomQuestion() {

    const count = filteredQuestions.length;

    const randomIdx = Math.floor(Math.random() * count);

    setRandomQuestion(randomIdx);

  }

  // function handleClick() {



  // }

  console.log("PracticeContainer/filteredQuestions length: ", filteredQuestions.length);

  return (
    <div id="practice-container" className={[styles.container,].join(" ")}>
      <h1>
        Practice
      </h1>
      <button>{`Quick Start (Randomized Questions)`}</button>
      <p>Or</p>
      <button>{`Customize Session`}</button>
      {/* Settings Component */}
      <Filter />
      {/* "Start" */}
      {/* Timer Component
    - Pressing "Go" renders the question and starts the timer. */}
      {/* Question Component
    - Should contain within its state a set of problems.*/}
      {/* Answer Component
    - Should  */}
      <div style={{ width: "60vw", height: "50vh", border: "1px solid black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        Test Space:
        <div>
          <button onClick={getRandomQuestion}>
            Get Random Question
          </button>
        </div>
        {filteredQuestions[randomQuestion] &&
          <Question question={randomQuestion} />}
      </div>
    </div>
  )
}