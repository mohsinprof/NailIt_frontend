import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../services/auth.api";
import "../auth.form.scss";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const data = await forgotPassword({ email });
      setMessage(data?.message || "If that email is registered, a reset link has been sent.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="form-container">
        <h1>Forgot password</h1>
        <p>Enter the email you registered with and we'll send you a reset link.</p>

        {error && <div className="form-banner is-error">{error}</div>}
        {message && <div className="form-banner is-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
              placeholder="test@gmail.com"
            />
          </div>

          <button className="button primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p>
          Remembered it? <Link className="link" to="/login">Back to login</Link>
        </p>
      </div>
    </main>
  );
}
