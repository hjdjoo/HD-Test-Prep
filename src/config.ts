export const SERVER_URL =
  import.meta.env.MODE === "development" ?
    import.meta.env.VITE_SERVER_URL_DEV :
    import.meta.env.VITE_SERVER_URL_PROD;