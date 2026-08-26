import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./components/Login";
import SignupPage from "./components/SignUp";
import JustTrackBudgetTracker from "./components/JustTrackBudgetTracker";
import SettingsPage from "./components/SettingsPage";
import Navbar from "./components/Navbar";
import { authStorage } from "./api/authStorage";
import { SettingsProvider } from "./context/SettingsContext";

export default function App() {
  // Restore session on load if a token is already sitting in sessionStorage
  // (e.g. page refresh) rather than always bouncing back to the login form.
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authStorage.isAuthenticated()
  );

  const handleLogout = useCallback(() => {
    authStorage.clear();
    setIsAuthenticated(false);
  }, []);

  // axiosConfig dispatches this when any request comes back 401 (expired
  // or invalid token), so an expired session boots back to login instead
  // of leaving the dashboard stuck on a silent "failed to load" error.
  useEffect(() => {
    window.addEventListener("jt:unauthorized", handleLogout);
    return () => window.removeEventListener("jt:unauthorized", handleLogout);
  }, [handleLogout]);

  // authApi.login/signup already stored the session before calling these,
  // so all that's left is flipping the auth flag; the route redirect
  // (see /login and /signup routes below) takes care of navigation.
  const handleLogin = () => setIsAuthenticated(true);
  const handleSignup = () => setIsAuthenticated(true);

  return (
    <SettingsProvider isAuthenticated={isAuthenticated}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <RedirectingLogin onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <RedirectingSignup onSignup={handleSignup} />
              )
            }
          />

          <Route
            element={
              <ProtectedLayout
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
            }
          >
            <Route path="/" element={<JustTrackBudgetTracker onLogout={handleLogout} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

// Wraps LoginPage so "Create account" navigates to /signup via the router
// instead of the old setView("signup") local-state toggle.
function RedirectingLogin({ onLogin }) {
  const navigate = useNavigate();
  return (
    <LoginPage
      onLogin={onLogin}
      onCreateAccount={() => navigate("/signup")}
    />
  );
}

// Mirror of RedirectingLogin for the signup -> login direction.
function RedirectingSignup({ onSignup }) {
  const navigate = useNavigate();
  return (
    <SignupPage
      onSignup={onSignup}
      onGoToLogin={() => navigate("/login")}
    />
  );
}

// Shared shell for every authenticated route: Navbar on top, routed page
// content below via <Outlet />. Bounces to /login if the session drops
// (e.g. after the jt:unauthorized listener in App fires).
function ProtectedLayout({ isAuthenticated, onLogout }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Navbar onLogout={onLogout} />
      <Outlet />
    </div>
  );
}