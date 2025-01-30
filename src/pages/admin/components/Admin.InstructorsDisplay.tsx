
import { ClientInstructorData } from "@/src/queries/GET/getInstructors";

interface InstructorsDisplayProps {
  instructors: ClientInstructorData[]
}

export default function InstructorsDisplay(props: InstructorsDisplayProps) {


  const { instructors } = props;

  function renderInstructors() {

    let rendered = 0;

    const instructorsList = instructors.map((instructor, idx) => {
      rendered++;
      return (
        <div key={`instructor-${idx + 1}`}>
          <p>{`${rendered}. ${instructor.name}`}</p>
        </div>
      )
    })

    return instructorsList
  }

  return (
    <div id="instructors-display">
      <h3>Instructor Roster</h3>
      {renderInstructors()}
    </div>
  )

}