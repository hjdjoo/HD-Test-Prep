export const SERVER_URL =
  import.meta.env.MODE === "development" ?
    import.meta.env.VITE_SERVER_URL_DEV.concat("/api") :
    import.meta.env.VITE_SERVER_URL_PROD;

console.log("SERVER_URL: ", SERVER_URL)