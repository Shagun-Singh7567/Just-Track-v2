import React, { useState } from "react";
import Ferrofluid from "./Ferrofluid";
import { authApi } from "../api/authApi";
import { authStorage } from "../api/authStorage";

/* ------------------------------------------------------------------
   JUST TRACK — Login page

   Auth gating (isAuthenticated, current view, logout, etc.) lives in
   the top-level App.jsx — that's the single source of truth now. This
   file only renders the login form and calls onLogin(user) once
   POST /auth/login succeeds and the JWT has been stored.

   FIXES APPLIED (earlier):
   - Two-column layout now actually responds to screen width. Previously
     the wrapper had both an inline `gridTemplateColumns: "1fr"` style
     AND a `md:grid-cols-2` Tailwind class. Inline styles always beat
     CSS classes, so the two-column layout never appeared at any width.
     Fixed by moving the grid rule into a real <style> block with a
     media query, and removing the inline style.
   - "Create one" link no longer navigates to "#"/top of page — it now
     calls a passed-in onCreateAccount handler via preventDefault.
   - Removed unused COLORS.gold (only goldDark was ever used).
   - Trimmed email input before validating so whitespace-only entries
     are caught.
   - FaultyTerminal now renders as a fixed, full-viewport background
     layer behind the entire login page (both columns), instead of a
     small 100px box tucked into the left panel. The ink panel is now
     a semi-transparent overlay so the terminal effect reads through
     it; the paper panel stays opaque since it hosts the form.
------------------------------------------------------------------- */

const COLORS = {
  ink: "#14201D",       // deep ledger-green-black
  inkLine: "#26362F",   // faint rule lines on dark panel
  paper: "#F4EFE4",     // aged paper background
  paperLine: "#E2DAC8", // hairline rules on paper
  sage: "#5C7A6C",      // muted secondary text
  goldDark: "#96741F",
  textDark: "#20241F",
};

/* ------------------------------------------------------------------
   LOGIN PAGE
------------------------------------------------------------------- */

export default function LoginPage({ onLogin, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Enter both an email and a password.");
      return;
    }

    setSubmitting(true);
    try {
      // POST /auth/login -> AuthResponse { token, email, name }
      const res = await authApi.login(trimmedEmail, password);
      authStorage.setSession(res.data);
      onLogin(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
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
      {/* Scoped responsive grid rule — inline styles can't respond to
          media queries, so this lives in a real stylesheet block. */}
      <style>{`
        .jt-login-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: ${COLORS.ink};
        }
        .jt-login-grid {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
          font-family: 'Inter', system-ui, sans-serif;
        }
        @media (min-width: 768px) {
          .jt-login-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {/* Full-viewport background layer */}
      <div className="jt-login-bg">
        <Ferrofluid style={{ width: "100%", height: "100%" }} />
      </div>

      <div className="jt-login-grid" style={{ color: COLORS.textDark }}>
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

        {/* RIGHT — login form on paper */}
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
              Welcome back
            </h1>
            <p style={{ color: COLORS.sage, fontSize: "0.9rem", marginBottom: "2rem" }}>
              Sign in to open your ledger.
            </p>

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
                placeholder="••••••••"
                autoComplete="current-password"
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
              {submitting ? "Signing in…" : "Sign in"}
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
              <span>No account yet?</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCreateAccount?.();
                }}
                style={{ color: COLORS.goldDark }}
              >
                Create one
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
