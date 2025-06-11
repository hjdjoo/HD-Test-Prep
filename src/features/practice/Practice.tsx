import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";

// import animations from "@/src/animations.module.css"
import styles from "./Practice.module.css";

import { questionStore } from "@/src/stores/questionStore";
import { useCategoryStore } from "@/src/stores/categoryStore";
import { useTagStore } from "@/src/stores/tagStore"
import { userStore } from "@/src/stores/userStore";
import ErrorPage from "@/src/ErrorPage";
import Loading from "components/loading/Loading";

import fetchQuestions from "@/src/queries/GET/getQuestions";
import fetchCategories from "@/src/queries/GET/getCategories";
import fetchProblemTypes from "@/src/queries/GET/getProblemTypes";

import RandomPractice from "./containers/PracticeContainer.Random";
// import StructuredPractice from "./containers/PracticeContainer.Structured";
import LinkInstructorModal from "./components/Practice.LinkInstructorModal";

import fetchTags from "@/src/queries/GET/getTags";

export default function Practice() {

  const { setCategories, setProblemTypes } = useCategoryStore();

  const filter = useStore(questionStore, (state) => state.filter);
  const setQuestions = useStore(questionStore, (state) => state.setQuestions);
  const filterQuestions = useStore(questionStore, (state) => state.filterQuestions);
  const user = useStore(userStore, (state) => state.user);

  const { setTags } = useTagStore();

  // const [practiceType, setPracticeType] = useState<"random" | "structured" | null>(null)

  const openModal = (user && !user.instructor_id) ? true : false;

  const [modalOpen, setModalOpen] = useState<boolean>(openModal);

  // React query states:
  const { status: questionStatus, data: questionData, error: questionError } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions
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
    // console.log("change in filter detected, setting new questions...")
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

  // console.log("questionStatus, categoryStatus, problemTypeStatus, tagsStatus: ")
  // console.log(questionStatus, categoryStatus, problemTypeStatus, tagsStatus)
  if (questionStatus === "pending" || categoryStatus === "pending" || problemTypeStatus === "pending" || tagsStatus === "pending") {
    return (
      <Loading />
    )
  }

  if (questionError || problemTypeError || categoryError || tagsError) {

    return (
      <ErrorPage />
    )
  }

  return (
    <div id="practice-container"
      className={[
        styles.container,
      ].join(" ")}>
      <div id="practice-heading"
        className={[
          styles.sectionSpacing,
        ].join(" ")}>
        <h1>
          Practice!
        </h1>
      </div>
      <RandomPractice />
      {/* <button id="start-practice-button"
        className={[
          styles.buttonStyle,
          styles.buttonSize,
          animations.highlightPrimary,
        ].join(" ")}
        onClick={() => {
          // setPracticeType("random")
          navigate("/practice/random")
        }}
      >
        {`Start Practice`}
      </button> */}
      {
        modalOpen &&
        <LinkInstructorModal setOpen={setModalOpen} />
      }
      {/* <p>Or</p>
      <button
        onClick={() => { setPracticeType("structured") }}>{`Structured Practice`}
      </button> */}
      <br />
      {/* Settings Component */}
      {/* {practiceType === "random" && <RandomPractice />}
      {practiceType === "structured" && <StructuredPractice />} */}
    </div>
  )
}