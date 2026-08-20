import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Loading from "../pages/Loading"



export default function Protected({children}) {
    const { user, isLoading } = useAuth()
    
    


    if (isLoading) { 
        return (
            <Loading/>
        )
    }
    if (!user) {
        
        return <Navigate to="/login" replace/>
    }
    
    
  return children
}
