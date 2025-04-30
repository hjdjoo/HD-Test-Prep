import { ClientFeedbackFormData } from "@/src/_types/client-types";

import { SERVER_URL } from "@/src/config";
import { apiFetch } from "@/utils/apiFetch";

const VITE_SERVER_URL = SERVER_URL

export default async function getFeedbackById(id: number) {

  const res = await apiFetch(`${VITE_SERVER_URL}/db/feedback/${id}`);

  if (!res.ok) throw new Error(`Something went wrong while getting feedback: ${res.status}`);

  const data: ClientFeedbackFormData = await res.json();

  // console.log("getFeedbackById/data: ", data);
  return data;

}