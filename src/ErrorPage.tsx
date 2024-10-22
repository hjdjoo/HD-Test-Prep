import style from "@/src/ErrorPage.module.css"
import { useRouteError } from "react-router-dom";

export default function ErrorPage () {

  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className={style.container}>
      <h1>Oops!</h1>
      <img src="/resources/public/404.jpg"></img>
      <br />
      <p>Something has gone terribly wrong.</p>
    </div>
  )
}