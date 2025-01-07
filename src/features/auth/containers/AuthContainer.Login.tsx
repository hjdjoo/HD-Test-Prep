// import { useState, useEffect } from "react";
import style from "./AuthContainer.module.css"
import LoginForm from "@/src/features/auth/components/LoginForm"

interface LoginContainerProps {
  children: React.ReactNode
}

export default function LoginContainer(props: LoginContainerProps) {

  const { children } = props;

  return (
    <div className={style.container}>
      {children}
    </div>
  )
}