import style from "components/auth/LoginForm.module.css"

export default function LoginForm () {

  return (
    <form id="auth-form" action="submit" className={style.container}>
      <h2>Login/Signup</h2>
      <div className={style.justifyInputs}>
        <label htmlFor="email">{`Email: `}</label>
        <input type="text" name="email"/>
      </div>
      <div className={style.justifyInputs}>
        <label htmlFor="password">{`Password: `}</label>
        <input type="password" name="password"/>
      </div>
      <button>Login/Signup</button>
    </form>
  )
}