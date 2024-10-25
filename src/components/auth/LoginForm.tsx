import { useState, MouseEvent, FormEvent } from "react";
import style from "components/auth/LoginForm.module.css";
import googleIcon from "@/src/assets/icons/googleIcon.svg"
// import { createClient } from "@/supabase/createClient";
import createSupabase from "@/utils/supabase/client"
import { equals, isEmail } from "validator";


// interface SignupForm {
//   email: string,
//   password: string,
//   confirm: string,
// }

export default function LoginForm() {
  // no auth logic yet.
  // const blankForm = new FormData();

  const [isSignup, setIsSignup] = useState<boolean>(false);

  async function signinWithGoogle(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const supabase = createSupabase();
    const { data, error } = await supabase.auth
      .signInWithOAuth({ provider: "google" });
    if (error) {
      console.error(error);
    }
    console.table(data);
  }

  async function signinWithEmail(email: string, password: string) {

    const supabase = createSupabase();

    const { data, error } = await supabase.auth
      .signInWithPassword({ email: email, password: password });

    if (!data) {
      return { data: null, error: error }
    }

    console.log(data);

  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();
    const currentTarget = e.currentTarget
    // e.currentTarget.reset();
    try {

      const supabase = createSupabase();
      const formData = new FormData(e.currentTarget);
      const form = Object.fromEntries(formData.entries());
      // console.table(form);
      const { email, password, confirm } = form;

      if (isSignup) {

        if (!validateEmail(String(email))) {
          throw new Error("Please enter a valid email");
        }

        if (!validatePass(String(password), String(confirm))) {
          throw new Error("Passwords do not match");
        }

        const { data, error } = await supabase.auth.signUp({ email: String(email), password: String(password) });

        if (!data) {
          console.log("No data returned from server. User may already exist.")
          console.error(error);
          return;
        } else {
          console.log("Account created!");
          console.log(data);
          currentTarget.reset();
          return;
        }

      }
      if (!isSignup) {
        await signinWithEmail(String(email), String(password));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function validateEmail(email: string) {
    if (typeof email !== "string") {
      throw new Error(`expected string, got ${typeof email}`)
    }
    return isEmail(email);
  }

  function validatePass(pass: string, check: string) {

    if (typeof pass !== "string") {
      throw new Error(`expected string, got ${typeof pass}`)
    }
    if (typeof check !== "string") {
      throw new Error(`expected string, got ${typeof check}`)
    }
    return equals(pass, check)
  }


  return (
    <>
      <form id="auth-form" action="submit" onSubmit={handleSubmit} className={style.container}>
        <h2>Login or Sign Up</h2>
        <div id="email-input" className={style.justifyInputs}>
          <label htmlFor="email">{`Email: `}</label>
          <input type="text" name="email" autoComplete="email" />
        </div>
        <div id="password-input" className={style.justifyInputs}>
          <label htmlFor="password">{`Password: `}</label>
          <input type="password" name="password" autoComplete="off" />
        </div>
        {isSignup &&
          <div id="pass-confirm-input" className={style.justifyInputs}>
            <label htmlFor="confirm">{`Verify Password: `}</label>
            <input type="password" name="confirm" autoComplete="off" />
          </div>
        }
        <div className={style.alignButtons}>
          <button id="signin-with-email-button">
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <p>or</p>
          <button id="signin-with-google"
            className={[style.alignButtonContent, style.googleButton].join(" ")}
            onClick={signinWithGoogle}
          >
            <img src={googleIcon} alt="google-icon" />
            <p>Sign in with Google</p>
          </button>
        </div>
      </form >
      <div id="toggle-signup" className={style.signupToggle}>
        No Account?
        <button onClick={() => {
          setIsSignup(!isSignup)
        }}>
          Sign up with Email
        </button>
      </div>
    </>
  )
}