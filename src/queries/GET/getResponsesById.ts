import { StudentResponse } from "containers/question/QuestionContainer";

/**
 * 
 * @param responseIds : number[] - An array of response Ids to query.
 * @returns : StudentResponse[] - An array of StudentResponse objects.
 */
export default async function getResponsesById(responseIds: number[]) {

  console.log(responseIds);

  if (!responseIds.length) {
    return [];
  }

  const responseQuery = responseIds.join(",");

  const res = await fetch(`/api/db/student_responses/?ids=${responseQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    throw new Error(`Error while getting student responses. ${res.status}`)
  }

  const data: StudentResponse[] = await res.json();

  console.log("getResponses/data: ", data);

  return data;

}