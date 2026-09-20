import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { resetPassword } from "../services/auth.api";
import { PASSWORD_RULES, unmetPasswordRules, MIN_PASSWORD_LENGTH } from "../passwordRules";
import PasswordInput from "../components/PasswordInput";
import "../auth.form.scss";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const unmet = unmetPasswordRules(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Same client-side mirror of the backend rules as Register.jsx.
    if (unmet.length > 0) {
      setError(`Password needs ${unmet.map((r) => r.label.toLowerCase()).join(', ')}`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await resetPassword({ token, password });
      setMessage(data?.message || "Password reset successfully. You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // A reset link without ?token= can never succeed - fail fast with a way out.
  if (!token) {
    return (
      <main>
        <div className="form-container">
          <h1>Reset password</h1>
          <div className="form-banner is-error">
            This reset link is missing its token. Please request a new one.
          </div>
          <p>
            <Link className="link" to="/forgot-password">Request a new link</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Reset password</h1>

        {error && <div className="form-banner is-error">{error}</div>}
        {message && <div className="form-banner is-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">New password:</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {/* live strength checklist - renders only once the user starts typing */}
          {password.length > 0 && (
            <ul className="password-rules">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule.id} className={unmet.includes(rule) ? '' : 'met'}>{rule.label}</li>
              ))}
            </ul>
          )}

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm new password:</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button className="button primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p>
          Changed your mind? <Link className="link" to="/login">Back to login</Link>
        </p>
      </div>
    </main>
  );
}
