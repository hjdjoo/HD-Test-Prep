
import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function getPracticeSession(userId: number) {

  const res = await fetch(`${VITE_SERVER_URL}/db/practice_session/${userId}`);

  if (!res.ok) throw new Error(`Error while getting practice session data: ${res.status}`);

  const data = await res.text();

  if (!data.length) return null;

  const sessionData = JSON.parse(data);

  return sessionData as { id: number };

}