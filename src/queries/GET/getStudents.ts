import { DbStudentData } from "@/server/controllers/profileController";
import { CamelCasedProperties } from "type-fest";

export type ClientStudentData = CamelCasedProperties<DbStudentData>


const VITE_URL = process.env.VITE_URL || import.meta.env.VITE_URL

export default async function getStudents() {

  const res = await fetch(`${VITE_URL}/api/db/profiles/students`, {

    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await res.json();

  return data as ClientStudentData[]

}