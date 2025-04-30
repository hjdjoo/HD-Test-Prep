import { Category } from "../../stores/categoryStore";
import { apiFetch } from "@/utils/apiFetch";

import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function getCategories() {

  const res = await apiFetch(`${VITE_SERVER_URL}/db/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Error while fetching categories: ${res.status}:${res.statusText}`)
  }

  const data: Category[] = await res.json();

  return data;

}