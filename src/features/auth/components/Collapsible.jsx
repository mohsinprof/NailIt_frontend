import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "../collapsible.scss";

// Reusable accordion — click the header to collapse/expand the body.
// Props:
//   title       — header text
//   icon        — optional React node (e.g. a lucide icon) shown before the title
//   badge       — optional small count pill (e.g. "3")
//   defaultOpen — start expanded (default false)
//   framed      — dark-card look for use outside existing card surfaces
export default function Collapsible({ title, icon, badge, defaultOpen = false, framed = false, children }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={`collapsible ${framed ? "framed" : ""} ${open ? "is-open" : ""}`}>
            <button
                type="button"
                className="collapsible-header"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                {icon}
                <span className="collapsible-title">{title}</span>
                {badge && <span className="collapsible-badge">{badge}</span>}
                <ChevronDown className="collapsible-chevron" size={18} />
            </button>
            {open && <div className="collapsible-body">{children}</div>}
        </div>
    );
}
