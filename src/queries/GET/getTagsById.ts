/**
 * @param ids :number[] - list of tag ids
 * @returns Object: {[tagId: string]: string} - tagId coerced into string, with the name of the tag as the value.
 */
export default async function getTagsById(ids: number[]) {

  const query = ids.join(",");

  const res = await fetch(`/api/db/tags?ids=${query}`);

  if (!res.ok) {
    throw new Error(`Something went wrong while fetch tags from DB by ID: ${res.status}`)
  }

  const data = await res.json();

  console.log("getTagsById/data: ", data);

  return data as { [tagId: string]: string };

}