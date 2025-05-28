import styles from "./Admin.module.css"
import { ClientInstructorData } from "@/src/_types/client-types"
import { useProfilesStore } from "@/src/stores/profilesStore";

import deleteInstructor from "@/src/queries/DELETE/deleteInstructor";

interface InstructorsDisplayProps {
  instructors: ClientInstructorData[]
}

export default function InstructorsDisplay(props: InstructorsDisplayProps) {

  const { instructors } = props;

  const setInstructors = useProfilesStore((state) => state.setInstructors)

  async function handleDelete(id: number) {
    try {

      const updatedInstructors = [...instructors].filter((instructor) => {
        instructor.id !== id;
      })

      setInstructors(updatedInstructors);

      await deleteInstructor(id);
      // console.log(data);

    } catch (e) {
      console.error(e);
      throw e
    }
  }

  function renderInstructors() {

    let rendered = 0;

    const instructorsList = instructors.map((instructor, idx) => {
      rendered++;
      return (
        <div key={`instructor-${idx + 1}`}
          className={[
            styles.flexRow,
            styles.justifyBetween,
            styles.widthFull,
            styles.displayItem,
          ].join(" ")}>
          <p>{`${rendered}. ${instructor.name}`}</p>
          <button
            className={[
              styles.buttonStyle
            ].join(" ")}
            onClick={(e) => {
              e.preventDefault();
              handleDelete(instructor.id);
            }}>
            delete
          </button>
        </div>
      )
    })

    return instructorsList
  }

  const instructorsDisplay = renderInstructors();

  return (
    <div id="instructors-display"
      className={[
        styles.sectionSpacing,
      ].join(" ")}>
      <p className={[
        styles.displayHeading,
      ].join(" ")}>Instructor Roster</p>
      {instructorsDisplay}
    </div>
  )

}