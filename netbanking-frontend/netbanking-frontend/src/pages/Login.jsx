import { useState } from "react";
import { loginUser } from "../services/api.js";
import Register from "./Register.jsx";

function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("USER");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await loginUser({
        username,
        password,
        loginAs
      });

      console.log("Login response:", response);

      if (!response || !response.userId || !response.role) {
        throw new Error("Invalid login response from server");
      }

      // 🔒 FRONTEND ROLE VALIDATION (IMPORTANT)
      if (response.role !== loginAs) {
        throw new Error(
          `You cannot login as ${loginAs} with this account`
        );
      }

      // ✅ Save session only if role matches
      localStorage.setItem("session", JSON.stringify(response));
      onLogin(response);

    } catch (err) {
      console.error(err);
      setMessage(err.message || "Login failed");
    }
  }

  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "400px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        {/* USERNAME */}
        <div>
          <label>Username</label><br />
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <br />

        {/* PASSWORD */}
        <div>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        {/* LOGIN AS */}
        <div>
          <label>Login as</label><br />
          <select
            value={loginAs}
            onChange={e => setLoginAs(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <br />

        <button type="submit">Login</button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <hr />

      <p>New user?</p>
      <button onClick={() => setShowRegister(true)}>
        Register
      </button>
    </div>
  );
}

export default Login;
