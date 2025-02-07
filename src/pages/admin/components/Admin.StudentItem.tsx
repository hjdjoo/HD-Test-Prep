import { useState } from "react";
import styles from "./Admin.module.css"

import { ClientStudentData } from "@/src/queries/GET/getStudents"
import deleteProfile from "@/src/queries/DELETE/deleteProfile";
import EditStudent from "./Admin.EditStudent";

interface StudentItemProps {
  student: ClientStudentData
}

export default function StudentItem(props: StudentItemProps) {

  const { student } = props;

  const [editing, setEditing] = useState<boolean>(false);

  async function handleDelete(id: number) {
    try {

      const data = await deleteProfile(id);

      console.log(data);

    } catch (e) {
      console.error(e);
      throw e
    }
  }

  return (
    <div id={`student-${student.id}-item`}
      className={[
        styles.widthFull,
      ].join(" ")}>
      <div id={`student-${student.id}-info-box`}
        className={[
          styles.widthFull,
          styles.flexRow,
          styles.justifyBetween
        ].join(" ")}>
        <p>{`${student.name}`}</p>
        <div>
          <button id={`edit-student-${student.id}-button`}
            onClick={(e) => {
              e.preventDefault();
              setEditing(!editing)
            }}>
            edit
          </button>
          <button id={`delete-student${student.id}-button`}
            onClick={(e) => {
              e.preventDefault();
              handleDelete(student.id);
            }}>
            delete
          </button>
        </div>
      </div>
      {
        editing &&
        <EditStudent student={student} setOpen={setEditing} />
      }
    </div>

  )

}