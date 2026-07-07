import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import NotFound from "./features/auth/pages/NotFound";
import Home from "./features/auth/pages/Home";





export const router = createBrowserRouter([
    {path: "/", element: <Home/>},
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "*",
        element: <NotFound />,
    }

])