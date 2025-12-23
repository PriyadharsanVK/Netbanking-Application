import { useEffect, useState } from "react";
import {
  requestLoan,
  getAccountLoanRequests,
  getAccountLoans,
  payEmi,
  forecloseLoan
} from "../services/api";

const PAGE_SIZE = 5;

function LoansPage({ session }) {
  const { accountId } = session;

  /* ================= REQUEST LOAN ================= */
  const [loanType, setLoanType] = useState("HOME");
  const [amount, setAmount] = useState("");

  /* ================= DATA ================= */
  const [loanRequests, setLoanRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);

  /* ================= UI ================= */
  const [showRequests, setShowRequests] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* ================= REQUEST FILTER + PAGINATION ================= */
  const [reqStatus, setReqStatus] = useState("ALL");
  const [reqPage, setReqPage] = useState(1);

  /* ================= ACTIVE LOAN FILTER + SORT ================= */
  const [search, setSearch] = useState("");
  const [loanStatus, setLoanStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("loanType");
  const [sortDir, setSortDir] = useState("ASC");
  const [loanPage, setLoanPage] = useState(1);

  useEffect(() => {
    loadData();
  }, [accountId]);

  async function loadData() {
    setError("");
    try {
      const reqs = await getAccountLoanRequests(accountId);
      const loans = await getAccountLoans(accountId);
      setLoanRequests(reqs || []);
      setActiveLoans(loans || []);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ================= ACTIONS ================= */

  async function handleRequestLoan() {
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid loan amount");
      return;
    }

    try {
      await requestLoan({
        accountId,
        loanType,
        principalAmount: Number(amount)
      });
      setMessage("Loan request submitted successfully");
      setAmount("");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePayEmi(id) {
    if (!window.confirm("Pay EMI?")) return;
    try {
      await payEmi(id);
      setMessage("EMI paid successfully");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleForeclose(id) {
    if (!window.confirm("Foreclose this loan permanently?")) return;
    try {
      await forecloseLoan(id);
      setMessage("Loan foreclosed successfully");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => (d === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortDir("ASC");
    }
  }

  /* ================= DERIVED DATA ================= */

  const filteredRequests = loanRequests.filter(r =>
    reqStatus === "ALL" ? true : r.status === reqStatus
  );

  const reqTotalPages = Math.ceil(filteredRequests.length / PAGE_SIZE);
  const paginatedRequests = filteredRequests.slice(
    (reqPage - 1) * PAGE_SIZE,
    reqPage * PAGE_SIZE
  );

  const filteredLoans = activeLoans
    .filter(l =>
      (loanStatus === "ALL" || l.status === loanStatus) &&
      l.loanType.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "number") {
        return sortDir === "ASC" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "ASC"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const loanTotalPages = Math.ceil(filteredLoans.length / PAGE_SIZE);
  const paginatedLoans = filteredLoans.slice(
    (loanPage - 1) * PAGE_SIZE,
    loanPage * PAGE_SIZE
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1000px" }}>
      <h2>Loans</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* ================= REQUEST LOAN ================= */}
      <h3>Request Loan</h3>
      <select value={loanType} onChange={e => setLoanType(e.target.value)}>
        <option value="HOME">Home Loan</option>
        <option value="CAR">Car Loan</option>
        <option value="PERSONAL">Personal Loan</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{ marginLeft: 10 }}
      />

      <button onClick={handleRequestLoan} style={{ marginLeft: 10 }}>
        Request Loan
      </button>

      <hr />

      {/* ================= LOAN REQUESTS ================= */}
      <button onClick={() => setShowRequests(s => !s)}>
        {showRequests ? "Hide Loan Requests" : "View Loan Requests"}
      </button>

      {showRequests && (
        <>
          <div style={{ margin: "10px 0" }}>
            <select
              value={reqStatus}
              onChange={e => {
                setReqStatus(e.target.value);
                setReqPage(1);
              }}
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {paginatedRequests.length === 0 ? (
            <p>No loan requests</p>
          ) : (
            <>
              <table border="1" cellPadding="8" width="100%">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Tenure (Months)</th>
                    <th>Interest (%)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map(r => (
                    <tr key={r.id}>
                      <td>{r.loanType}</td>
                      <td>₹{r.principalAmount}</td>
                      <td>{r.tenureMonths}</td>
                      <td>{r.interestRate}%</td>
                      <td>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={reqPage} total={reqTotalPages} onChange={setReqPage} />
            </>
          )}
        </>
      )}

      <hr />

      {/* ================= ACTIVE LOANS ================= */}
      <h3>Active Loans</h3>

      <input
        placeholder="Search loan type"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setLoanPage(1);
        }}
      />

      <select
        value={loanStatus}
        onChange={e => {
          setLoanStatus(e.target.value);
          setLoanPage(1);
        }}
        style={{ marginLeft: 10 }}
      >
        <option value="ALL">All</option>
        <option value="ACTIVE">Active</option>
        <option value="CLOSED">Closed</option>
      </select>

      {paginatedLoans.length === 0 ? (
        <p>No loans found</p>
      ) : (
        <>
          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                <th onClick={() => toggleSort("loanType")}>Type</th>
                <th onClick={() => toggleSort("principalAmount")}>Principal</th>
                <th>Outstanding</th>
                <th>Tenure</th>
                <th>Interest</th>
                <th>Status</th>
                <th>EMI</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLoans.map(l => (
                <tr key={l.id}>
                  <td>{l.loanType}</td>
                  <td>₹{l.principalAmount}</td>
                  <td>₹{l.outstandingAmount}</td>
                  <td>{l.tenureMonths}</td>
                  <td>{l.interestRate}%</td>
                  <td>{l.status}</td>
                  <td>₹{l.emiAmount}</td>
                  <td>
                    <button onClick={() => handlePayEmi(l.id)}>Pay EMI</button>
                    <button
                      onClick={() => handleForeclose(l.id)}
                      style={{ marginLeft: 8 }}
                    >
                      Foreclose
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={loanPage} total={loanTotalPages} onChange={setLoanPage} />
        </>
      )}
    </div>
  );
}

/* ================= PAGINATION ================= */
function Pagination({ page, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
      <span style={{ margin: "0 10px" }}>{page} / {total}</span>
      <button disabled={page === total} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}

export default LoansPage;
