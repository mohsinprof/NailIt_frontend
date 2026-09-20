import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";
import { useState } from "react";

import Loading from "./Loading.jsx";
import PasswordInput from "../components/PasswordInput";
export default function Login() {
const { isLoading, handleLogin ,user } = useAuth()
    const [identifier, setIdentifier] = useState("")
    const [password, setpassword] = useState("")
    const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    // handleLogin resolves to null on success, or the backend's message
    // (e.g. 'Invalid email/username or password').
    const message = await handleLogin(identifier, password);
    if (message) setError(message);
  }

    // Already signed in? Never render the login form - go straight home.
    // This also covers a hard refresh / direct visit to /login while the
    // auth cookie is still valid.
    if (user) {
      return <Navigate to="/" replace />
    }

    if (isLoading) {
      return (
        <>
          <Loading/>
      </>
          
          )
    }

  return (
    <main>
      <div className="form-container">
        
        <h1>Login</h1>
        {error && <div className="form-banner is-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email or username:</label>
            <input value={identifier}
              onChange={(e) => { setIdentifier(e.target.value) }}
              type="text" id="email"  name="email" required placeholder="you@example.com or your_username" autoFocus />
            
          
          
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <PasswordInput value={password}
                 onChange={(e) => { setpassword(e.target.value) }}
              id="password" name="password" required
              placeholder="••••••••" autoComplete="current-password" />
          </div>
                    <p><Link className="link" to="/forgot-password">Forgot password?</Link></p>

          <button className="button primary-button">Login</button>
          
        </form>
      
        <p>Don't have an account ?<Link className="link" to="/register" >Register </Link></p>
       
      
      </div>
      




</main>  )
}
