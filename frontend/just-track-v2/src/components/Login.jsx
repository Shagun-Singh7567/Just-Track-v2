import React, { useState, useEffect } from "react";
import JustTrackBudgetTracker from "./JustTrackBudgetTracker";

/* ------------------------------------------------------------------
   JUST TRACK — Auth gate + Login page (frontend only, no API calls)
   ------------------------------------------------------------------
   How the gating works:
   1. `isAuthenticated` lives in the top-level <App/> component.
   2. While false, we render <LoginPage/>. While true, we render
      <MainApp/> (your real dashboard/router).
   3. LoginPage calls `onLogin()` when the (fake) sign-in succeeds.
   4. This file has NO backend calls — see the comments at the bottom
      for exactly where to wire in your Spring Boot /api/auth/login
      and JWT storage later.

   FIXES APPLIED:
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // OPTION: persist "logged in" state across refreshes for the demo.
  // In the real app this becomes "is there a valid JWT in storage?"
  useEffect(() => {
    const flag = window.sessionStorage?.getItem("jt_demo_auth");
    if (flag === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    window.sessionStorage?.setItem("jt_demo_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    window.sessionStorage?.removeItem("jt_demo_auth");
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <MainApp onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}

/* ------------------------------------------------------------------
   LOGIN PAGE
------------------------------------------------------------------- */

function LoginPage({ onLogin, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Enter both an email and a password.");
      return;
    }

    // ---- FRONTEND-ONLY STUB ----
    // No network call here. Replace this block with your real
    // POST /api/auth/login call — see notes at the bottom of the file.
    // When you wire in the real call, remember to branch on failure
    // (e.g. 401 -> setError("Invalid email or password.")) instead of
    // always calling onLogin() like this stub does.
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onLogin();
    }, 500);
  };

  return (
    <div className="jt-login-grid" style={{ color: COLORS.textDark }}>
      {/* Scoped responsive grid rule — inline styles can't respond to
          media queries, so this lives in a real stylesheet block. */}
      <style>{`
        .jt-login-grid {
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

      {/* LEFT — brand strip + open slot for a component you'll add later */}
      <div
        style={{
          background: COLORS.ink,
          color: COLORS.paper,
          display: "flex",
          flexDirection: "column",
          padding: "3rem 2.5rem",
          minHeight: "280px",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "1.75rem",
              letterSpacing: "0.01em",
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

        {/* SLOT: drop a chart, illustration, or any other component here later */}
        <div
          style={{
            flex: 1,
            border: `1px dashed ${COLORS.inkLine}`,
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.sage,
            fontSize: "0.8rem",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {/* <YourComponent /> */}
        </div>
      </div>

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

function MainApp({ onLogout }) {
  return <JustTrackBudgetTracker onLogout={onLogout} />;
}
