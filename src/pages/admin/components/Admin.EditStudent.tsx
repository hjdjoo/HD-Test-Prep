import { useProfilesStore } from "@/src/stores/profilesStore";
import { ClientStudentData } from "@/src/queries/GET/getStudents";
import Dropdown from "components/dropdown/Dropdown";
import { useRef, useState } from "react";
import { ClientInstructorData } from "@/src/queries/GET/getInstructors";

interface EditStudentProps {
  student: ClientStudentData
}

type StudentForm = {
  studentId: number
  instructorId: number | null
}

export default function EditStudent(props: EditStudentProps) {

  const { student } = props;

  const [studentForm, setStudentForm] = useState<StudentForm>({
    studentId: student.id,
    instructorId: null
  })

  const selectedIdxRef = useRef<number | null>(null)

  const instructors = useProfilesStore((state) => state.instructors)

  const studentInstructor = instructors.filter((instructor) => {
    return instructor.id === student.instructorId
  })

  if (!studentInstructor.length) {
    return (
      <div id={`edit-student-${student.id}`}>
        <p>Current Instructor: </p>
        <p>No Instructor Assigned</p>
      </div>
    )
  }

  function handleDropdown(instructor: ClientInstructorData, idx: number) {

    selectedIdxRef.current = idx;
    const newStudentForm = { ...studentForm };
    newStudentForm.instructorId = instructor.id;
    setStudentForm(newStudentForm);

  }

  async function handleSubmit() {

  }

  const instructorOptions = instructors.map((instructor, idx) => {
    return (
      <Dropdown.Item key={`student-instructor-option-${idx + 1}`}
        onClick={() => {
          handleDropdown(instructor, idx);
        }}
        idx={idx}
        selectedIdx={selectedIdxRef.current} >
        <p>{instructor.name}</p>
      </Dropdown.Item>
    )
  })

  return (
    <div id={`edit-student-${student.id}`}>
      <div id={`edit-student-${student.id}-current-instructor`}>
        <p>Current Instructor: </p>
        <p>{studentInstructor[0].name}</p>
      </div>
      <div id={`edit-student-${student.id}-new-instructor`} style={{ border: "1px solid grey" }}>
        <Dropdown>
          <Dropdown.Button>
            Select New Instructor
          </Dropdown.Button>
          <Dropdown.List>
            {instructorOptions}
          </Dropdown.List>
        </Dropdown>
        <button onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          Submit Changes
        </button>
      </div>
    </div>
  )
}