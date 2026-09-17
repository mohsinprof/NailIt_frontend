import { Outlet } from "react-router-dom"
import { AuthProvider } from "./auth.context"
import { InterviewProvider } from "../interview.context.jsx"

function Layout() {
  return (
   
    <AuthProvider>
      <InterviewProvider>

      <Outlet />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default Layout