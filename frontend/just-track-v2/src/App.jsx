import { useState } from "react";
import JustTrackBudgetTracker from "./components/JustTrackBudgetTracker";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    return <JustTrackBudgetTracker onLogout={() => setIsAuthenticated(false)} />;
  }

  return <Login onLogin={() => setIsAuthenticated(true)} />;
}

export default App;