import { useEffect, useState } from "react";
import {
  getUserBeneficiaries,
  transferToBeneficiary
} from "../services/api";

function Transfer({ session }) {
  const { userId, accountId } = session;

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  async function loadBeneficiaries() {
    try {
      const data = await getUserBeneficiaries(userId);
      setBeneficiaries(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleTransfer(beneficiaryId) {
    setError("");
    setMessage("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter valid amount");
      return;
    }

    try {
      await transferToBeneficiary(
        beneficiaryId,
        accountId,
        Number(amount)
      );

      setMessage("Transfer successful");
      setAmount("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Transfer to Beneficiary</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <hr />

      {beneficiaries.length === 0 ? (
        <p>No beneficiaries available</p>
      ) : (
        <ul>
          {beneficiaries.map(b => (
            <li key={b.id}>
              {b.name} – {b.accountNumber}
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleTransfer(b.id)}
              >
                Transfer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Transfer;
