import { ClientStudentResponse } from "@/src/_types/client-types";

import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

/**
 * 
 * @param sessionId : number - ID of session to look up responses for;
 * @returns StudentResponse[] - Array of StudentResponse objects.
 */
export default async function getResponsesBySession(sessionId: number) {

  // console.log("getResponsesBySession/sessionId: ", sessionId)

  const res = await fetch(`${VITE_SERVER_URL}/db/student_responses/${sessionId}`);

  if (!res.ok) throw new Error(`Response not okay while fetching student responses by session Id. ${res.status}`);

  const dataStr: string = await res.text();

  if (!dataStr.length) return [];

  const data: ClientStudentResponse[] = JSON.parse(dataStr);

  return data;

}