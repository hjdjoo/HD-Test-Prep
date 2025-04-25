// export default async function endSession(sessionId: number) {

//   const res = await fetch(`api/db/practice_session/${sessionId}`, {
//     method: "",
//     headers: {
//       "Content-Type": "application/json"
//     },
//   })

//   if (!res.ok) {
//     throw new Error(`Error while deleting session from DB: ${res.status}`)
//   }

//   const data = await res.json();

//   // console.log(data);
//   return data;

// }