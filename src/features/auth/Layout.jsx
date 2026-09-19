import { Outlet } from "react-router-dom"
import { AuthProvider } from "./auth.context"
import { InterviewProvider } from "../interview.context.jsx"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./chrome.scss"

function Layout() {
    return (
        <AuthProvider>
            <InterviewProvider>
                <div className="app-shell">
                    <Navbar />
                    <div className="app-main">
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </InterviewProvider>
        </AuthProvider>
    )
}

export default Layout
