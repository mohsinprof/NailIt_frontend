import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import './style.scss'
import { AuthProvider } from "./features/auth/auth.context.jsx"
function App() {

  return (

      
    
      <RouterProvider router={router} />

      
  )
}

export default App
