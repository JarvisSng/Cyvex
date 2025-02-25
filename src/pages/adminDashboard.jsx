import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../controller/authController";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/user-dashboard");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! You can manage users and monitor the system here.</p>
      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
