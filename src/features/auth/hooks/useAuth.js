import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout,getme } from "../services/auth.api";
import { useNavigate } from "react-router";

export const useAuth = () => {

    const navigate = useNavigate()
    const context = useContext(AuthContext);
    
    const { user, setUser, isLoading, setIsLoading } = context;
    // Resolves to null on success, or the backend's error message to display.
    const handleLogin = async (identifier, password) => {
        setIsLoading(true);
        try {
            const data = await login({ identifier, password });
            setUser(data?.user);
            return null;
        } catch (error) {
            console.error("Login failed:", error);
            return error.message || 'Something went wrong. Please try again.';
        } finally {
            setIsLoading(false);
        }
    };

    // Resolves to null on success, or the backend's error message to display.
    const handleRegister = async (username, email, password) => {
        setIsLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data?.user);
            return null;
        } catch (error) {
            console.error("Register failed:", error);
            return error.message || 'Something went wrong. Please try again.';
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