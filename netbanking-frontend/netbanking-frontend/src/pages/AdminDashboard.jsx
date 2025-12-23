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

  /* ===================== COMMON ===================== */

  const [requests, setRequests] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* ===================== UI TOGGLES ===================== */

  const [showRequests, setShowRequests] = useState(true);
  const [showAccounts, setShowAccounts] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showLoans, setShowLoans] = useState(false);

  /* ===================== ACCOUNTS STATE ===================== */

  const [page, setPage] = useState(0);
  const size = 5;
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("DESC");

  /* ===================== REQUESTS STATE ===================== */

  const [requestFilter, setRequestFilter] = useState("PENDING");
  const [requestPage, setRequestPage] = useState(0);
  const requestPageSize = 5;
  const [requestTotalPages, setRequestTotalPages] = useState(0);

  const [requestSearch, setRequestSearch] = useState("");
  const [requestSortBy, setRequestSortBy] = useState("createdAt");
  const [requestSortDir, setRequestSortDir] = useState("DESC");

  /* ===================== LOADERS ===================== */

  async function loadRequests(status = requestFilter, page = 0) {
    try {
      const data = await getAllAccountRequests({
        status,
        page,
        size: requestPageSize
      });

      setRequests(data.content || []);
      setRequestTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadAccounts() {
    try {
      const data = await getAllAccounts({
        page,
        size,
        sortBy,
        sortDir,
        search
      });

      setAccounts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    loadRequests("PENDING", 0);
  }, []);

  useEffect(() => {
    if (showAccounts) {
      loadAccounts();
    }
  }, [page, sortBy, sortDir, search, showAccounts]);

  /* ===================== ACTIONS ===================== */

  async function handleApprove(id) {
    try {
      await approveAccountRequest(id);
      setMessage("Account approved successfully");
      loadRequests(requestFilter, requestPage);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(id) {
    try {
      await rejectAccountRequest(id);
      setMessage("Account rejected successfully");
      loadRequests(requestFilter, requestPage);
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

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortDir("ASC");
    }
  }

  /* ===================== DERIVED REQUESTS ===================== */

  const visibleRequests = [...requests]
    .filter(r =>
      r.username?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.accountType?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.phone?.includes(requestSearch)
    )
    .sort((a, b) => {
      let aVal = a[requestSortBy];
      let bVal = b[requestSortBy];

      if (!aVal || !bVal) return 0;

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return requestSortDir === "ASC" ? -1 : 1;
      if (aVal > bVal) return requestSortDir === "ASC" ? 1 : -1;
      return 0;
    });

  /* ===================== RENDER ===================== */

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2>Welcome Admin</h2>
        <button
          onClick={() => window.confirm("Logout?") && onLogout()}
          style={{
            backgroundColor: "#d9534f",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: 4
          }}
        >
          Logout
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* NAV */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => {
          resetViews();
          setShowRequests(true);
          setRequestFilter("PENDING");
          setRequestPage(0);
          loadRequests("PENDING", 0);
        }}>
          Account Requests
        </button>

        <button
          onClick={() => {
            resetViews();
            setShowAccounts(true);
            setPage(0);
          }}
          style={{ marginLeft: 10 }}
        >
          All Accounts
        </button>

        <button onClick={() => { resetViews(); setShowCards(true); }} style={{ marginLeft: 10 }}>
          Cards
        </button>

        <button onClick={() => { resetViews(); setShowLoans(true); }} style={{ marginLeft: 10 }}>
          Loans
        </button>
      </div>

      <hr />

      {/* ===================== REQUESTS ===================== */}
      {showRequests && (
        <>
          <h3>Account Requests</h3>

          <div style={{ marginBottom: 15 }}>
            {["PENDING", "APPROVED", "REJECTED"].map(s => (
              <button
                key={s}
                onClick={() => {
                  setRequestFilter(s);
                  setRequestPage(0);
                  loadRequests(s, 0);
                }}
                style={{
                  marginRight: 10,
                  fontWeight: requestFilter === s ? "bold" : "normal"
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 15 }}>
            <input
              placeholder="Search username / phone / account type"
              value={requestSearch}
              onChange={e => setRequestSearch(e.target.value)}
              style={{ marginRight: 10 }}
            />

            <select
              value={requestSortBy}
              onChange={e => setRequestSortBy(e.target.value)}
            >
              <option value="createdAt">Created Date</option>
              <option value="username">Username</option>
              <option value="accountType">Account Type</option>
            </select>

            <button
              onClick={() =>
                setRequestSortDir(d => (d === "ASC" ? "DESC" : "ASC"))
              }
              style={{ marginLeft: 10 }}
            >
              {requestSortDir === "ASC" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>

          {visibleRequests.length === 0 ? (
            <p>No {requestFilter.toLowerCase()} requests</p>
          ) : (
            <>
              <table border="1" cellPadding="8" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Account Type</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRequests.map(req => (
                    <tr key={req.requestId}>
                      <td>{req.username}</td>
                      <td>{req.accountType}</td>
                      <td>{req.phone}</td>
                      <td>{req.status}</td>
                      <td>
                        {req.status === "PENDING" ? (
                          <>
                            <button onClick={() => handleApprove(req.requestId)}>Approve</button>
                            <button onClick={() => handleReject(req.requestId)} style={{ marginLeft: 6 }}>
                              Reject
                            </button>
                          </>
                        ) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ===== PAGINATION ===== */}
              {requestTotalPages > 1 && (
                <div style={{ marginTop: 12 }}>
                  <button
                    disabled={requestPage === 0}
                    onClick={() => {
                      const p = requestPage - 1;
                      setRequestPage(p);
                      loadRequests(requestFilter, p);
                    }}
                  >
                    Prev
                  </button>

                  <span style={{ margin: "0 12px" }}>
                    Page {requestPage + 1} of {requestTotalPages}
                  </span>

                  <button
                    disabled={requestPage + 1 >= requestTotalPages}
                    onClick={() => {
                      const p = requestPage + 1;
                      setRequestPage(p);
                      loadRequests(requestFilter, p);
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ===================== ALL ACCOUNTS ===================== */}
      {showAccounts && (
        <>
          <h3>All Accounts</h3>

          <input
            placeholder="Search account number or username"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(0);
            }}
            style={{ marginBottom: 10 }}
          />

          <table border="1" cellPadding="8" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th onClick={() => toggleSort("accountNumber")} style={{ cursor: "pointer" }}>
                  Account No {sortBy === "accountNumber" && (sortDir === "ASC" ? "↑" : "↓")}
                </th>
                <th onClick={() => toggleSort("accountType")} style={{ cursor: "pointer" }}>
                  Account Type {sortBy === "accountType" && (sortDir === "ASC" ? "↑" : "↓")}
                </th>
                <th onClick={() => toggleSort("balance")} style={{ cursor: "pointer" }}>
                  Balance {sortBy === "balance" && (sortDir === "ASC" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No accounts found
                  </td>
                </tr>
              ) : (
                accounts.map(acc => (
                  <tr key={acc.id}>
                    <td>{acc.accountNumber}</td>
                    <td>{acc.accountType}</td>
                    <td>₹{acc.balance}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{ marginTop: 10 }}>
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              Prev
            </button>

            <span style={{ margin: "0 10px" }}>
              {page + 1} / {totalPages || 1}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showCards && <AdminCardsPage />}
      {showLoans && <AdminLoansPage />}
    </div>
  );
}

export default AdminDashboard;
