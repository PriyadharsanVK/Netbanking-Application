import { useState } from "react";
import { createAccountRequest } from "../services/api.js";

function RequestAccount({ userId, onBack }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    accountType: "SAVINGS"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await createAccountRequest({
        userId,
        ...form
      });

      setMessage("Account request submitted");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Request New Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
        />
        <br /><br />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <br /><br />

        <textarea
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />
        <br /><br />

        <select
          value={form.accountType}
          onChange={e => setForm({ ...form, accountType: e.target.value })}
        >
          <option value="SAVINGS">Savings</option>
          <option value="CURRENT">Current</option>
        </select>

        <br /><br />

        <button type="submit">Submit Request</button>
        <button type="button" onClick={onBack} style={{ marginLeft: "10px" }}>
          Back
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RequestAccount;
