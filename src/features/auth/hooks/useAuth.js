import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout,getme } from "../services/auth.api";
import { useNavigate } from "react-router";

export const useAuth = () => {

    const navigate = useNavigate()
    const context = useContext(AuthContext);
    
    const { user, setUser, isLoading, setIsLoading } = context;
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        // console.log("haddle login ",email,password)


        try {
            const data = await login({ email, password });
            setUser(data?.user);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }finally{
            setIsLoading(false);
        }
    };

    const handleRegister = async (username, email, password) => {
        setIsLoading(true);
        //  console.log("handleRegister called with:", username, email, password);
        try {
            const data = await register({ username, email, password });
            setUser(data?.user);
            return true;
            // console.log("Registration successful:", data);
        } catch (error) {
            console.error("Register failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

        const handleLogout = async () => {
        setIsLoading(true);
        await logout();
        setUser(null);
        setIsLoading(false);
        navigate("/login");
    };


    const handleGetMe = async () => {
        setIsLoading(true);
        try {
            const data = await getme();
            setUser(data.user);
            
        } catch (error) {
            console.error("Failed to get user info:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const checkUserOnLoad = async () => {
            try {
                const data = await getme();
                setUser(data?.user || null);
                // console.log("getme data:", data)
                
                

            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        checkUserOnLoad();
       
 
        

   },[])
    return {user,isLoading,setIsLoading,handleLogin,handleRegister,handleLogout,handleGetMe}
}