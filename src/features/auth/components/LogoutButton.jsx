import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "../../interview/styles/logout.button.scss";

// Shared logout button — drop <LogoutButton /> on any authenticated page.
export default function LogoutButton() {
    const { handleLogout, isLoading } = useAuth();

    return (
        <button
            className="logout-btn"
            onClick={handleLogout}
            disabled={isLoading}
            title="Log out of NailIt"
        >
            <LogOut size={15} />
            <span>Logout</span>
        </button>
    );
}
