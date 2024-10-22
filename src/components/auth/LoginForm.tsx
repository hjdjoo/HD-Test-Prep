import style from "components/auth/LoginForm.module.css";
import googleIcon from "@/src/assets/icons/googleIcon.svg"


export default function LoginForm() {
  // no auth logic yet.

  return (
    <form id="auth-form" action="submit" className={style.container}>
      <h2>Login or Sign Up</h2>
      <div className={style.justifyInputs}>
        <label htmlFor="email">{`Email: `}</label>
        <input type="text" name="email" />
      </div>
      <div className={style.justifyInputs}>
        <label htmlFor="password">{`Password: `}</label>
        <input type="password" name="password" />
      </div>
      <div className={style.alignButtons}>
        <button id="signin-with-email-button">
          <a href="/practice">Login or Sign Up</a>
        </button>
        <p>or</p>
        <button id="signin-with-google-button" className={[style.sizeButton, style.alignButtonContent].join(" ")}>
          <img src={googleIcon} alt="google-icon" />
          <p>Sign In with Google</p>
        </button>
      </div>
    </form >
  )
}