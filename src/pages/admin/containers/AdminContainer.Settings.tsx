import { useState } from "react";
import styles from "./AdminContainer.module.css"
import { ClientStudentData, ClientInstructorData } from "@/src/_types/client-types"

import StudentsDisplay from "../components/Admin.StudentsDisplay";
import InstructorsDisplay from "../components/Admin.InstructorsDisplay";
import AddProfileForm from "../components/Admin.AddProfileForm";

interface AdminSettingsProps {
  students: ClientStudentData[]
  instructors: ClientInstructorData[]
}

export default function SettingsContainer(props: AdminSettingsProps) {

  const { students, instructors } = props;

  const [showAddProfile, setShowAddProfile] = useState<boolean>(false);

  return (
    <div id="admin-settings-page"
      className={[
        styles.fullWidth,
      ].join(" ")}>
      <div id="roster"
        className={[
          styles.sectionSpacingLg,
        ].join(" ")}>
        <StudentsDisplay students={students} />
        <InstructorsDisplay instructors={instructors} />
      </div>
      <div
        className={[
          styles.container,
        ].join(" ")}>
        <button
          className={[
            styles.buttonStyle,
          ].join(" ")}
          onClick={() => {
            setShowAddProfile(!showAddProfile)
          }}
        >
          Add New Profile
        </button>
      </div>
      {
        showAddProfile &&
        <AddProfileForm setShow={setShowAddProfile} />
      }
    </div>
  )
}
