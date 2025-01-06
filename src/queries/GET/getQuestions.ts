// import { QueryClientContext } from "@tanstack/react-query";
import { Question } from "../../stores/questionStore";

export default async function getQuestions() {

  const res = await fetch("/api/db/questions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Error while fetching questions: ${res.status}:${res.statusText}`)
  }

  const data: Question[] = await res.json();

  return data;

}