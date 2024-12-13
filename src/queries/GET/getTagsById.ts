import { CamelCasedProperties } from "type-fest";
import { DbTagsData } from "@/server/controllers/tagsController"

export type ClientTagsData = CamelCasedProperties<DbTagsData>

export default async function getTagsById(ids: number[]) {

  const query = ids.join(",");

  const res = await fetch(`/api/db/tags?ids=${query}`);

  if (!res.ok) {
    throw new Error(`Something went wrong while fetch tags from DB by ID: ${res.status}`)
  }

  const data = await res.json();

  console.log("getTagsById/data: ", data)

  return data as ClientTagsData;

}