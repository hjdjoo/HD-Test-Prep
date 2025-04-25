import { NewProfileForm } from "@/src/_types/client-types";
import { ClientInstructorData } from "@/src/_types/client-types";
import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function addNewInstructor(form: NewProfileForm) {

  const res = await fetch(`${VITE_SERVER_URL}/db/profiles/instructor/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  if (!res.ok) {
    console.error(res.status, res.statusText);
    throw new Error("Error while adding profile to DB. Check server logs.")
  }

  const data = await res.json();

  return data as ClientInstructorData;

}