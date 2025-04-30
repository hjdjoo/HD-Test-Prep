
import { SERVER_URL } from "@/src/config";
import { apiFetch } from "@/utils/apiFetch";
const VITE_SERVER_URL = SERVER_URL

export default async function startPracticeSession(userId: number, type: "random" | "structured") {

  const query = {
    id: userId,
    type: type
  }

  const res = await apiFetch(`${VITE_SERVER_URL}/db/practice_session/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(query),
  });

  if (!res.ok) {
    throw new Error(`Something went wrong while initializing practice session: ${res.status}: ${res.statusText}`)
  }
  // return session ID
  const data: { id: number } = await res.json();

  return data;

}