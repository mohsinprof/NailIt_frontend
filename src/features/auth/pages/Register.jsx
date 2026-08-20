import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import Loading from "./Loading"

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { handleRegister,isLoading } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    handleRegister(username, email, password)
    navigate("/login")
  }

  if (isLoading) { 
    return(<Loading />)
  }

  return (
    <main>

      <div className="form-container">
        
        <h1>Register</h1>
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
              type="text" id="username" name="username" required placeholder="Enter your username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password" id="password" name="password" required placeholder="••••••••" />
          </div>
          <button className="button primary-button">Register</button>
          
        </form>

        <p>Already have an account ?<Link className="link" to="/login" >Login </Link></p>
      
      
      
      </div>
      




    </main>  )
    
  
}
