import { Outlet } from "react-router-dom"
import { AuthProvider } from "./auth.context"

function Layout() {
  return (
   
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export default Layout