import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { resetPassword } from "../services/auth.api";
import "../auth.form.scss";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
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
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              placeholder="••••••••"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm new password:</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="••••••••"
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
