import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Password input with a show/hide eye toggle.
 * Every other prop (value, onChange, id, name, required, autoFocus,
 * autoComplete, minLength, placeholder) is spread onto the <input>,
 * so call sites keep using it exactly like a normal input.
 */
export default function PasswordInput({ id, name, ...props }) {
    const [show, setShow] = useState(false);

    return (
        <div className="password-field">
            <input
                {...props}
                id={id}
                name={name}
                type={show ? "text" : "password"}
            />
            <button
                type="button"   // never submits the form
                className="toggle-password"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}