import { useEffect, useState } from "react";
import {
  addBeneficiary,
  getUserBeneficiaries,
  deleteBeneficiary
} from "../services/api";

function ManageBeneficiaries({ session }) {
  const { userId } = session;

  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [beneficiaries, setBeneficiaries] = useState([]);
  // ✅ FILTER OUT SOFT-DELETED BENEFICIARIES
  const visibleBeneficiaries = beneficiaries.filter(
    b => b.active !== false
  );
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

  async function handleAdd() {
    setError("");
    setMessage("");

    if (!name || !accountNumber) {
      setError("Fill all fields");
      return;
    }

    try {
      await addBeneficiary({
        user: { id: userId },
        name,
        accountNumber
      });

      setMessage("Beneficiary added");
      setName("");
      setAccountNumber("");
      loadBeneficiaries();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
  try {
    await deleteBeneficiary(id);
    const updated = await getUserBeneficiaries(session.userId);
    setBeneficiaries(updated);
  } catch (err) {
    setError(err.message);
  }
}


  return (
    <div>
      <h2>Manage Beneficiaries</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <h3>Add Beneficiary</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <br /><br />
      <input
        placeholder="Account Number"
        value={accountNumber}
        onChange={e => setAccountNumber(e.target.value)}
      />
      <br /><br />
      <button onClick={handleAdd}>Add</button>

      <hr />

      <h3>Your Beneficiaries</h3>

      {beneficiaries.length === 0 ? (
        <p>No beneficiaries added</p>
      ) : (
        <ul>
          {visibleBeneficiaries.map(b => (
            <li key={b.id}>
              {b.name} – {b.accountNumber}
              <button
                onClick={() => handleDelete(b.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageBeneficiaries;
