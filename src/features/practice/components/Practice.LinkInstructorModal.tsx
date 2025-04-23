import ModalContainer from "containers/modal/ModalContainer";
import styles from "./Practice.Components.module.css"

import { useQuery } from "@tanstack/react-query";
import { userStore } from "@/src/stores/userStore";
import { useStore } from "zustand";

import { useProfilesStore } from "@/src/stores/profilesStore";

import getStudents from "@/src/queries/GET/getStudents";

import EditStudent from "@/src/pages/admin/components/Admin.EditStudent";
import ErrorPage from "@/src/ErrorPage";
import { Dispatch, SetStateAction } from "react";
import Loading from "components/loading/Loading";
import getInstructors from "@/src/queries/GET/getInstructors";

interface LinkInstructorModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function LinkInstructorModal(props: LinkInstructorModalProps) {

  const { setOpen } = props;

  const user = useStore(userStore, (state) => state.user);

  const students = useProfilesStore((state) => state.students);
  const setStudents = useProfilesStore((state) => state.setStudents);
  const instructors = useProfilesStore((state) => state.instructors);
  const setInstructors = useProfilesStore((state) => state.setInstructors);

  const { data: studentData, error: studentError } = useQuery({
    queryKey: ["studentData", students],
    queryFn: async () => {
      const data = await getStudents();
      setStudents(data)
      return data;
    }
  })
  const { data: instructorData, error: instructorError } = useQuery({
    queryKey: ["instructorData", instructors],
    queryFn: async () => {
      const data = await getInstructors();
      setInstructors(data)
      return data;
    }
  })

  console.log("LinkInstructorModal/students, user: ", students, user);
  if (studentError || instructorError) {
    return (
      <ErrorPage />
    )
  }

  if (!studentData || !instructorData) {
    return (
      <Loading></Loading>
    )
  }

  const currStudent = studentData.filter((student) => {
    return student.id === user?.id
  })[0]

  if (!user) {
    return (
      <ErrorPage />
    )
  }


  return (
    <ModalContainer>
      <div id="link-instructor-modal"
        className={[
          styles.modalBg,
          styles.modalPadding,

        ].join(" ")}>
        <b>Select an instructor to continue: </b>
        <EditStudent student={currStudent} setOpen={setOpen} />
      </div>
    </ModalContainer>
  )

}