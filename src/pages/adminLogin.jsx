import React, { useState } from "react";
import { loginAdmin } from "../controller/authController"; // Use controller for authentication
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    const response = await loginAdmin(email, password);

    if (response.error) {
      setError(response.error);
      return;
    }

    // Store admin login info
    localStorage.setItem("admin", response.username);
    localStorage.setItem("role", response.role);

    // Redirect to admin dashboard
    navigate("/admin/dashboard");
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleAdminLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="login-button">
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
