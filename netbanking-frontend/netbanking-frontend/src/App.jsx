import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  // session = { userId, accountId, accountNumber }
  const [session, setSession] = useState(null);

  return (
    <div>
      <h1>NetBanking Application</h1>

      {session ? (
        <Dashboard session={session} />
      ) : (
        <Login onLogin={setSession} />
      )}
    </div>
  );
}

export default App;
