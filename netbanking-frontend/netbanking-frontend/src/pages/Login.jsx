import { useState } from "react";
import { loginUser } from "../services/api.js";
import Register from "./Register.jsx";

function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await loginUser({
        username,
        password
      });

      console.log("Login response:", response);

      if (!response || !response.userId) {
        throw new Error("Invalid login response from server");
      }

      onLogin(response);
      localStorage.setItem("session", JSON.stringify(response));
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label><br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <br />

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
