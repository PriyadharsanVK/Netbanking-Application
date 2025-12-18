import { useEffect, useState } from "react";
import {
  requestLoan,
  getAccountLoanRequests,
  getAccountLoans,
  payEmi,
  forecloseLoan
} from "../services/api";

function LoansPage({ session }) {
  const { accountId } = session;

  const [loanType, setLoanType] = useState("HOME");
  const [amount, setAmount] = useState("");

  const [loanRequests, setLoanRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, [accountId]);

  async function loadData() {
    setError("");
    try {
      const reqs = await getAccountLoanRequests(accountId);
      const loans = await getAccountLoans(accountId);

      setLoanRequests(reqs);
      setActiveLoans(loans);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ================= REQUEST LOAN ================= */

  async function handleRequestLoan() {
    setError("");
    setMessage("");

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

  /* ================= PAY EMI ================= */

  async function handlePayEmi(loanId) {
    setError("");
    setMessage("");

    const confirmPay = window.confirm(
      "Are you sure you want to pay this EMI?"
    );
    if (!confirmPay) return;

    try {
      await payEmi(loanId);
      setMessage("EMI paid successfully");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ================= FORECLOSE LOAN ================= */

  async function handleForeclose(loanId) {
    setError("");
    setMessage("");

    const confirmClose = window.confirm(
      "This will close the loan permanently. Continue?"
    );
    if (!confirmClose) return;

    try {
      await forecloseLoan(loanId);
      setMessage("Loan foreclosed successfully");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <h2>Loans</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* ================= REQUEST LOAN ================= */}
      <h3>Request Loan</h3>

      <label>
        Loan Type:&nbsp;
        <select
          value={loanType}
          onChange={e => setLoanType(e.target.value)}
        >
          <option value="HOME">Home Loan</option>
          <option value="CAR">Car Loan</option>
          <option value="PERSONAL">Personal Loan</option>
        </select>
      </label>

      <br /><br />

      <label>
        Amount:&nbsp;
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </label>

      <br /><br />

      <button onClick={handleRequestLoan}>
        Request Loan
      </button>

      <hr />

      {/* ================= LOAN REQUESTS ================= */}
      <h3>Loan Requests</h3>

      {loanRequests.length === 0 ? (
        <p>No loan requests</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Tenure (Months)</th>
              <th>Interest</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loanRequests.map(r => (
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
      )}

      <hr />

      {/* ================= ACTIVE LOANS ================= */}
      <h3>Active Loans</h3>

      {activeLoans.length === 0 ? (
        <p>No active loans</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Type</th>
              <th>Principal</th>
              <th>Outstanding</th>
              <th>Tenure</th>
              <th>Interest</th>
              <th>Status</th>
              <th>EMI</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeLoans.map(loan => (
              <tr key={loan.id}>
                <td>{loan.loanType}</td>
                <td>₹{loan.principalAmount}</td>
                <td>₹{loan.outstandingAmount}</td>
                <td>{loan.tenureMonths}</td>
                <td>{loan.interestRate}%</td>
                <td>{loan.status}</td>
                <td>₹{loan.emiAmount}</td>
                <td>
                  <button
                    disabled={
                      loan.status !== "ACTIVE" ||
                      loan.outstandingAmount < loan.emiAmount
                    }
                    onClick={() => handlePayEmi(loan.id)}
                  >
                    Pay EMI
                  </button>

                  <button
                    style={{ marginLeft: "10px" }}
                    disabled={loan.status !== "ACTIVE"}
                    onClick={() => handleForeclose(loan.id)}
                  >
                    Foreclose
                  </button>

                  {loan.outstandingAmount < loan.emiAmount && (
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      EMI not allowed. Use Foreclosure.
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LoansPage;
