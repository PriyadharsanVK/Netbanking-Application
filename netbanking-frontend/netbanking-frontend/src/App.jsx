import { useState } from "react";
import Login from "./pages/Login.jsx";
import SelectAccount from "./pages/SelectAccount.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ManageBeneficiaries from "./pages/ManageBeneficiaries.jsx";
import Transfer from "./pages/Transfer.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CardsPage from "./pages/CardsPage";
import LoansPage from "./pages/LoansPage";

function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("session");
    return saved ? JSON.parse(saved) : null;
  });

  const [account, setAccount] = useState(() => {
    const saved = localStorage.getItem("account");
    return saved ? JSON.parse(saved) : null;
  });

  const [screen, setScreen] = useState("dashboard");

  function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("session");
    localStorage.removeItem("account");

    setSession(null);
    setAccount(null);
    setScreen("dashboard");
  }

  /* ---------- NOT LOGGED IN ---------- */
  if (!session) {
    return <Login onLogin={setSession} />;
  }

  /* ---------- ADMIN FLOW ---------- */
  if (session.role === "ADMIN") {
    return (
      <AdminDashboard
        admin={session}
        onLogout={handleLogout}
      />
    );
  }

  /* ---------- USER FLOW ---------- */
  if (!account) {
    return (
      <SelectAccount
        userId={session.userId}
        onSelectAccount={setAccount}
      />
    );
  }

  const userSession = {
    userId: session.userId,
    accountId: account.id,
    accountNumber: account.accountNumber
  };

  return (
    <div>
      {/* LOGOUT */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#d9534f",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          Logout
        </button>
      </div>

      {/* NAV BAR */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setScreen("dashboard")}>Dashboard</button>

        <button
          onClick={() => setScreen("beneficiaries")}
          style={{ marginLeft: "10px" }}
        >
          Manage Beneficiaries
        </button>

        <button
          onClick={() => setScreen("transfer")}
          style={{ marginLeft: "10px" }}
        >
          Transfer
        </button>

        <button
          onClick={() => setScreen("cards")}
          style={{ marginLeft: "10px" }}
        >
          Cards
        </button>

        <button
          onClick={() => setScreen("loans")}
          style={{ marginLeft: "10px" }}
        >
          Loans
        </button>
      </div>

      {/* SCREEN SWITCH */}
      {screen === "dashboard" && <Dashboard session={userSession} />}
      {screen === "beneficiaries" && (
        <ManageBeneficiaries session={userSession} />
      )}
      {screen === "transfer" && <Transfer session={userSession} />}
      {screen === "cards" && <CardsPage session={userSession} />}
      {screen === "loans" && <LoansPage session={userSession} />}
    </div>
  );
}

export default App;
