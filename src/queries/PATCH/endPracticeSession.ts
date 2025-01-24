
const VITE_URL = process.env.VITE_URL || import.meta.env.VITE_URL

export default async function endPracticeSession(sessionId: number, status: "inactive" | "abandoned") {

  const request = {
    status: status
  }

  console.log(VITE_URL);

  const res = await fetch(`${VITE_URL}/api/db/practice_session/${sessionId}`, {
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

  console.log(data);
  return data;

}