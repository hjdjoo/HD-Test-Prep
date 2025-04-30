
import { SERVER_URL } from "@/src/config";
import { apiFetch } from "@/utils/apiFetch";
const VITE_SERVER_URL = SERVER_URL

export default async function endPracticeSession(sessionId: number, status: "inactive" | "abandoned") {

  const request = {
    status: status
  }

  const res = await apiFetch(`${VITE_SERVER_URL}/db/practice_session/${sessionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request)
  })

  if (!res.ok) {
    throw new Error(`Error while ending session in DB: ${res.status}`)
  }

  const data = await res.json();

  // console.log(data);
  return data;

}