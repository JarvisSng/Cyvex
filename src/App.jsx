import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginUI from "./pages/LoginUI.jsx";
import SignUpEmail from "./pages/SignUpEmail.jsx";
import SignUpUsername from "./pages/SignUpUsername.jsx";
import SignUpPassword from "./pages/SignUpPassword.jsx";
import SignUpConfirmation from "./pages/SignUpConfirmation.jsx";
import AdminLogin from "./pages/adminLogin.jsx";
import UserDashboard from "./pages/userDashboard.jsx";
import AdminDashboard from "./pages/adminDashboard.jsx";
import "./index.css"; // Global styles

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<LoginUI />} />  {/* Route for login page */}
          <Route path="/signup/email" element={<SignUpEmail />} />
          <Route path="/signup/username" element={<SignUpUsername />} />
          <Route path="/signup/password" element={<SignUpPassword />} />
          <Route path="/signup/confirmation" element={<SignUpConfirmation />} />
          <Route path="/admin-login" element={<AdminLogin/>} />
          <Route path="/user-dashboard" element={<UserDashboard/>} /> 
          <Route path="/admin-dashboard" element={<AdminDashboard/>} /> 
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;