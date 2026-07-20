import React, { useState } from "react";
import LoginPage from "./components/Login";
import SignupPage from "./components/SignUp";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState("login"); // "login" | "signup"

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);
  const handleSignup = () => setIsAuthenticated(true); // for now, treat signup as instant login

  if (isAuthenticated) {
    return <MainApp onLogout={handleLogout} />;
  }

  return view === "signup" ? (
    <SignupPage
      onSignup={handleSignup}
      onGoToLogin={() => setView("login")}
    />
  ) : (
    <LoginPage
      onLogin={handleLogin}
      onCreateAccount={() => setView("signup")}
    />
  );
}