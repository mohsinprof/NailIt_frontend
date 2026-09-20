import { createBrowserRouter} from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import NotFound from "./features/auth/pages/NotFound";
import Protected from "./features/auth/components/Protected";
import Layout from "./features/auth/Layout";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import MakeFreshResumeForm from "./features/makeFreshResume/pages/MakeFreshResume";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";


export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Protected><Home /></Protected>,
            },
            {
                path: "/interview/:interviewId",
                element:<Protected><Interview /></Protected>
            },
            {
                path: "/make-fresh-resume",
                element:<Protected>

                 < MakeFreshResumeForm />
                </Protected>
                   
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
                        {
                path: "/forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "/reset-password",
                element: <ResetPassword />,
            },

            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);