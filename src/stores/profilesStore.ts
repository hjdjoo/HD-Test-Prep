import { create } from "zustand";

import { ClientStudentData, ClientInstructorData } from "@/src/_types/client-types";

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