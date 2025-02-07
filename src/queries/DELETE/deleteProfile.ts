
const VITE_URL = process.env.VITE_URL || import.meta.env.VITE_URL

export default async function deleteProfile(profileId: number) {

  const res = await fetch(`${VITE_URL}/api/db/profiles/${profileId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    throw new Error("Error while removing profile from db.")
  }

  const data = res.json();

  return data;
}