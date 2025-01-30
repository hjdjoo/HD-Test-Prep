import { DbInstructorData } from "@/server/controllers/profileController";
import { CamelCasedProperties } from "type-fest";

export type ClientInstructorData = CamelCasedProperties<DbInstructorData>

const VITE_URL = process.env.VITE_URL || import.meta.env.VITE_URL

export default async function getInstructors() {

  const res = await fetch(`${VITE_URL}/api/db/profiles/instructors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await res.json();

  return data as ClientInstructorData[]

}