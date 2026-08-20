import { createContext,  useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../../app.routes";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function AppWithProvider() {
    return (
        <AuthProvider>
            {/* ✅ FIXED: Added the > at the end of the line */}
            <RouterProvider router={router} />
            {/* ✅ React components automatically close themselves with /> */}
        </AuthProvider>
    );
}