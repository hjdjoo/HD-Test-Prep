import { Category } from "../../stores/categoryStore";

export default async function getCategories() {

  const res = await fetch("/api/db/categories/", {
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