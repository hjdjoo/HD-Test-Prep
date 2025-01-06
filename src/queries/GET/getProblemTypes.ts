import { ProblemType } from "../../stores/categoryStore";

export default async function getProblemTypes() {

  const res = await fetch("/api/db/problem_types", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Error while fetching problem types: ${res.status}:${res.statusText}`)
  }

  const data: ProblemType[] = await res.json();

  return data;

}