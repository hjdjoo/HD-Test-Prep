import { ClientStudentData } from "@/src/queries/GET/getStudents"

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
          <div key={`student-${idx + 1}`}>
            <p>{`${rendered}. ${student.name}`}</p>
          </div>
        )
      }
    }).filter(value => value !== undefined)

    return studentsList;
  }

  return (
    <div id="students-display">
      <h3>Student Roster</h3>
      {renderStudents()}
    </div>
  )

}