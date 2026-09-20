import { createContext, useEffect, useRef, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../../app.routes";
import { getme } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Session restore (#get-me) must run exactly ONCE per app load, no matter
    // how many routes/components mount. The ref guard also absorbs the extra
    // effect invocation React StrictMode performs in dev (main.jsx wraps the
    // app in <StrictMode>), so a refresh never fires two /get-me requests.
    const didRestoreSession = useRef(false);

    useEffect(() => {
        if (didRestoreSession.current) return;
        didRestoreSession.current = true;

        // No cleanup/cancel flag on purpose: StrictMode's simulated unmount
        // would cancel the ONLY in-flight request and leave isLoading stuck
        // on true (permanent loading screen). Setting the state of a provider
        // that never really unmounts is safe.
        (async () => {
            try {
                const data = await getme();
                setUser(data?.user || null);
            } catch (error) {
                console.error("Failed to restore the session:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

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