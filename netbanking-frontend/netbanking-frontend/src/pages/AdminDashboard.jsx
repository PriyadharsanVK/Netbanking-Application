import { useEffect, useState } from "react";
import {
  getAllAccountRequests,
  approveAccountRequest,
  rejectAccountRequest,
  getAllAccounts
} from "../services/api";
import AdminCardsPage from "./AdminCardsPage";
import AdminLoansPage from "./AdminLoansPage";

function AdminDashboard({ onLogout }) {
  const [requests, setRequests] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // UI TOGGLES
  const [showRequests, setShowRequests] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showLoans, setShowLoans] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const reqData = await getAllAccountRequests();
      const accData = await getAllAccounts();
      setRequests(reqData);
      setAccounts(accData);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleApprove(id) {
    setError("");
    setMessage("");
    try {
      await approveAccountRequest(id);
      setMessage("Account approved successfully");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(id) {
    setError("");
    setMessage("");
    try {
      await rejectAccountRequest(id);
      setMessage("Account rejected successfully");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  function resetViews() {
    setShowRequests(false);
    setShowAccounts(false);
    setShowCards(false);
    setShowLoans(false);
  }

  return (
    <div style={{ padding: "40px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >
        <h2>Welcome Admin</h2>

        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              onLogout();
            }
          }}
          style={{
            backgroundColor: "#d9534f",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* BUTTON CONTROLS */}
      <button onClick={() => {
        resetViews();
        setShowRequests(true);
      }}>
        Account Requests
      </button>

      <button
        onClick={() => {
          resetViews();
          setShowAccounts(true);
        }}
        style={{ marginLeft: "10px" }}
      >
        All Accounts
      </button>

      <button
        onClick={() => {
          resetViews();
          setShowCards(true);
        }}
        style={{ marginLeft: "10px" }}
      >
        Cards
      </button>

      <button
        onClick={() => {
          resetViews();
          setShowLoans(true);
        }}
        style={{ marginLeft: "10px" }}
      >
        Loans
      </button>

      <hr />

      {/* ACCOUNT REQUESTS */}
      {showRequests && (
        <>
          <h3>Account Requests</h3>

          {requests.length === 0 ? (
            <p>No account requests</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Request Id</th>
                  <th>User</th>
                  <th>Account Type</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.requestId}>
                    <td>{req.requestId}</td>
                    <td>{req.username}</td>
                    <td>{req.accountType}</td>
                    <td>{req.phone}</td>
                    <td>{req.status}</td>
                    <td>
                      {req.status === "PENDING" ? (
                        <>
                          <button onClick={() => handleApprove(req.requestId)}>
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.requestId)}
                            style={{ marginLeft: "10px" }}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ALL ACCOUNTS */}
      {showAccounts && (
        <>
          <h3>All Accounts</h3>

          {accounts.length === 0 ? (
            <p>No accounts found</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Account Type</th>
                  <th>Balance</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id}>
                    <td>{acc.accountNumber}</td>
                    <td>{acc.accountType}</td>
                    <td>₹{acc.balance}</td>
                    <td>{acc.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* CARDS */}
      {showCards && <AdminCardsPage />}

      {/* LOANS */}
      {showLoans && <AdminLoansPage />}
    </div>
  );
}

export default AdminDashboard;
