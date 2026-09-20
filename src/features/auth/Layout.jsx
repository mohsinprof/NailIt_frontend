import { Outlet } from "react-router-dom"
import { InterviewProvider } from "../interview.context.jsx"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./chrome.scss"

function Layout() {
    // NOTE: there is deliberately NO <AuthProvider> here.
    // The one and only AuthProvider lives in auth.context.jsx (AppWithProvider),
    // ABOVE <RouterProvider>, so the session is restored exactly once per page
    // load instead of once per nested provider. Keeping a second provider here
    // would create independent state and re-trigger the /get-me call.
    return (
        <InterviewProvider>
            <div className="app-shell">
                <Navbar />
                <div className="app-main">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </InterviewProvider>
    )
}

export default Layout
