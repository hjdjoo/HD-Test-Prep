import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./Admin.module.css";
import animations from "@/src/animations.module.css";

import { useProfilesStore } from "@/src/stores/profilesStore";

import { ClientStudentData } from "@/src/queries/GET/getStudents";
import { ClientInstructorData } from "@/src/queries/GET/getInstructors";
import linkInstructor from "@/src/queries/PATCH/linkInstructor";

import Dropdown from "components/dropdown/Dropdown";

interface EditStudentProps {
  student: ClientStudentData
  setOpen: Dispatch<SetStateAction<boolean>>
}

export type EditStudentForm = {
  studentId: number
  instructorId: number | null
}

export default function EditStudent(props: EditStudentProps) {

  const { setOpen, student } = props;

  const defaultForm: EditStudentForm = {
    studentId: student.id,
    instructorId: null
  }

  const [studentForm, setStudentForm] = useState<EditStudentForm>(defaultForm)

  const selectedIdxRef = useRef<number | null>(null)

  const instructors = useProfilesStore((state) => state.instructors)
  const students = useProfilesStore((state) => state.students)
  const setStudents = useProfilesStore((state) => state.setStudents)

  const studentInstructor = instructors.filter((instructor) => {
    return instructor.id === student.instructorId
  })

  function handleDropdown(instructor: ClientInstructorData, idx: number) {

    selectedIdxRef.current = idx;
    const newStudentForm = { ...studentForm };
    newStudentForm.instructorId = instructor.id;
    setStudentForm(newStudentForm);

  }

  async function handleSubmit() {
    try {

      if (!studentForm.instructorId) {
        throw new Error("No instructor selected");
      }

      const updatedStudents = [...students];

      updatedStudents.forEach(profile => {

        if (profile.id === student.id) {
          profile.instructorId = studentForm.instructorId
        }

      })
      setStudents(updatedStudents);

      await linkInstructor(studentForm);
      resetForm();

    } catch (e) {

      console.error(e);

    }
  }

  function resetForm() {
    selectedIdxRef.current = null;
    setStudentForm(defaultForm);
    setOpen(false);
  }

  const instructorOptions = instructors.map((instructor, idx) => {
    return (
      <Dropdown.Item key={`student-instructor-option-${idx + 1}`}
        onClick={() => {
          handleDropdown(instructor, idx);
        }}
        idx={idx}
        selectedIdx={selectedIdxRef.current} >
        <div>{instructor.name}</div>
      </Dropdown.Item>
    )
  })

  return (
    <div id={`edit-student-${student.id}`}>
      <div id={`edit-student-${student.id}-current-instructor`}
        className={[
          styles.sectionSpacing,
        ].join(" ")}>
        <p>Current Instructor: </p>
        <p>{studentInstructor.length ? studentInstructor[0].name : "No Instructor Assigned"
        }</p>
      </div>
      <div id={`edit-student-${student.id}-new-instructor`}
        className={[
          styles.sectionSpacing
        ].join(" ")}>
        <div className={[
          styles.sectionSpacing
        ].join(" ")}>
          <Dropdown>
            <Dropdown.Button>
              Select New Instructor
            </Dropdown.Button>
            <Dropdown.List>
              {instructorOptions}
            </Dropdown.List>
          </Dropdown>
        </div>
        <div id={`edit-student-${student.id}-buttons`}
          className={[
            styles.flexCol,
          ].join(" ")}>
          <button
            className={[
              styles.buttonStyle,
              styles.sectionSpacing,
              animations.highlight,
            ].join(" ")}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
            Set New Instructor
          </button>
          <button
            className={[
              styles.buttonStyle,
              styles.sectionSpacing,
              animations.highlight,
            ].join(" ")}
            onClick={(e) => {
              e.preventDefault();
              resetForm();
            }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}