import { useEffect, useState } from "react";
import {
  getAllAccountRequests,
  approveAccountRequest,
  rejectAccountRequest,
  getAllAccounts
} from "../services/api";

function AdminDashboard({onLogout}) {
  const [requests, setRequests] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ UI TOGGLES
  const [showRequests, setShowRequests] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);

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

  return (
    <div style={{ padding: "40px" }}>
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
            const confirmLogout = window.confirm(
              "Are you sure you want to logout?"
            );
            if (confirmLogout) {
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

      {/* ================= BUTTON CONTROLS ================= */}
      <button onClick={() => setShowRequests(prev => !prev)}>
        {showRequests ? "Hide Requests" : "View Requests"}
      </button>

      <button
        onClick={() => setShowAccounts(prev => !prev)}
        style={{ marginLeft: "10px" }}
      >
        {showAccounts ? "Hide All Accounts" : "View All Accounts"}
      </button>

      <hr />

      {/* ================= ACCOUNT REQUESTS ================= */}
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
                          <button
                            onClick={() =>
                              handleApprove(req.requestId)
                            }
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleReject(req.requestId)
                            }
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

      {/* ================= ALL ACCOUNTS ================= */}
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
    </div>
  );
}

export default AdminDashboard;
