import { EditStudentForm } from "@/src/pages/admin/components/Admin.EditStudent";
import { ClientStudentData } from "../GET/getStudents";

const VITE_URL = process.env.VITE_URL || import.meta.env.VITE_URL

export default async function linkInstructor(form: EditStudentForm) {

  const studentId = form.studentId;

  const res = await fetch(`${VITE_URL}/api/db/profiles/student/${studentId}/link`, {
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