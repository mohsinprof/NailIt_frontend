import { useContext } from "react";
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

    // NOTE: the session restore (/api/auth/get-me) deliberately does NOT live in
    // this hook anymore. It runs exactly once inside AuthProvider
    // (features/auth/auth.context.jsx). Keeping the effect here meant every
    // component that called useAuth() - Navbar, Protected, Login, Register,
    // LogoutButton - fired its own get-me request on mount.
    return {user,isLoading,setIsLoading,handleLogin,handleRegister,handleLogout,handleGetMe}
}