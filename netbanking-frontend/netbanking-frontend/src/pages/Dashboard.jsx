import { useEffect, useState } from "react";
import {
  getUserAccounts,
  getOtherAccounts,
  deposit,
  getTransactionHistory,
  selfTransfer,
  getAccountByNumber
} from "../services/api";

function Dashboard({ session }) {
  const { userId, accountId } = session;

  const [currentAccount, setCurrentAccount] = useState(null);
  const [otherAccounts, setOtherAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [error, setError] = useState("");
  const [showSelfTransfer, setShowSelfTransfer] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [depositMessage, setDepositMessage] = useState("");

  const [transferAmount, setTransferAmount] = useState("");
  const [transferMessage, setTransferMessage] = useState("");

  /* ---------- NORMAL TRANSFER STATE ---------- */
  const [destAccountNumber, setDestAccountNumber] = useState("");
  const [normalTransferAmount, setNormalTransferAmount] = useState("");
  const [normalTransferMessage, setNormalTransferMessage] = useState("");

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

  /* ---------- LOAD OTHER ACCOUNTS ---------- */
  async function handleSelfTransferClick() {
    setError("");
    try {
      const accounts = await getOtherAccounts(userId, accountId);
      setOtherAccounts(accounts);
      setShowSelfTransfer(true);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- EXECUTE SELF TRANSFER ---------- */
  async function handleSelfTransfer(toAccountId) {
    setTransferMessage("");
    setError("");

    if (!transferAmount || Number(transferAmount) <= 0) {
      setTransferMessage("Enter valid amount");
      return;
    }

    try {
      await selfTransfer(accountId, toAccountId, Number(transferAmount));
      setTransferMessage("Transfer successful");
      setTransferAmount("");
      await loadCurrentAccount();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- NORMAL TRANSFER ---------- */
  async function handleNormalTransfer() {
    setNormalTransferMessage("");
    setError("");

    if (!destAccountNumber || !normalTransferAmount) {
      setNormalTransferMessage("Fill all fields");
      return;
    }

    try {
      const destAccount = await getAccountByNumber(destAccountNumber);

      await selfTransfer(
        accountId,
        destAccount.id,
        Number(normalTransferAmount)
      );

      setNormalTransferMessage("Transfer successful");
      setDestAccountNumber("");
      setNormalTransferAmount("");
      await loadCurrentAccount();

    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- TRANSACTION HISTORY ---------- */
  async function handleViewTransactions() {
    setError("");
    try {
      const data = await getTransactionHistory(accountId);
      setTransactions(data);
      setShowTransactions(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Account Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {currentAccount && (
        <div>
          <h3>Logged-in Account</h3>
          <p>
            <b>{currentAccount.accountNumber}</b> |{" "}
            {currentAccount.accountType} | Balance: ₹{currentAccount.balance}
          </p>
        </div>
      )}

      <hr />

      {/* DEPOSIT */}
      <h3>Deposit</h3>
      <input
        type="number"
        placeholder="Enter amount"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />
      <button onClick={handleDeposit} style={{ marginLeft: "10px" }}>
        Deposit
      </button>
      {depositMessage && <p>{depositMessage}</p>}

      <hr />

      {/* SELF TRANSFER */}
      <button onClick={handleSelfTransferClick}>Self Transfer</button>
      <button onClick={handleViewTransactions} style={{ marginLeft: "10px" }}>
        View Transactions
      </button>

      <br /><br />

      {showSelfTransfer && (
        <div>
          <h3>Self Transfer</h3>

          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />

          {otherAccounts.length === 0 ? (
            <p>No other accounts available.</p>
          ) : (
            <ul>
              {otherAccounts.map(acc => (
                <li key={acc.id}>
                  {acc.accountNumber} ({acc.accountType})
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleSelfTransfer(acc.id)}
                  >
                    Transfer
                  </button>
                </li>
              ))}
            </ul>
          )}

          {transferMessage && <p>{transferMessage}</p>}
        </div>
      )}

      <hr />

      {/* NORMAL TRANSFER */}
      <h3>Normal Transfer</h3>

      <input
        placeholder="Destination Account Number"
        value={destAccountNumber}
        onChange={(e) => setDestAccountNumber(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        value={normalTransferAmount}
        onChange={(e) => setNormalTransferAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={handleNormalTransfer}>Transfer</button>

      {normalTransferMessage && <p>{normalTransferMessage}</p>}

      <hr />

      {/* TRANSACTIONS */}
      {showTransactions && (
        <div>
          <h3>Transaction History</h3>

          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <table border="1" cellPadding="8">
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
                {transactions.map((tx, i) => (
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
        </div>
      )}
    </div>
  );
}

export default Dashboard;
