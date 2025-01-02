
export default async function sendSessionSummary(pdf: Blob, sessionId: string) {

  const formData = new FormData();

  formData.append("pdf", pdf);
  formData.append("sessionId", sessionId)
  // make fetch request to: api/mail/send
  const res = await fetch(`/api/mail/send/${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/pdf"
    },
    body: formData
  })


};