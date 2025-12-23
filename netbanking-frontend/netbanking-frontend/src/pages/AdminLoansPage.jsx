import { useEffect, useState } from "react";
import {
  getAllLoanRequests,
  approveLoanRequest,
  rejectLoanRequest,
  getAllLoans
} from "../services/api.js";

function AdminLoansPage() {

  /* ===================== STATE ===================== */

  const [loanRequests, setLoanRequests] = useState([]);
  const [loans, setLoans] = useState([]);

  const [showLoans, setShowLoans] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* ===================== REQUESTS STATE ===================== */

  const [requestStatus, setRequestStatus] = useState("PENDING");
  const [requestSearch, setRequestSearch] = useState("");
  const [requestSortBy, setRequestSortBy] = useState("createdAt");
  const [requestSortDir, setRequestSortDir] = useState("DESC");
  const [requestPage, setRequestPage] = useState(0);
  const requestPageSize = 5;

  /* ===================== ISSUED LOANS STATE ===================== */

  const [loanSearch, setLoanSearch] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState("ALL");
  const [loanSortBy, setLoanSortBy] = useState("createdAt");
  const [loanSortDir, setLoanSortDir] = useState("DESC");
  const [loanPage, setLoanPage] = useState(0);
  const loanPageSize = 5;

  /* ===================== LOADERS ===================== */

  useEffect(() => {
    loadLoanRequests();
  }, []);

  async function loadLoanRequests() {
    try {
      const data = await getAllLoanRequests();
      setLoanRequests(data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadLoans() {
    try {
      const data = await getAllLoans();
      setLoans(data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ===================== ACTIONS ===================== */

  async function handleApprove(id) {
    try {
      await approveLoanRequest(id);
      setMessage("Loan approved");
      loadLoanRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(id) {
    try {
      await rejectLoanRequest(id);
      setMessage("Loan rejected");
      loadLoanRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleLoans() {
    if (!showLoans) loadLoans();
    setShowLoans(prev => !prev);
  }

  function toggleRequestSort(field) {
    if (requestSortBy === field) {
      setRequestSortDir(d => (d === "ASC" ? "DESC" : "ASC"));
    } else {
      setRequestSortBy(field);
      setRequestSortDir("ASC");
    }
  }

  function toggleLoanSort(field) {
    if (loanSortBy === field) {
      setLoanSortDir(d => (d === "ASC" ? "DESC" : "ASC"));
    } else {
      setLoanSortBy(field);
      setLoanSortDir("ASC");
    }
  }

  /* ===================== DERIVED – REQUESTS ===================== */

  const filteredRequests = loanRequests
    .filter(r => r.status === requestStatus)
    .filter(r =>
      r.account?.accountNumber?.includes(requestSearch) ||
      r.loanType?.toLowerCase().includes(requestSearch.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = a[requestSortBy];
      let bVal = b[requestSortBy];

      if (requestSortBy === "principalAmount") {
        return requestSortDir === "ASC" ? aVal - bVal : bVal - aVal;
      }

      return requestSortDir === "ASC"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const paginatedRequests = filteredRequests.slice(
    requestPage * requestPageSize,
    requestPage * requestPageSize + requestPageSize
  );

  const requestTotalPages = Math.ceil(
    filteredRequests.length / requestPageSize
  );

  /* ===================== DERIVED – ISSUED LOANS ===================== */

  const loanTypes = [...new Set(loans.map(l => l.loanType))];

  const filteredLoans = loans
    .filter(l =>
      loanTypeFilter === "ALL" ? true : l.loanType === loanTypeFilter
    )
    .filter(l =>
      l.account?.accountNumber?.includes(loanSearch) ||
      l.loanType?.toLowerCase().includes(loanSearch.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = a[loanSortBy];
      let bVal = b[loanSortBy];

      if (typeof aVal === "number") {
        return loanSortDir === "ASC" ? aVal - bVal : bVal - aVal;
      }

      return loanSortDir === "ASC"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const paginatedLoans = filteredLoans.slice(
    loanPage * loanPageSize,
    loanPage * loanPageSize + loanPageSize
  );

  const loanTotalPages = Math.ceil(filteredLoans.length / loanPageSize);

  /* ===================== UI ===================== */

  return (
    <div style={{ padding: 20 }}>

      <h3>Loan Requests</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* STATUS FILTER */}
      <div style={{ marginBottom: 10 }}>
        {["PENDING", "REJECTED"].map(s => (
          <button
            key={s}
            onClick={() => {
              setRequestStatus(s);
              setRequestPage(0);
            }}
            style={{
              marginRight: 10,
              fontWeight: requestStatus === s ? "bold" : "normal"
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* SEARCH + SORT */}
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Search account / loan type"
          value={requestSearch}
          onChange={e => {
            setRequestSearch(e.target.value);
            setRequestPage(0);
          }}
        />

        <select
          value={requestSortBy}
          onChange={e => setRequestSortBy(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="createdAt">Created At</option>
          <option value="principalAmount">Amount</option>
        </select>

        <button
          onClick={() => setRequestSortDir(d => (d === "ASC" ? "DESC" : "ASC"))}
          style={{ marginLeft: 10 }}
        >
          {requestSortDir === "ASC" ? "↑" : "↓"}
        </button>
      </div>

      {/* REQUEST TABLE */}
      {paginatedRequests.length === 0 ? (
        <p>No {requestStatus.toLowerCase()} loan requests</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Account</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Tenure</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.account.accountNumber}</td>
                <td>{r.loanType}</td>
                <td>₹{r.principalAmount}</td>
                <td>{r.tenureMonths} months</td>
                <td>{r.status}</td>
                <td>
                  {r.status === "PENDING" ? (
                    <>
                      <button onClick={() => handleApprove(r.id)}>Approve</button>
                      <button
                        onClick={() => handleReject(r.id)}
                        style={{ marginLeft: 8 }}
                      >
                        Reject
                      </button>
                    </>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* REQUEST PAGINATION */}
      <div style={{ marginTop: 10 }}>
        <button disabled={requestPage === 0} onClick={() => setRequestPage(p => p - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          {requestPage + 1} / {requestTotalPages || 1}
        </span>

        <button
          disabled={requestPage + 1 >= requestTotalPages}
          onClick={() => setRequestPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      <hr />

      {/* ISSUED LOANS */}
      <button onClick={toggleLoans}>
        {showLoans ? "Hide Issued Loans" : "View Issued Loans"}
      </button>

      {showLoans && (
        <>
          <h3 style={{ marginTop: 20 }}>Issued Loans</h3>

          {/* FILTERS */}
          <div style={{ marginBottom: 10 }}>
            <input
              placeholder="Search account / loan type"
              value={loanSearch}
              onChange={e => {
                setLoanSearch(e.target.value);
                setLoanPage(0);
              }}
            />

            <select
              value={loanTypeFilter}
              onChange={e => {
                setLoanTypeFilter(e.target.value);
                setLoanPage(0);
              }}
              style={{ marginLeft: 10 }}
            >
              <option value="ALL">All Loan Types</option>
              {loanTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* LOANS TABLE */}
          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                <th onClick={() => toggleLoanSort("id")}>Loan ID</th>
                <th onClick={() => toggleLoanSort("account")}>Account</th>
                <th onClick={() => toggleLoanSort("loanType")}>Type</th>
                <th onClick={() => toggleLoanSort("principalAmount")}>Principal</th>
                <th onClick={() => toggleLoanSort("outstandingAmount")}>Outstanding</th>
                <th onClick={() => toggleLoanSort("emiAmount")}>EMI</th>
                <th onClick={() => toggleLoanSort("status")}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLoans.map(l => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.account.accountNumber}</td>
                  <td>{l.loanType}</td>
                  <td>₹{l.principalAmount}</td>
                  <td>₹{l.outstandingAmount}</td>
                  <td>₹{l.emiAmount}</td>
                  <td>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* LOANS PAGINATION */}
          <div style={{ marginTop: 10 }}>
            <button disabled={loanPage === 0} onClick={() => setLoanPage(p => p - 1)}>
              Prev
            </button>

            <span style={{ margin: "0 10px" }}>
              {loanPage + 1} / {loanTotalPages || 1}
            </span>

            <button
              disabled={loanPage + 1 >= loanTotalPages}
              onClick={() => setLoanPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminLoansPage;
