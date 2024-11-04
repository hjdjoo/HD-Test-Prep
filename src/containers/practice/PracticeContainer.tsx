import styles from "./PracticeContainer.module.css";
import { useEffect, useState } from "react"
import { useQuestionStore } from "@/src/stores/questionStore";
import { useCategoryStore } from "@/src/stores/categoryStore";

import Question from "@/src/components/practice/Practice.questionImage.js";

import RandomPractice from "./PracticeContainer.Random";
import StructuredPractice from "./PracticeContainer.Structured";


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



  const [practiceType, setPracticeType] = useState<"random" | "structured" | null>(null)


  // get question data upon render and save to global state. Shame we need 3 different DB calls to do this - could do it in 1 call with PostgREST probably? Not enough of a performance hit to justify refactoring and figuring out PostgREST
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

        // console.log(typeof data[0].id)

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

  // make sure to update the filtered question bank when the filter is changed.
  useEffect(() => {
    filterQuestions();
  }, [filter])


  console.log("PracticeContainer/filteredQuestions length: ", filteredQuestions.length);

  return (
    <div id="practice-container" className={[styles.container,].join(" ")}>
      <h1>
        Practice
      </h1>
      <button onClick={() => { setPracticeType("random") }}>{`Random Questions`}</button>
      <p>Or</p>
      <button onClick={() => { setPracticeType("structured") }}>{`Structured Practice`}</button>
      <br />
      {/* Settings Component */}
      {practiceType === "random" && <RandomPractice />}
      {practiceType === "structured" && <StructuredPractice />}
    </div>
  )
}