import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";
import { userStore } from "@/src/stores/userStore";
import { useNavigate } from "react-router-dom";

import getStudents from "@/src/queries/GET/getStudents";
import getInstructors from "@/src/queries/GET/getInstructors";

import AdminContainer from "./containers/AdminContainer";
import SettingsContainer from "./containers/AdminContainer.Settings";


import ErrorPage from "@/src/ErrorPage";
import Spinner from "components/loading/Loading.Spinner";


export default function AdminPage() {

  const navigate = useNavigate();
  const user = useStore(userStore, (state) => state.user);


  const { data: instructorData, error: instructorError } = useQuery({
    queryKey: ["instructorData"],
    queryFn: getInstructors
  })

  const { data: studentData, error: studentError } = useQuery({
    queryKey: ["studentData"],
    queryFn: getStudents
  })

  if (!user) {
    console.log("No user detected")
    navigate("/");
    return;
  }
  if (user.role !== "admin") {
    console.log("No user detected")
    navigate("/");
    return;
  }

  if (instructorError) {
    console.log(instructorError)
    return (<ErrorPage />)
  }
  if (studentError) {
    console.log(studentError)
    return (<ErrorPage />)
  }

  if (!instructorData || !studentData) {
    console.log("No data returned for instructors or students");
    return (<Spinner />)
  }


  return (
    <>
      <AdminContainer user={user}>
        <SettingsContainer
          instructors={instructorData}
          students={studentData} />
      </AdminContainer>
    </>
  )
}