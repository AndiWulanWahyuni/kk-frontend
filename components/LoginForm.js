import { useState } from "react";

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const admin_user = "admin";
    const admin_pass = "12345";

    if (username === admin_user && password === admin_pass) {
      onLoginSuccess(username);
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <label>Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Masukkan username"
        required
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Masukkan password"
        required
      />

      <button type="submit">Masuk</button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
