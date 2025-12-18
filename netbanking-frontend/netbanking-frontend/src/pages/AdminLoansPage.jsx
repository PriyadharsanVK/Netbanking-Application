import { useEffect, useState } from "react";
import {
  getAllLoanRequests,
  approveLoanRequest,
  rejectLoanRequest,
  getAllLoans
} from "../services/api.js";

function AdminLoansPage() {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loans, setLoans] = useState([]);

  const [showLoans, setShowLoans] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadLoanRequests();
  }, []);

  async function loadLoanRequests() {
    try {
      const data = await getAllLoanRequests();
      setLoanRequests(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadLoans() {
    try {
      const data = await getAllLoans();
      setLoans(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleApprove(id) {
    setError("");
    setMessage("");
    try {
      await approveLoanRequest(id);
      setMessage("Loan approved");
      loadLoanRequests();
      if (showLoans) loadLoans();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(id) {
    setError("");
    setMessage("");
    try {
      await rejectLoanRequest(id);
      setMessage("Loan rejected");
      loadLoanRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleLoans() {
    if (!showLoans) {
      loadLoans();
    }
    setShowLoans(prev => !prev);
  }

  return (
    <div>
      <h3>Loan Requests</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {loanRequests.length === 0 ? (
        <p>No loan requests</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Account</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Tenure</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loanRequests.map(r => (
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
                      <button onClick={() => handleApprove(r.id)}>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(r.id)}
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

      <hr />

      {/* ===== TOGGLE ALL LOANS ===== */}
      <button onClick={toggleLoans}>
        {showLoans ? "Hide All Loans" : "View All Loans"}
      </button>

      {showLoans && (
        <>
          <h3 style={{ marginTop: "20px" }}>Issued Loans</h3>

          {loans.length === 0 ? (
            <p>No active loans</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Principal</th>
                  <th>Outstanding</th>
                  <th>EMI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td>{loan.id}</td>
                    <td>{loan.account.accountNumber}</td>
                    <td>{loan.loanType}</td>
                    <td>₹{loan.principalAmount}</td>
                    <td>₹{loan.outstandingAmount}</td>
                    <td>₹{loan.emiAmount}</td>
                    <td>{loan.status}</td>
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

export default AdminLoansPage;
