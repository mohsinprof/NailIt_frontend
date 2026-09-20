import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";
import { useState } from "react";

import Loading from "./Loading.jsx";
export default function Login() {
const { isLoading, handleLogin ,user } = useAuth()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    // On success `user` is stored in AuthContext and the declarative
    // <Navigate> below sends the visitor home. On failure we stay here.
    await handleLogin(email, password);
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
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input value={email}
              onChange={(e) => { setemail(e.target.value) }}
              type="email" id="email"  name="email" required placeholder="test@gmail.com" />
            
          
          
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input value={password}
                 onChange={(e) => { setpassword(e.target.value) }}
              type="password" id="password"  name="password" required placeholder="••••••••" />
          </div>
          <button className="button primary-button">Login</button>
          
        </form>
      
        <p>Don't have an account ?<Link className="link" to="/register" >Register </Link></p>
       
      
      </div>
      




</main>  )
}
