// import { useState, useEffect } from "react";
import style from "./LoginContainer.module.css"
import LoginForm from "components/auth/LoginForm"


export default function LoginContainer() {
  return (
    <div className={style.container}>
      <LoginForm />
    </div>
  )
}