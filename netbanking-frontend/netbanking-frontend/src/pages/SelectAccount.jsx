import { useEffect, useState } from "react";
import {
  getUserAccounts,
  getUserAccountRequests
} from "../services/api.js";
import RequestAccount from "./RequestAccount.jsx";

function SelectAccount({ userId, onSelectAccount }) {
  const [accounts, setAccounts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    if (userId) {
      localStorage.removeItem("account");
      loadData();
    }
  }, [userId]);

  async function loadData() {
    try {
      const accData = await getUserAccounts(userId);
      const reqData = await getUserAccountRequests(userId);

      setAccounts(accData || []);
      setRequests(reqData || []);
    } catch (err) {
      setError(err.message);
    }
  }

  const hasPendingRequest = requests.some(
    r => r.status === "PENDING"
  );

  function handleSelectAccount(acc) {
    const normalizedAccount = {
      id: acc.accountId,      // ✅ FORCE id
      accountId: acc.accountId,
      accountNumber: acc.accountNumber,
      accountType: acc.accountType,
      balance: acc.balance,
      status: acc.status
    };

    localStorage.setItem(
      "account",
      JSON.stringify(normalizedAccount)
    );

    onSelectAccount(normalizedAccount);
  }


  if (showRequest) {
    return (
      <RequestAccount
        userId={userId}
        onBack={() => {
          setShowRequest(false);
          loadData();
        }}
      />
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Select Account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ACCOUNTS */}
      {accounts.length === 0 ? (
        <p>You don’t have any accounts yet.</p>
      ) : (
        <ul>
          {accounts.map(acc => (
            <li key={acc.id ?? acc.accountId}>
              <b>{acc.accountNumber}</b> | {acc.accountType}
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleSelectAccount(acc)}
              >
                Login
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* ACCOUNT REQUEST STATUS */}
      <h3>Account Requests</h3>

      {requests.length === 0 ? (
        <p>No account requests yet.</p>
      ) : (
        <ul>
          {requests.map(r => (
            <li key={r.id}>
              {r.accountType} — <b>{r.status}</b>
            </li>
          ))}
        </ul>
      )}

      <br />

      <button
        disabled={hasPendingRequest}
        onClick={() => setShowRequest(true)}
      >
        {hasPendingRequest
          ? "Account Request Pending"
          : "Request New Account"}
      </button>
    </div>
  );
}

export default SelectAccount;
