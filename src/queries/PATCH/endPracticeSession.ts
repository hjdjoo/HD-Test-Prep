export default async function endSession(sessionId: number, status: "inactive" | "abandoned") {

  const request = {
    status: status
  }

  const res = await fetch(`api/db/practice_session/${sessionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
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