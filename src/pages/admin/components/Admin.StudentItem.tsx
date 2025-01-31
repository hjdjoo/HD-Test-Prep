import { useState } from "react";
import styles from "./Admin.module.css"

import { ClientStudentData } from "@/src/queries/GET/getStudents"

import EditStudent from "./Admin.EditStudent";

interface StudentItemProps {
  student: ClientStudentData
}

export default function StudentItem(props: StudentItemProps) {

  const { student } = props;

  const [editing, setEditing] = useState<boolean>(false);

  return (
    <div id={`student-${student.id}-item`}
      className={[
        styles.flexCol
      ].join(" ")}>
      <div id={`student-${student.id}-info-box`}
        className={[
          styles.flexRow,
        ].join(" ")}>
        <p>{`${student.name}`}</p>
        <button id={`edit-student-${student.id}-button`}
          onClick={(e) => {
            e.preventDefault();
            setEditing(!editing)
          }}>
          edit
        </button>
      </div>
      {
        editing &&
        <EditStudent student={student} />
      }
    </div>

  )

}