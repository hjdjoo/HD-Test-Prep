import styles from "./Practice.module.css";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import { useQuestionStore } from "@/src/stores/questionStore";
import { useCategoryStore } from "@/src/stores/categoryStore";
import { useTagStore } from "@/src/stores/tagStore"
import ErrorPage from "@/src/ErrorPage";
// import usePracticeSession from "@/src/hooks/usePracticeSession";

import fetchQuestions from "@/src/queries/GET/getQuestions";
import fetchCategories from "@/src/queries/GET/getCategories";
import fetchProblemTypes from "@/src/queries/GET/getProblemTypes";
// import createSupabase from "@/utils/supabase/client";

// import Question from "@/src/components/practice/Practice.questionImage.js";

import RandomPractice from "./containers/PracticeContainer.Random";
import StructuredPractice from "./containers/PracticeContainer.Structured";
import fetchTags from "@/src/queries/GET/getTags";


export default function Practice() {

  const { setCategories, setProblemTypes } = useCategoryStore();
  const { filter, filteredQuestions, setQuestions, filterQuestions } = useQuestionStore();
  const { setTags } = useTagStore();

  const [practiceType, setPracticeType] = useState<"random" | "structured" | null>(null)

  // React query states:
  const { status: questionStatus, data: questionData, error: questionError } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  });

  const { status: categoryStatus, data: categoryData, error: categoryError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  const { status: problemTypeStatus, data: problemTypeData, error: problemTypeError } = useQuery({
    queryKey: ["problemTypes"],
    queryFn: fetchProblemTypes,
  });

  const { status: tagsStatus, data: tagsData, error: tagsError } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags
  })

  // make sure to update the filtered question bank when the filter is changed.
  useEffect(() => {
    filterQuestions();
  }, [filter])

  useEffect(() => {

    if (questionData) {
      setQuestions(questionData);
      filterQuestions();
    }
    if (problemTypeData) {
      setProblemTypes(problemTypeData)
    }
    if (categoryData) {
      setCategories(categoryData)
    }
    if (tagsData) {
      setTags(tagsData);
    }

  }, [questionData, problemTypeData, categoryData, tagsData])


  if (questionStatus === "pending" || categoryStatus === "pending" || problemTypeStatus === "pending" || tagsStatus === "pending") {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  if (questionError || problemTypeError || categoryError || tagsError) {

    return (
      <ErrorPage />
    )
  }

  // console.log(tags);
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