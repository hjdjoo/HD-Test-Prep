import { Category } from "../../stores/categoryStore";

import { SERVER_URL } from "@/src/config";

const VITE_SERVER_URL = SERVER_URL

export default async function getCategories() {

  const res = await fetch(`${VITE_SERVER_URL}/db/categories`, {
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