
import { SERVER_URL } from "@/src/config";
import { apiFetch } from "@/utils/apiFetch";
const VITE_SERVER_URL = SERVER_URL

export default async function sendSessionSummary(pdf: Blob, sessionId: string, studentId: string) {

  const formData = new FormData();

  formData.append("pdf", pdf);

  // make fetch request to: api/mail/send
  const res = await apiFetch(`${VITE_SERVER_URL}/mail/send/${sessionId}?userId=${studentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/pdf"
    },
    body: formData
  })


  if (!res.ok) {
    throw new Error(`Something went wrong while sending session sumary. ${res.status}`)
  }

  // const data = await res.json();

  // console.log(data);

};