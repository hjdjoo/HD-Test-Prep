
import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function deleteInstructor(instructorId: number) {

  const res = await fetch(`${VITE_SERVER_URL}/db/profiles/instructor/${instructorId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    throw new Error("Error while removing profile from db.")
  }

  const data = res.json();

  return data;

}