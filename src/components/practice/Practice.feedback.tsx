import { Dispatch, SetStateAction, useState, ChangeEvent } from "react"
import styles from "./Practice.module.css"

import Autocomplete from "components/autocomplete/Autocomplete"

import DeleteIcon from "@/src/assets/icons/deleteIcon.svg"
import UploadIcon from "@/src/assets/icons/uploadIcon.svg";

import { useTagStore } from "@/src/stores/tagStore";
import { Question, useQuestionStore } from "@/src/stores/questionStore";
import { StudentResponse } from "containers/QuestionContainer.tsx/QuestionContainer";
// import DeleteIcon from "@/src/assets/icons/deleteIcon.svg"
// import debounce from "@/utils/debounce"


export type FeedbackForm = {
  questionId: number
  studentId: number
  correct: boolean
  response: string
  comment: string
  difficultyRating: number | null
  tags: number[]
  guessed: boolean | null
}

type FileData = {
  fileType: string,
  fileData: string
}

interface UploadPreviewProps {
  uploadFileData: FileData
  setUploadFileData: Dispatch<SetStateAction<FileData>>
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

interface FeedbackFormProps {
  question: Question
  setStudentResponse: Dispatch<SetStateAction<StudentResponse | undefined>>
  feedbackForm: FeedbackForm
  setFeedbackForm: Dispatch<SetStateAction<FeedbackForm | undefined>>
  setSubmitStatus: Dispatch<SetStateAction<"not submitted" | "submitting" | "submitted">>
}

export default function FeedbackForm(props: FeedbackFormProps) {

  const { tags } = useTagStore();

  const { question, setStudentResponse, feedbackForm, setFeedbackForm } = props;

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [uploadFileData, setUploadFileData] = useState<FileData>({
    fileType: "",
    fileData: ""
  });

  const difficulties: { [level: string]: string } = {
    1: "Very Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very Hard"
  }

  const difficultySelect = () => {

    return Object.keys(difficulties).map(level => {

      return (
        <div key={`difficulty-select-${level}`} className={[
          styles.difficultyLabelAlign,
          styles.difficultyLabelText,
        ].join(" ")}>
          <input id={`difficulty-select-input-${level}`} type="radio" name={`difficultyRating`} value={Number(level)} onChange={handleForm} checked={feedbackForm.difficultyRating === Number(level)} />
          <label htmlFor={level} className={styles.difficultyLabelText}>
            {difficulties[level]}
          </label>
        </div>
      )
    });

  }

  const difficultyRadios = difficultySelect();


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
        updatedFeedbackForm[name] = (value === "on");
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

    function fileDataSetter(e: ProgressEvent<FileReader>) {

      if (e.target) {

        const result = e.target.result as string

        setUploadFileData({ fileType: fileType, fileData: result });

      }
    }

    fileReader.addEventListener("load", fileDataSetter);

  }



  async function handleSubmit() {

    // compile feedback form.
    console.log("before update/feedbackForm: ", feedbackForm);
    const updatedFeedbackForm = structuredClone(feedbackForm);

    const newTags: string[] = [];

    activeTags.forEach(tag => {
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
        name: `s${feedbackForm.studentId}q${feedbackForm.questionId}`,
        ...uploadFileData
      },
      question: question,
    }

    console.log("request body: ", body);

    //submit feedback form and get id;
    // await fetch("/db/feedback", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   // body: {

    //   // }
    // })


    // then update the feedback form with the id


    // and update the submitState to trigger student response submission.

  }

  // function handleSkip () {

  // }




  return (
    <div id="modal-backdrop"
      className={[
        styles.backdropStyle,
        styles.centerForm,
      ].join(" ")}>
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
        <div id="response-confirm"
          className={[
            styles.formSectionHeading,
            styles.resultTextSize
          ].join(" ")}>
          <p>
            {feedbackForm.correct ? "You got it!" : "You missed this one :("}
          </p>
        </div>
        <div id="difficulty-feedback-section"
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
        </div>
        <div id="guess-feedback-section"
          className={[
            styles.formSectionAlign,
          ].join(" ")}>
          <div className={[
            styles.formSectionHeading,
          ].join(" ")}>
            <div id="guess-input" className={[
              styles.guessInputAlign
            ].join(" ")}>
              <label htmlFor="guess">Check this if you took a guess:</label>
              <input type="checkbox" id="guess" name="guessed" onChange={handleForm} />
            </div>
          </div>
        </div>
        <div id="instructor-feedback-section"
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
        </div>
        <div id="image-upload-section"
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
        </div>
        <div id={"add-tags-section"}
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
        </div>
        <div id="submit-button-box"
          className={[styles.formSectionHeading].join(" ")}>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )

}