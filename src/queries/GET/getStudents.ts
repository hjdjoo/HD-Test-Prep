import { ClientStudentData } from "@/src/_types/client-types";

import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function getStudents() {

  // console.log("getStudents/vite_url: ", VITE_URL);

  const res = await fetch(`${VITE_SERVER_URL}/db/profiles/students`, {

    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  // console.log(res);

  const data = await res.json();
  // console.log(data);

  return data as ClientStudentData[]

}