import { Dispatch, SetStateAction, useState, ChangeEvent } from "react"
import styles from "./Practice.module.css"

import Autocomplete from "components/autocomplete/Autocomplete"

import DeleteIcon from "@/src/assets/icons/deleteIcon.svg"
import UploadIcon from "@/src/assets/icons/uploadIcon.svg";

import { useTagStore } from "@/src/stores/tagStore";
import { Question, useQuestionStore } from "@/src/stores/questionStore";
import { StudentResponse } from "@/src/features/practice/containers/PracticeContainer.Question";

import ModalContainer from "containers/modal/ModalContainer";
// import DeleteIcon from "@/src/assets/icons/deleteIcon.svg"
// import debounce from "@/utils/debounce"


export type FeedbackForm = {
  sessionId: number
  questionId: number
  studentId: number
  comment: string
  difficultyRating: number | null
  tags: number[]
  guessed: boolean | null
  instructorId: number
  imageUrl: string
}

interface FileData {
  fileType: string,
  fileData: string
}

export interface ImageData extends FileData {
  fileName: string
}

interface UploadPreviewProps {
  uploadFileData: FileData
  setUploadFileData: Dispatch<SetStateAction<FileData>>
}

interface FeedbackFormProps {
  question: Question
  studentResponse: StudentResponse
  setStudentResponse: Dispatch<SetStateAction<StudentResponse | undefined>>
  feedbackForm: FeedbackForm
  setFeedbackForm: Dispatch<SetStateAction<FeedbackForm | undefined>>
  setSubmitStatus: Dispatch<SetStateAction<"waiting" | "submitting" | "submitted">>
}



function UploadPreview(props: UploadPreviewProps) {

  const { uploadFileData, setUploadFileData } = props;

  function handleDelete() {
    setUploadFileData({ fileType: "", fileData: "" });
  }

  return (
    <div id="image-upload-preview"
      className={[
        styles.imagePreviewBox
      ].join(" ")}>
      <div id="remove-upload-button"
        className={[
          styles.removeUploadSize,
          styles.removeUploadColor,
          styles.removeUploadDecoration,
        ].join(" ")}
        onClick={handleDelete}
      >
        <DeleteIcon />
      </div>
      <img src={uploadFileData.fileData} alt={"Upload preview:"} />
    </div>
  )
}


export default function FeedbackForm(props: FeedbackFormProps) {

  const tags = useTagStore((state) => state.tags);
  const { questions, setQuestions } = useQuestionStore();
  const { question, studentResponse, setSubmitStatus, setStudentResponse, feedbackForm, setFeedbackForm } = props;

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [uploadFileData, setUploadFileData] = useState<FileData>({
    fileType: "",
    fileData: ""
  });

  // const [feedbackStatus, setFeedbackStatus] = useState<"waiting" | "submitting" | "submitted">("waiting")

  const difficulties: { [level: string]: string } = {
    1: "Very Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very Hard"
  }

  async function submitForm() {
    try {

      if (!studentResponse) return;
      // compile feedback form.
      // console.log("before update/feedbackForm: ", feedbackForm);
      const updatedFeedbackForm = structuredClone(feedbackForm);

      const newTags: string[] = [];

      activeTags.forEach(tag => {

        console.log("tags: ", tags);
        console.log("tag: ", tag);
        console.log("tags[tag]: ", tags[tag]);

        if (tags[tag]) {
          updatedFeedbackForm.tags.push(tags[tag]);
        } else {
          newTags.push(tag);
        }
      })

      const body = {
        feedbackForm: updatedFeedbackForm,
        newTags: newTags,
        imageData: {
          fileName: `s${feedbackForm.studentId}q${feedbackForm.questionId}`,
          ...uploadFileData
        },
        question: question,
      }

      console.log("submit feedback form request body: ", body);

      // submit feedback form and get id;
      const res = await fetch("api/db/feedback/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })


      if (!res.ok) {
        throw new Error(`Something went wrong while adding feedback to DB. ${res.status}: ${res.statusText}`)
      }

      // then update the feedback form with the id
      const data = await res.json();

      // console.log("feedback id data: ", data);
      const updatedStudentRes = structuredClone(studentResponse);

      updatedStudentRes.feedbackId = data.id;

      console.log("FeedbackForm/submitForm/data", data);

      const updatedQuestion = data.updatedQuestion as Question;
      const updatedQuestions = [...questions];

      updatedQuestions.forEach(item => {
        if (item.id === updatedQuestion.id) {
          item.tags = updatedQuestion.tags;
        }
      })

      console.log("updating questions...")
      setQuestions(updatedQuestions);
      console.log("updating student response...")
      setStudentResponse(updatedStudentRes);
      console.log("updating feedback status...")
      setSubmitStatus("submitted")
    } catch (e) {
      console.error(e);
    }

  }


  function handleForm(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

    const { name, value } = e.target;

    const updatedFeedbackForm = structuredClone(feedbackForm);

    switch (name) {
      case "comment":
        updatedFeedbackForm[name] = value;
        break;
      case "difficultyRating":
        updatedFeedbackForm[name] = Number(value);
        break;
      case "guessed":
        const { id } = e.target;
        const guessed = id === "guess-true" ? true : false

        updatedFeedbackForm[name] = guessed;
        break;
    }

    setFeedbackForm(updatedFeedbackForm);

  }


  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {

    const { files } = e.target;

    if (!files || !files.length) return;

    console.log(files);

    const fileType = files[0].type;

    const fileReader = new FileReader();

    fileReader.readAsDataURL(files[0])

    // add a conditional block to compress images to a max size.

    if (files[0].size > 5000000) {

      //.......

    }

    function fileDataSetter(e: ProgressEvent<FileReader>) {

      if (e.target) {

        const result = e.target.result as string

        setUploadFileData({ fileType: fileType, fileData: result });

      }
    }

    fileReader.addEventListener("load", fileDataSetter);

  }

  async function handleSubmit() {

    // if (feedbackStatus === "waiting") {
    //   setFeedbackStatus("submitting");
    // }
    submitForm();

  }

  // function handleSkip () {

  // }


  const difficultySelect = () => {

    return Object.keys(difficulties).map(level => {

      return (
        <div key={`difficulty-select-${level}`} className={[
          styles.radioLabelAlign,
          styles.radioLabelText,
        ].join(" ")}>
          <input id={`difficulty-select-input-${level}`} type="radio" name={`difficultyRating`} value={Number(level)} onChange={handleForm} checked={feedbackForm.difficultyRating === Number(level)} />
          <label htmlFor={`difficulty-select-input-${level}`} className={styles.difficultyLabelText}>
            {difficulties[level]}
          </label>
        </div>
      )
    });

  }

  const difficultyRadios = difficultySelect();


  return (
    <ModalContainer>
      <div id="feedback-modal"
        className={[
          styles.formDisplay,
          styles.formAlign,
        ].join(" ")}>
        <h2>Reflection Form</h2>
        <div className={[
          styles.formSectionDetailText
        ].join(" ")}>
          <p>Responses help your instructor AND other students</p>
        </div>
        <section id="response-confirm"
          className={[
            styles.formSectionHeading,
            styles.resultTextSize
          ].join(" ")}>
          <p>
            {studentResponse.response === question.answer ? "You got it!" : "You missed this one :("}
          </p>
        </section>
        <section id="difficulty-feedback-section"
          className={[
            styles.formSectionAlign,
          ].join(" ")}>
          <div className={[styles.formSectionHeading].join(" ")}>
            <p>How hard did this feel?</p>
          </div>
          <div id="difficulty-radio-buttons"
            className={[
              styles.difficultyRadioAlign,
            ].join(" ")}>
            {difficultyRadios}
          </div>
        </section>
        <section id="guess-feedback-section"
          className={[
            styles.formSectionAlign,
          ].join(" ")}>
          <div className={[
            styles.formSectionHeading,
          ].join(" ")}>
            <div id="guess-input" className={[
            ].join(" ")}>
              <p>Was this a guess?</p>
              <div id="guess-input-section"
                className={[
                  styles.guessInputAlign
                ].join(" ")}>
                <div id="guess-select-true"
                  className={[
                    styles.radioButtonsVertical,
                    styles.radioLabelAlign,
                    styles.radioLabelText,
                  ].join(" ")}>
                  <input type="radio" id="guess-true" name="guessed" onChange={handleForm} />
                  <label htmlFor="guess-true">Yes</label>
                </div>
                <div id="guess-select-false"
                  className={[
                    styles.radioButtonsVertical,
                    styles.radioLabelAlign,
                    styles.radioLabelText,
                  ].join(" ")}>
                  <input type="radio" id="guess-false" name="guessed" onChange={handleForm} />
                  <label htmlFor="guess-false">No</label>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="instructor-feedback-section"
          className={[
            styles.formSectionAlign
          ].join(" ")}>
          <div className={[styles.formSectionHeading].join(" ")}>
            <p>Add a note or question for your instructor:</p>
          </div>
          <textarea id="instructor-feedback"
            name="comment"
            onChange={handleForm}
            value={feedbackForm.comment}
            className={[
              styles.marginTopDefault,
            ].join(" ")} />
        </section>
        <section id="image-upload-section"
          className={[
            styles.formSectionAlign,
            styles.formSectionWidth,
          ].join(" ")}>
          <div className={[
            styles.formSectionHeading,
            styles.formAlign,
          ].join(" ")}>
            <p>{"Upload a picture of your work for more context (optional):"}</p>
            <div id="upload-icon-wrapper"
              className={[
                styles.uploadIconSize,
                styles.marginTopDefault,
                styles.uploadIconColor,
              ].join(" ")}>
              <label htmlFor="student-file-upload"
                className={styles.uploadIconDecoration}>
                <UploadIcon />
                Upload
              </label>
              <input id="student-file-upload"
                type="file"
                hidden={true}
                name={"imageUrl"}
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload} />
            </div>
            {uploadFileData.fileData && <UploadPreview uploadFileData={uploadFileData} setUploadFileData={setUploadFileData} />}
          </div>
        </section>
        <section id={"add-tags-section"}
          className={[
            styles.formSectionWidth,
          ].join(" ")}>
          <div className={[
            styles.formSectionHeading
          ].join(" ")}>
            <p>{"Add any tags that fit this problem (e.g., quadratic equations, linear equations, sohcahtoa, etc)"}
            </p>
          </div>
          <Autocomplete
            feedbackForm={feedbackForm}
            setFeedbackForm={setFeedbackForm}
            activeTags={activeTags}
            setActiveTags={setActiveTags}
          />
        </section>
        <section id="submit-button-box"
          className={[styles.formSectionHeading].join(" ")}>
          <button onClick={handleSubmit}>Submit</button>
        </section>
      </div>
    </ModalContainer>
  )
}