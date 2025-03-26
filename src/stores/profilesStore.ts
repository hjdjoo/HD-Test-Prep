import { create } from "zustand";

import { ClientStudentData } from "../queries/GET/getStudents";
import { ClientInstructorData } from "../queries/GET/getInstructors";

interface ProfilesState {
  students: ClientStudentData[]
  instructors: ClientInstructorData[]
}

interface ProfilesActions {
  setStudents: (students: ProfilesState["students"]) => void
  setInstructors: (instructors: ProfilesState["instructors"]) => void
}

type ProfilesStore = ProfilesState & ProfilesActions

export const useProfilesStore = create<ProfilesStore>()((set) => ({
  students: [],
  instructors: [],
  setStudents: (students) => {
    set(() => ({
      students: students
    }))
  },
  setInstructors: (instructors) => {
    set(() => ({
      instructors: instructors
    }))
  }
}))