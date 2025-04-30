import { StudentResponse } from "@/src/_types/client-types";

import { SERVER_URL } from "@/src/config";
import { apiFetch } from "@/utils/apiFetch";
const VITE_SERVER_URL = SERVER_URL
/**
 * 
 * @param responseIds : number[] - An array of response Ids to query.
 * @returns : StudentResponse[] - An array of StudentResponse objects.
 */
export default async function getResponsesById(responseIds: number[]) {

  // console.log(responseIds);

  if (!responseIds.length) {
    return [];
  }

  const responseQuery = responseIds.join(",");

  const res = await apiFetch(`${VITE_SERVER_URL}/db/student_responses/?ids=${responseQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    throw new Error(`Error while getting student responses. ${res.status}`)
  }

  const data: StudentResponse[] = await res.json();

  // console.log("getResponses/data: ", data);

  return data;

}