import styles from "./Admin.module.css"

import { ClientStudentData } from "@/src/_types/client-types"
import StudentItem from "./Admin.StudentItem";

interface StudentsDisplayProps {
  students: ClientStudentData[]
}

export default function StudentsDisplay(props: StudentsDisplayProps) {

  const { students } = props;

  function renderStudents() {

    let rendered = 0;

    const studentsList = students.map((student, idx) => {

      if (student.role === "student") {
        rendered++;
        return (
          <div key={`student-${student.id}-display`}
            id={`student-${student.id}-display`}
            className={[
              styles.flexRow,
              styles.widthFull,
              styles.displayItem,
            ].join(" ")}>
            <p>{`${idx + 1}. `}</p>
            <StudentItem
              student={student} />
          </div>
        )
      }
    }).filter(value => value !== undefined)

    return studentsList;
  }

  const studentsList = renderStudents();

  return (
    <div id="students-display"
      className={[
        styles.displayWidth,
        styles.sectionSpacing,
      ].join(" ")}>
      <p className={[
        styles.displayHeading,
      ].join(" ")}>
        Student Roster
      </p>
      {studentsList}
    </div>
  )

}