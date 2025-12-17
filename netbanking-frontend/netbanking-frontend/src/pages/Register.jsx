import { useState } from "react";
import { registerUser } from "../services/api.js";

function Register({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await registerUser({ username, password });
      setMessage("Registration successful. Please login.");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>User Registration</h2>

      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label><br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />
        <button type="submit">Register</button>
        <button
          type="button"
          onClick={onBack}
          style={{ marginLeft: "10px" }}
        >
          Back to Login
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;
