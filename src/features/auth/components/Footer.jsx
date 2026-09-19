import { Sparkles } from "lucide-react";
import "../chrome.scss";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-brand">
                <Sparkles size={14} />
                <span>NailIt — AI interview prep & resume builder</span>
            </div>

            <span className="footer-made">
                Made with
                <span className="footer-heart" role="img" aria-label="love">❤️</span>
                by <strong>Mohsin</strong>
            </span>

            <span className="footer-copy">
                © {year} NailIt. All rights reserved.
            </span>
        </footer>
    );
}
