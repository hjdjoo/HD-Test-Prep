import { NewProfileForm } from "@/src/pages/admin/components/Admin.AddProfileForm";
import { ClientStudentData } from "@/src/_types/client-types";

const VITE_URL = process.env.VITE_URL || import.meta.env.VITE_URL

export default async function addNewProfile(form: NewProfileForm) {

  const res = await fetch(`${VITE_URL}/api/db/profiles/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  if (!res.ok) {
    console.error(res.status, res.statusText)
    throw new Error("Error while adding profile to DB. Check server logs.")
  }

  const data = await res.json();

  return data as ClientStudentData;

}