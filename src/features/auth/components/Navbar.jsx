import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";
import "../chrome.scss";

// Top navigation — shown on every page via Layout.
// Desktop: brand | greeting | inline links (burger hidden)
// Mobile:  brand | greeting | burger (right corner) → .nav-mobile-menu mounts only while open
export default function Navbar() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="navbar">
            <div className="nav-left">
                <Link to="/" className="nav-brand" onClick={closeMenu}>
                    <Sparkles size={18} />
                    <span>NailIt</span>
                </Link>

            </div>

            {user ? (
                <div className="nav-greeting">
                    Hello, <span>{user.username || user.email}</span> 👋
                </div>
            ) : (
                <div className="nav-greeting nav-greeting--tagline">
                    AI Interview Prep
                </div>
            )}

            <div className="nav-actions">
                <nav className="nav-links">
                    {user ? (
                        <>
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/make-fresh-resume" className="nav-link">Make Fresh Resume</Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link nav-cta">Register</Link>
                        </>
                    )}
                </nav>

                {/* Burger — phones only, sits at the right corner */}
                <button
                    type="button"
                    className="nav-burger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu — exists ONLY while open */}
            {menuOpen && (
                <nav className="nav-mobile-menu">
                    {user ? (
                        <>
                            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                            <Link to="/make-fresh-resume" className="nav-link" onClick={closeMenu}>
                                Make Fresh Resume
                            </Link>
                            <div className="logout-wrapper" onClick={closeMenu}>
                                <LogoutButton />
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="nav-link nav-cta" onClick={closeMenu}>Register</Link>
                        </>
                    )}
                </nav>
            )}
        </header>
    );
}
