import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout,getme } from "../services/auth.api";

export const useAuth = () => {
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
        }finally{
            setIsLoading(false);
        }
    };

    const handleRegister = async (username, email, password) => {
        setIsLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data?.user);
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
    return {user,isLoading,setIsLoading,handleLogin,handleRegister,handleLogout,handleGetMe}
}