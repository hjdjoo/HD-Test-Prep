import { useState } from "react";

import { ClientStudentData } from "@/src/queries/GET/getStudents"
import { ClientInstructorData } from "@/src/queries/GET/getInstructors"

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

  console.log(students, instructors);

  return (
    <div id="admin-settings-page">
      Admin Settings Page
      <StudentsDisplay students={students} />
      <InstructorsDisplay instructors={instructors} />
      <button
        onClick={() => {
          setShowAddProfile(!showAddProfile)
        }}
      >
        Add New Profile
      </button>
      {
        showAddProfile &&
        <AddProfileForm setShow={setShowAddProfile} />
      }
    </div>
  )
}
