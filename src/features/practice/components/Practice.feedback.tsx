import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";

import styles from "./Practice.Components.module.css";
import animations from "@/src/animations.module.css";

import Autocomplete from "components/autocomplete/Autocomplete"

import DeleteIcon from "@/src/assets/icons/deleteIcon.svg"
import UploadIcon from "@/src/assets/icons/uploadIcon.svg";
import TrashIcon from "@/src/assets/icons/trashIcon.svg"

import { useTagStore } from "@/src/stores/tagStore";
import { Question, questionStore } from "@/src/stores/questionStore";
import { StudentResponse, FileData, type FeedbackForm } from "@/src/_types/client-types";

import { apiFetch } from "@/utils/apiFetch";

// import Alert, { UserAlert } from "components/alert/Alert";

import ModalContainer from "containers/modal/ModalContainer";
import { SERVER_URL } from "@/src/config";

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
          styles.removeUploadPosition,
          styles.removeUploadColor,
          styles.removeUploadDecoration,
          animations.highlightPrimaryDark,
        ].join(" ")}
        onClick={handleDelete}
      >
        <TrashIcon />
      </div>
      <img src={uploadFileData.fileData} alt={"Upload preview:"} />
    </div>
  )
}


export default function FeedbackForm(props: FeedbackFormProps) {

  const tags = useTagStore((state) => state.tags);
  const { questions, setQuestions } = questionStore.getState();
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

  function handleClose() {
    setSubmitStatus("submitted");
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

    // console.log("handling file upload...");
    const { files } = e.target;

    if (!files || !files.length) {
      // console.log(files);
      return
    };

    const file = files[0];
    const fileType = file.type;
    const size = file.size;

    const fileReader = new FileReader();

    fileReader.onload = (e) => {

      // console.log("fileReader/onload/e.target: ", e.target);
      const result = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        if (size > 3500000) {
          // console.log("large file!");

          const maxSize = 3500000;
          const ratio = maxSize / size;
          const reduce = Math.sqrt(ratio);
          const height = Math.floor(img.height * reduce);
          const width = Math.floor(img.width * reduce);
          // console.log(height, width);

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            // console.log("drawing image on context...")
            ctx.drawImage(img, 0, 0, width, height);
            // console.log("converting canvas to blob...")
            canvas.toBlob((blob) => {

              if (!blob) return;

              const fileReader2 = new FileReader();

              fileReader2.onloadend = () => {

                const data = fileReader2.result as string;
                // console.log("setting upload file");
                setUploadFileData({ fileType, fileData: data });

              }

              // console.log("reading blob...");
              fileReader2.readAsDataURL(blob);

            }, fileType, 0.7);
          }

        } else {
          setUploadFileData({ fileType, fileData: result })
        }
      }

      // console.log("setting image src...")
      img.src = result as string;
    }

    // console.log("reading file...");
    fileReader.readAsDataURL(file);

  }

  async function handleSubmit() {

    // console.log(feedbackForm);
    submitForm();

  }

  async function submitForm() {
    try {

      if (!studentResponse) return;
      // compile feedback form.
      const updatedFeedbackForm = structuredClone(feedbackForm);

      const newTags: string[] = [];

      activeTags.forEach(tag => {
        // // console.log("tags: ", tags);
        // // console.log("tag: ", tag);
        // // console.log("tags[tag]: ", tags[tag]);
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
          fileName: `s${feedbackForm.sessionId}p${feedbackForm.studentId}q${feedbackForm.questionId}`,
          ...uploadFileData
        },
        question: question,
      }

      // console.log("submit feedback form request body: ", body);
      // submit feedback form and get id;
      const res = await apiFetch(`${SERVER_URL}/db/feedback/new`, {
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

      // // console.log("feedback id data: ", data);
      const updatedStudentRes = structuredClone(studentResponse);

      updatedStudentRes.feedbackId = data.id;

      // console.log("FeedbackForm/submitForm/data", data);

      const updatedQuestion = data.updatedQuestion as Question;
      const updatedQuestions = [...questions];

      updatedQuestions.forEach(item => {
        if (item.id === updatedQuestion.id) {
          item.tags = updatedQuestion.tags;
        }
      })

      // console.log("updating questions...")
      setQuestions(updatedQuestions);
      // console.log("updating student response...")
      setStudentResponse(updatedStudentRes);
      // console.log("updating feedback status...")
      setSubmitStatus("submitted")
    } catch (e) {
      console.error(e);
    }
  }

  // function handleSkip () {

  // }


  const difficultySelect = () => {

    return Object.keys(difficulties).map(level => {

      return (
        <div key={`difficulty-select-${level}`} className={[

        ].join(" ")}>
          <label htmlFor={`difficulty-select-input-${level}`}
            className={[
              styles.radioLabelAlign,

            ].join(" ")}>
            <input id={`difficulty-select-input-${level}`}
              type="radio"
              name={`difficultyRating`}
              value={Number(level)}
              onChange={handleForm}
              checked={feedbackForm.difficultyRating === Number(level)} />
            <span className={[
              styles.radioLabelText,
            ].join(" ")}>
              {difficulties[level]}
            </span>
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
        <div id="close-modal-button">
          <button
            onClick={handleClose}
            className={[
              styles.closeFormButtonStyle,
              styles.closeFormButtonPosition,
            ].join(" ")}>
            <DeleteIcon />
          </button>
        </div>
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
            autoComplete="off"
            cols={30}
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
            styles.formSectionAlign,
          ].join(" ")}>
            <p>{"Upload a picture of your work for more context (optional):"}</p>
            <label htmlFor="student-file-upload"
              className={[
                styles.uploadIconDecoration,
                styles.formSectionAlign,
              ].join(" ")}>
              <div id="upload-icon-wrapper"
                className={[
                  styles.wrapperSize,
                  styles.marginTopDefault,
                  styles.uploadIconColor,
                  styles.uploadButtonAlign,
                  styles.uploadIconDecoration,
                  animations.highlightPrimary,
                ].join(" ")}>

                <div id="upload-icon"
                  className={[
                    styles.uploadIconSize,
                    styles.sectionMargin,
                  ].join(" ")}>
                  <UploadIcon />
                </div>
                <div>
                  Upload
                </div>
                <div className={[
                  styles.hideInput
                ].join(" ")}>
                  <input id="student-file-upload"
                    type="file"
                    name={"imageUrl"}
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload} />
                </div>

              </div>
              {uploadFileData.fileData && <UploadPreview uploadFileData={uploadFileData} setUploadFileData={setUploadFileData} />}
            </label>
          </div>
        </section>
        <section id={"add-tags-section"}
          className={[
            styles.formSectionWidth,
          ].join(" ")}>
          <div className={[
            styles.formSectionHeading,
            styles.sectionMargin,
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
          className={[
            styles.formSectionHeading,
            styles.sectionWidthFull,
            styles.formAlign,
          ].join(" ")}>
          <button
            className={[
              styles.buttonStyleSecondary,
              styles.submitButtonSize,
              animations.highlightPrimaryDark,
            ].join(" ")}
            onClick={handleSubmit}>Submit</button>
        </section>
      </div>
    </ModalContainer>
  )
}