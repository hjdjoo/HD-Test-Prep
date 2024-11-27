export default async function getTags() {

  const res = await fetch("/api/db/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    throw new Error(`Error while fetching tags: ${res.status}:${res.statusText}`)
  }

  const data: { [tag: string]: number } = await res.json(); // should return transformed data: {[tag]: number}
  // console.log("tagStore/getTags/data: ", data);

  return data;

}