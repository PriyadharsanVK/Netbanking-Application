import { useEffect, useState } from "react";
import {
  getUserAccounts,
  deposit,
  getTransactionHistory
} from "../services/api.js";

const PAGE_SIZE = 5;

function Dashboard({ session, onNavigate }) {
  const { userId, accountId } = session;

  const [currentAccount, setCurrentAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [error, setError] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);

  /* ---------- DEPOSIT ---------- */
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMessage, setDepositMessage] = useState("");

  /* ---------- TRANSACTION FILTER + PAGINATION ---------- */
  const [txTypeFilter, setTxTypeFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- LOAD CURRENT ACCOUNT ---------- */
  useEffect(() => {
    loadCurrentAccount();
  }, [userId, accountId]);

  async function loadCurrentAccount() {
    try {
      const accounts = await getUserAccounts(userId);
      const acc = accounts.find(a => a.id === accountId);
      setCurrentAccount(acc);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- DEPOSIT ---------- */
  async function handleDeposit() {
    setDepositMessage("");
    setError("");

    if (!depositAmount || Number(depositAmount) <= 0) {
      setDepositMessage("Enter a valid amount");
      return;
    }

    try {
      await deposit(accountId, Number(depositAmount));
      setDepositMessage("Deposit successful");
      setDepositAmount("");
      await loadCurrentAccount();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- TRANSACTIONS (TOGGLE) ---------- */
  async function handleViewTransactions() {
    setError("");

    if (showTransactions) {
      setShowTransactions(false);
      return;
    }

    try {
      const data = await getTransactionHistory(accountId);
      setTransactions(data);
      setCurrentPage(1);
      setShowTransactions(true);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- FILTER + PAGINATION ---------- */
  const filteredTransactions = transactions
    .filter(tx =>
      txTypeFilter === "ALL" ? true : tx.type === txTypeFilter
    )
    .sort((a, b) =>
      sortOrder === "DESC"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <h2>Account Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {currentAccount && (
        <div style={{ marginBottom: "20px" }}>
          <b>{currentAccount.accountNumber}</b> |{" "}
          {currentAccount.accountType} |{" "}
          Balance: ₹{currentAccount.balance}
        </div>
      )}

      <hr />

      {/* ---------- QUICK ACTIONS ---------- */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleViewTransactions}>
          {showTransactions ? "Hide Transactions" : "View Transactions"}
        </button>

        {onNavigate && (
          <button
            onClick={() => onNavigate("loans")}
            style={{ marginLeft: "10px" }}
          >
            Go to Loans
          </button>
        )}
      </div>

      <hr />

      {/* ---------- DEPOSIT ---------- */}
      <h3>Deposit</h3>
      <input
        type="number"
        value={depositAmount}
        onChange={e => setDepositAmount(e.target.value)}
      />
      <button onClick={handleDeposit} style={{ marginLeft: "10px" }}>
        Deposit
      </button>
      {depositMessage && <p>{depositMessage}</p>}

      {/* ---------- TRANSACTION HISTORY ---------- */}
      {showTransactions && (
        <div style={{ marginTop: "20px" }}>
          <h3>Transaction History</h3>

          {/* Filters */}
          <div style={{ marginBottom: "10px" }}>
            <label>
              Type:&nbsp;
              <select
                value={txTypeFilter}
                onChange={e => setTxTypeFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
            </label>

            <label style={{ marginLeft: "20px" }}>
              Sort:&nbsp;
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="DESC">Newest</option>
                <option value="ASC">Oldest</option>
              </select>
            </label>
          </div>

          {paginatedTransactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx, i) => (
                  <tr key={i}>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td>{tx.type}</td>
                    <td>₹{tx.amount}</td>
                    <td>₹{tx.balanceAfter}</td>
                    <td>{tx.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: "10px" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Prev
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
