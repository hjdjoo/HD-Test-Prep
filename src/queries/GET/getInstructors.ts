import { ClientInstructorData } from "@/src/_types/client-types";

import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function getInstructors() {

  const res = await fetch(`${VITE_SERVER_URL}/db/profiles/instructors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await res.json();

  return data as ClientInstructorData[]

}