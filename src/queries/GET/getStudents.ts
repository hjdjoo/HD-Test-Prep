import { DbStudentData } from "@/server/controllers/profileController";
import { CamelCasedProperties } from "type-fest";

export type ClientStudentData = CamelCasedProperties<DbStudentData>


const VITE_URL = process.env.VITE_URL || import.meta.env.VITE_URL

export default async function getStudents() {

  console.log("getStudents/vite_url: ", VITE_URL);

  const res = await fetch(`${VITE_URL}/api/db/profiles/students`, {

    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  console.log(res);

  const data = await res.json();
  console.log(data);

  return data as ClientStudentData[]

}