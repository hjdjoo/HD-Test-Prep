import { ClientFeedbackFormData } from "@/src/_types/client-types";

export default async function getFeedbackById(id: number) {

  const res = await fetch(`/api/db/feedback/${id}`);

  if (!res.ok) throw new Error(`Something went wrong while getting feedback: ${res.status}`);

  const data: ClientFeedbackFormData = await res.json();

  console.log("getFeedbackById/data: ", data);
  return data;

}