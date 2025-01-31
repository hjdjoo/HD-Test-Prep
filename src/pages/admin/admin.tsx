import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";
import { userStore } from "@/src/stores/userStore";
import { useProfilesStore } from "@/src/stores/profilesStore";
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
  const students = useProfilesStore((state) => state.students)
  const instructors = useProfilesStore((state) => state.instructors)
  const setStudents = useProfilesStore((state) => state.setStudents)
  const setInstructors = useProfilesStore((state) => state.setInstructors)


  const { data: instructorData, error: instructorError } = useQuery({
    queryKey: ["instructorData", instructors],
    queryFn: async () => {
      const data = await getInstructors();
      setInstructors(data);
      return data;
    }
  })

  const { data: studentData, error: studentError } = useQuery({
    queryKey: ["studentData", students],
    queryFn: async () => {
      const data = await getStudents();
      setStudents(data)
      return data;
    }
  })

  if (!user) {
    console.log("No user detected")
    navigate("/");
    return;
  }
  if (user.role !== "admin") {
    console.log("Unauthorized user detected")
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