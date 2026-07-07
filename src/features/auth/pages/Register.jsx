import { Link } from "react-router"

export default function Register() {
  
  // const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault()
  
}
  return (
    <main>

      <div className="form-container">
        
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required placeholder="test@gmail.com" />
            
          
          
          </div>
           <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required placeholder="Enter your username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required placeholder="••••••••" />
          </div>
          <button className="button primary-button">Register</button>
          
        </form>

        <p>Already have an account ?<Link className="link" to="/login" >Login </Link></p>
      
      
      
      </div>
      




    </main>  )
    
  
}
