import { useState, MouseEvent, FormEvent } from "react";
import styles from "./LoginForm.module.css";
import animations from "@/src/animations.module.css";

import GoogleIcon from "@/src/assets/icons/googleIcon.svg"
import createSupabase from "@/utils/supabase/client"
import { equals, isEmail } from "validator";

import Alert, { UserAlert } from "components/alert/Alert";

// interface SignupForm {
//   email: string,
//   password: string,
//   confirm: string,
// }

export default function LoginForm() {
  // no auth logic yet.
  // const blankForm = new FormData();

  const [isSignup, setIsSignup] = useState<boolean>(false);

  const [userAlert, setUserAlert] = useState<UserAlert>({ message: "", timestamp: Date.now() });

  async function signinWithGoogle(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const supabase = createSupabase();
    const { data, error } = await supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            prompt: "select_account"
          }
        }
      });
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
    };

    console.log(data);

  };

  async function signupWithEmail(credentials: {
    email: string,
    password: string,
    confirm: string
  }) {

    try {

      const supabase = createSupabase();
      const { email, password, confirm } = credentials;

      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email");
      }

      if (!validatePass(password, confirm)) {
        throw new Error("Passwords do not match");
      }

      const { data, error } = await supabase.auth.signUp({ email: email, password: password });

      if (!data) {
        console.log("No data returned from server. User may already exist.")
        console.error(error);
        return;
      } else {
        console.log("Account created!");
        console.log(data);
        return;
      }
    } catch (e) {
      console.log("Error while signing up user with email")
      console.error(e);
    };

  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();
    const currentTarget = e.currentTarget
    // e.currentTarget.reset();
    try {
      // const supabase = createSupabase();
      const formData = new FormData(e.currentTarget);
      const form = Object.fromEntries(formData.entries());
      // console.table(form);
      const { email, password, confirm } = form;

      if (isSignup) {
        await signupWithEmail({
          email: String(email),
          password: String(password),
          confirm: String(confirm)
        })
        currentTarget.reset();
      }
      if (!isSignup) {
        const res = await signinWithEmail(String(email), String(password));

        if (!res) {
          throw new Error("No response from sign-in attempt.")
        }

        if (res.error) {
          throw new Error(res.error.message);
        }

      }
    } catch (e) {
      console.log("Error while authorizing user email");
      setUserAlert({ severity: "error", message: `${e}`, timestamp: Date.now() })
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
      <form id="auth-form" action="submit" onSubmit={handleSubmit} className={[
        styles.container
      ].join(" ")}>
        <div id="form-heading"
          className={[
            styles.sectionFullWidth,
            styles.alignHeading,
            styles.sectionSpacing,
          ].join(" ")}>
          <div id="app-name"
            className={[
              styles.sectionSpacing,
            ].join(" ")}>
            <h2>
              HD Prep
            </h2>
          </div>
          <img src="/HD-Tutors-Icon-512.png" alt="Logo"
            className={[
              styles.sectionSpacing,
              styles.logoSize,
            ].join(" ")} />
          <p className={[
            styles.fontLarge
          ].join(" ")}>
            Login or Sign Up
          </p>
        </div>
        <div id="auth-inputs"
          className={[
            styles.sectionFullWidth,
            styles.sectionSpacing
          ].join(" ")}>
          <div id="email-input" className={[
            styles.justifyInputs
          ].join(" ")}>
            <label htmlFor="email"
              className={[
                styles.labelStyle,
              ].join(" ")}
            >{`Email: `}</label>
            <input type="text" name="email" autoComplete="email"
              className={[
                styles.inputStyle,
                styles.inputSize,
                styles.rounded
              ].join(" ")} />
          </div>
          <div id="password-input" className={[
            styles.justifyInputs
          ].join(" ")}>
            <label htmlFor="password"
              className={[
                styles.labelStyle,
              ].join(" ")}
            >{`Password: `}</label>
            <input type="password" name="password" autoComplete="off"
              className={[
                styles.inputStyle,
                styles.inputSize,
                styles.rounded
              ].join(" ")} />
          </div>
        </div>
        {isSignup &&
          <div id="pass-confirm-input"
            className={[
              styles.justifyInputs
            ].join(" ")}>
            <label htmlFor="confirm">{`Verify Password: `}</label>
            <input type="password" name="confirm" autoComplete="off"
              className={[
                styles.inputStyle,
                styles.rounded,
              ].join(" ")} />
          </div>
        }
        <div className={[
          styles.alignButtons
        ].join(" ")}>
          <button id="signin-with-email-button"
            className={[
              styles.rounded,
              styles.buttonStyle,
              animations["highlight"]
            ].join(" ")}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <p className={styles.spaceButtons}>or</p>
          <button id="signin-with-google"
            className={[
              styles.rounded,
              styles.buttonStyle,
              styles.alignButtonContent,
              styles.googleButton,
              animations.highlight
            ].join(" ")}
            onClick={signinWithGoogle}
          >
            <div className={[
              styles.googleIcon
            ].join(" ")}>
              <GoogleIcon />
            </div>
            <p>Sign in with Google</p>
          </button>
        </div>
      </form >
      <div id="toggle-signup" className={styles.signupToggle}>
        No Account?
        <button onClick={() => {
          setIsSignup(!isSignup)
        }}>
          Sign up with Email
        </button>
      </div>
      {
        userAlert.severity &&
        <Alert alert={userAlert}></Alert>
      }
    </>
  )
}