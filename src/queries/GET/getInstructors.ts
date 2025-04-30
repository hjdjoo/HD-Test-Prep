import { ClientInstructorData } from "@/src/_types/client-types";
import { SERVER_URL } from "@/src/config";
import { apiFetch } from "@/utils/apiFetch";

const VITE_SERVER_URL = SERVER_URL

export default async function getInstructors() {

  const res = await apiFetch(`${VITE_SERVER_URL}/db/profiles/instructors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await res.json();

  return data as ClientInstructorData[]

}