import React, { useState, useEffect, useCallback } from "react";
import LoginPage from "./components/Login";
import SignupPage from "./components/SignUp";
import JustTrackBudgetTracker from "./components/JustTrackBudgetTracker";
import { authStorage } from "./api/authStorage";
import { SettingsProvider } from "./context/SettingsContext";

export default function App() {
  // Restore session on load if a token is already sitting in sessionStorage
  // (e.g. page refresh) rather than always bouncing back to the login form.
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authStorage.isAuthenticated()
  );
  const [view, setView] = useState("login"); // "login" | "signup"

  const handleLogout = useCallback(() => {
    authStorage.clear();
    setIsAuthenticated(false);
    setView("login");
  }, []);

  // axiosConfig dispatches this when any request comes back 401 (expired
  // or invalid token), so an expired session boots back to login instead
  // of leaving the dashboard stuck on a silent "failed to load" error.
  useEffect(() => {
    window.addEventListener("jt:unauthorized", handleLogout);
    return () => window.removeEventListener("jt:unauthorized", handleLogout);
  }, [handleLogout]);

  // authApi.login/signup already stored the session before calling these,
  // so all that's left is flipping the view.
  const handleLogin = () => setIsAuthenticated(true);
  const handleSignup = () => setIsAuthenticated(true);

  return (
    <SettingsProvider isAuthenticated={isAuthenticated}>
      {isAuthenticated ? (
        <MainApp onLogout={handleLogout} />
      ) : view === "signup" ? (
        <SignupPage
          onSignup={handleSignup}
          onGoToLogin={() => setView("login")}
        />
      ) : (
        <LoginPage
          onLogin={handleLogin}
          onCreateAccount={() => setView("signup")}
        />
      )}
    </SettingsProvider>
  );
}

function MainApp({ onLogout }) {
  return <JustTrackBudgetTracker onLogout={onLogout} />;
}