import { useEffect, useState } from "react";
import {
  getAllAccountRequests,
  approveAccountRequest,
  rejectAccountRequest,
  getAllAccounts
} from "../services/api";
import AdminCardsPage from "./AdminCardsPage";
import AdminLoansPage from "./AdminLoansPage";

const REQUEST_PAGE_SIZE = 5;
const ACCOUNT_PAGE_SIZE = 5;

function AdminDashboard({ onLogout }) {

  /* ===================== COMMON ===================== */
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* ===================== UI TOGGLES ===================== */
  const [showRequests, setShowRequests] = useState(true);
  const [showAccounts, setShowAccounts] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showLoans, setShowLoans] = useState(false);

  /* ===================== ACCOUNTS ===================== */
  const [accounts, setAccounts] = useState([]);
  const [accountPage, setAccountPage] = useState(0);
  const [accountTotalPages, setAccountTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("DESC");

  /* ===================== REQUESTS ===================== */
  const [requestView, setRequestView] = useState("PENDING");
  const [historyStatus, setHistoryStatus] = useState("ALL");

  const [requests, setRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);

  const [requestPage, setRequestPage] = useState(0);
  const [requestTotalPages, setRequestTotalPages] = useState(0);
  const [requestSearch, setRequestSearch] = useState("");

  /* ===================== LOADERS ===================== */

  async function loadPendingRequests(page = 0) {
    const data = await getAllAccountRequests({
      status: "PENDING",
      page,
      size: REQUEST_PAGE_SIZE
    });

    setRequests(data.content || []);
    setRequestTotalPages(data.totalPages || 0);
  }

  async function loadHistoryRequests() {
    const approved = await getAllAccountRequests({
      status: "APPROVED",
      page: 0,
      size: 1000
    });

    const rejected = await getAllAccountRequests({
      status: "REJECTED",
      page: 0,
      size: 1000
    });

    setHistoryRequests([
      ...(approved.content || []),
      ...(rejected.content || [])
    ]);
  }

  async function loadAccounts() {
    const data = await getAllAccounts({
      page: accountPage,
      size: ACCOUNT_PAGE_SIZE,
      sortBy,
      sortDir,
      search
    });

    setAccounts(data.content || []);
    setAccountTotalPages(data.totalPages || 0);
  }

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    loadPendingRequests(0);
  }, []);

  useEffect(() => {
    if (showAccounts) {
      loadAccounts();
    }
  }, [showAccounts, accountPage, sortBy, sortDir, search]);

  /* ===================== ACTIONS ===================== */

  async function handleApprove(id) {
    await approveAccountRequest(id);
    setMessage("Account approved successfully");
    loadPendingRequests(requestPage);
  }

  async function handleReject(id) {
    await rejectAccountRequest(id);
    setMessage("Account rejected successfully");
    loadPendingRequests(requestPage);
  }

  function resetViews() {
    setShowRequests(false);
    setShowAccounts(false);
    setShowCards(false);
    setShowLoans(false);
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => (d === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortDir("ASC");
    }
  }

  /* ===================== DERIVED REQUESTS ===================== */

  const filteredHistory = historyRequests
    .filter(r => historyStatus === "ALL" || r.status === historyStatus)
    .filter(r =>
      r.username?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.accountType?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.phone?.includes(requestSearch)
    );

  const historyTotalPages = Math.ceil(filteredHistory.length / REQUEST_PAGE_SIZE);

  const paginatedHistory = filteredHistory.slice(
    requestPage * REQUEST_PAGE_SIZE,
    (requestPage + 1) * REQUEST_PAGE_SIZE
  );

  const visibleRequests =
    requestView === "PENDING" ? requests : paginatedHistory;

  const rowCount =
    requestView === "PENDING"
      ? requests.length
      : filteredHistory.length;

  const totalPages =
    requestView === "PENDING"
      ? requestTotalPages
      : historyTotalPages;

  /* ===================== RENDER ===================== */

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome Admin</h2>
        <button onClick={onLogout} style={{ background: "#d9534f", color: "white" }}>
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
          setRequestView("PENDING");
          setRequestPage(0);
          loadPendingRequests(0);
        }}>
          Account Requests
        </button>

        <button onClick={() => {
          resetViews();
          setShowAccounts(true);
          setAccountPage(0);
        }} style={{ marginLeft: 10 }}>
          All Accounts
        </button>

        <button onClick={() => { resetViews(); setShowCards(true); }} style={{ marginLeft: 10 }}>
          Cards
        </button>

        <button onClick={() => { resetViews(); setShowLoans(true); }} style={{ marginLeft: 10 }}>
          Loans
        </button>
      </div>

      {/* ===================== REQUESTS ===================== */}
      {showRequests && (
        <>
          <h3>Account Requests</h3>

          <button onClick={() => {
            setRequestView("PENDING");
            setRequestPage(0);
            loadPendingRequests(0);
          }}>
            Pending
          </button>

          <button onClick={() => {
            setRequestView("HISTORY");
            setHistoryStatus("ALL");
            setRequestPage(0);
            loadHistoryRequests();
          }} style={{ marginLeft: 10 }}>
            Approved / Rejected
          </button>

          {requestView === "HISTORY" && (
            <select
              value={historyStatus}
              onChange={e => {
                setHistoryStatus(e.target.value);
                setRequestPage(0);
              }}
              style={{ marginLeft: 10 }}
            >
              <option value="ALL">All</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          )}

          <input
            placeholder="Search..."
            value={requestSearch}
            onChange={e => setRequestSearch(e.target.value)}
            style={{ display: "block", margin: "10px 0" }}
          />

          <p style={{ fontSize: 13, color: "gray" }}>
            Showing {rowCount} request{rowCount !== 1 && "s"}
          </p>

          {visibleRequests.length === 0 ? (
            <p>No requests found</p>
          ) : (
            <>
              <table border="1" width="100%" cellPadding="8">
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

              {totalPages > 1 && (
                <div style={{ marginTop: 10 }}>
                  <button
                    disabled={requestPage === 0}
                    onClick={() => setRequestPage(p => p - 1)}
                  >
                    Prev
                  </button>

                  <span style={{ margin: "0 10px" }}>
                    Page {requestPage + 1} of {totalPages}
                  </span>

                  <button
                    disabled={requestPage + 1 >= totalPages}
                    onClick={() => setRequestPage(p => p + 1)}
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
              setAccountPage(0);
            }}
            style={{ marginBottom: 10 }}
          />

          <p style={{ fontSize: 13, color: "gray" }}>
            Showing {accounts.length} account(s)
          </p>

          <table border="1" width="100%" cellPadding="8">
            <thead>
              <tr>
                <th onClick={() => toggleSort("accountNumber")}>Account No</th>
                <th onClick={() => toggleSort("accountType")}>Type</th>
                <th onClick={() => toggleSort("balance")}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="3" align="center">No accounts found</td>
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

          {accountTotalPages > 1 && (
            <div style={{ marginTop: 10 }}>
              <button
                disabled={accountPage === 0}
                onClick={() => setAccountPage(p => p - 1)}
              >
                Prev
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {accountPage + 1} of {accountTotalPages}
              </span>

              <button
                disabled={accountPage + 1 >= accountTotalPages}
                onClick={() => setAccountPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showCards && <AdminCardsPage />}
      {showLoans && <AdminLoansPage />}

    </div>
  );
}

export default AdminDashboard;
