// import { QueryClientContext } from "@tanstack/react-query";
import { Question } from "../../stores/questionStore";
import { apiFetch } from "@/utils/apiFetch";
import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function getQuestions() {

  console.log("getting questions...");
  const res = await apiFetch(`${VITE_SERVER_URL}/db/questions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  console.log(res);

  if (!res.ok) {
    throw new Error(`Error while fetching questions: ${res.status}:${res.statusText}`)
  }

  const data: Question[] = await res.json();

  return data;

}