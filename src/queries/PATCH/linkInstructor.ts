import { EditStudentForm, ClientStudentData } from "@/src/_types/client-types";

import { SERVER_URL } from "@/src/config";
import { apiFetch } from "@/utils/apiFetch";
const VITE_SERVER_URL = SERVER_URL

export default async function linkInstructor(form: EditStudentForm) {

  const studentId = form.studentId;

  const res = await apiFetch(`${VITE_SERVER_URL}/db/profiles/student/${studentId}/link`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  if (!res.ok) {
    throw new Error("Error while linking student and instructor in DB")
  }

  const data = await res.json();

  return data as ClientStudentData;

}