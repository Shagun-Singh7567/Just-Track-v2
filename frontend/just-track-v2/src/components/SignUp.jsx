import React, { useState } from "react";
import Ferrofluid from "./Ferrofluid";
import { authApi } from "../api/authApi";
import { authStorage } from "../api/authStorage";

const COLORS = {
  ink: "#14201D",
  inkLine: "#26362F",
  paper: "#F4EFE4",
  paperLine: "#E2DAC8",
  sage: "#5C7A6C",
  goldDark: "#96741F",
  textDark: "#20241F",
};

export default function SignupPage({ onSignup, onGoToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError("Fill in every field to open your ledger.");
      return;
    }

    const emailLooksValid = /\S+@\S+\.\S+/.test(trimmedEmail);
    if (!emailLooksValid) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password needs to be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      // POST /auth/signup -> AuthResponse { token, email, name }
      const res = await authApi.signup(trimmedName, trimmedEmail, password);
      authStorage.setSession(res.data);
      onSignup?.(res.data);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("An account with this email already exists.");
      } else if (err.response?.status === 400) {
        setError(
          err.response.data?.message || "Check your details and try again."
        );
      } else if (err.code === "ECONNABORTED" || !err.response) {
        setError("Couldn't reach the server. Is the backend running?");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <style>{`
        .jt-signup-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: ${COLORS.ink};
        }
        .jt-signup-grid {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
          font-family: 'Inter', system-ui, sans-serif;
        }
        @media (min-width: 768px) {
          .jt-signup-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="jt-signup-bg">
        <Ferrofluid style={{ width: "100%", height: "100%" }} />
      </div>

      <div className="jt-signup-grid" style={{ color: COLORS.textDark }}>
        <div
          style={{
            background: "rgba(20, 32, 29, 0.55)",
            color: COLORS.paper,
            display: "flex",
            flexDirection: "column",
            padding: "3rem 2.5rem",
            minHeight: "280px",
          }}
        />

        <div
          style={{
            background: COLORS.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 1.5rem",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: "360px" }}
          >
            <div style={{ marginBottom: "2rem", textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "1.75rem",
                  letterSpacing: "0.01em",
                  color: COLORS.ink,
                }}
              >
                Just Track
              </div>
              <div
                style={{
                  color: COLORS.sage,
                  fontSize: "0.85rem",
                  marginTop: "0.35rem",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                personal finance, tracked
              </div>
            </div>

            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "1.5rem",
                marginBottom: "0.25rem",
              }}
            >
              Open a ledger
            </h1>
            <p style={{ color: COLORS.sage, fontSize: "0.9rem", marginBottom: "2rem" }}>
              Create an account to start tracking.
            </p>

            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Rivera"
                autoComplete="name"
                style={inputStyle}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle}
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                style={inputStyle}
              />
            </Field>

            <Field label="Confirm password">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                style={inputStyle}
              />
            </Field>

            {error && (
              <p
                style={{
                  color: "#8C2F23",
                  fontSize: "0.85rem",
                  margin: "0 0 1rem",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: COLORS.ink,
                color: COLORS.paper,
                border: "none",
                borderRadius: "2px",
                fontSize: "0.95rem",
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.7 : 1,
                fontFamily: "'Inter', system-ui, sans-serif",
                marginTop: "0.5rem",
              }}
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>

            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.25rem",
                borderTop: `1px solid ${COLORS.paperLine}`,
                fontSize: "0.85rem",
                color: COLORS.sage,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Already have an account?</span>
              
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onGoToLogin?.();
                }}
                style={{ color: COLORS.goldDark }}
              >
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: "1.1rem" }}>
      <span
        style={{
          display: "block",
          fontSize: "0.75rem",
          color: COLORS.sage,
          marginBottom: "0.35rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  border: `1px solid ${COLORS.paperLine}`,
  borderRadius: "2px",
  background: "#FBF8F1",
  fontSize: "0.95rem",
  fontFamily: "'Inter', system-ui, sans-serif",
  color: COLORS.textDark,
  outline: "none",
  boxSizing: "border-box",
};