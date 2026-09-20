import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { PASSWORD_RULES, unmetPasswordRules } from "../passwordRules"
import Loading from "./Loading"
import PasswordInput from "../components/PasswordInput"

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { handleRegister,isLoading, user } = useAuth()

  const unmet = unmetPasswordRules(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Client-side mirror of the backend's rules - fail fast, same message shape.
    if (unmet.length > 0) {
      setError(`Password needs ${unmet.map((r) => r.label.toLowerCase()).join(', ')}`)
      return
    }

    // Awaited: resolves to null on success, or the backend's message
    // (e.g. 'That email is already registered...').
    const message = await handleRegister(username, email, password)
    if (message) {
      setError(message)
      return
    }
    navigate("/login")   // only on success
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  if (isLoading) { 
    return(<Loading />)
  }

  return (
    <main>

      <div className="form-container">
        
        <h1>Register</h1>
        {error && <div className="form-banner is-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              
              
              type="email" id="email" name="email" required placeholder="test@gmail.com" />
            
          
          
          </div>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text" id="username" name="username" required minLength={3} maxLength={30}
              placeholder="Enter your username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              id="password" name="password" required
              placeholder="••••••••" autoComplete="new-password" />
          </div>

          {/* live strength checklist - renders only once the user starts typing */}
          {password.length > 0 && (
            <ul className="password-rules">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule.id} className={unmet.includes(rule) ? '' : 'met'}>{rule.label}</li>
              ))}
            </ul>
          )}

          <button className="button primary-button">Register</button>
          
        </form>

        <p>Already have an account ?<Link className="link" to="/login" >Login </Link></p>
      
      
      
      </div>
      




    </main>  )
    
  
}
