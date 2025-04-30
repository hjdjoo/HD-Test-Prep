import { ProblemType } from "../../stores/categoryStore";
import { apiFetch } from "@/utils/apiFetch";

import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function getProblemTypes() {

  const res = await apiFetch(`${VITE_SERVER_URL}/db/problem_types`, {
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