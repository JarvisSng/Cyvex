import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css"; // Global styles


import LandingPage from "./pages/landingPage.jsx";
import LoginEmail from "./pages/loginEmail.jsx";
import LoginPassword from "./pages/loginPassword.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import SignUpConfirmation from "./pages/signUpConfirmation.jsx";
import SignUpEmail from "./pages/signUpEmail.jsx";
import SignUpPassword from "./pages/signUpPassword.jsx";
import SignUpUsername from "./pages/signUpUsername.jsx";
import AdminDashboard from "./SysAdminPages/adminDashboard.jsx";
import FigmaLayout from "./pages/FigmaLayout";


import AdminLogin from "./pages/adminLogin.jsx";
import UserDashboard from "./pages/userDashboard.jsx";
import AdminContacts from "./SysAdminPages/AdminContacts.jsx";
import AdminHelp from "./SysAdminPages/AdminHelp.jsx";
import AdminProtectedRoute from "./SysAdminPages/AdminProtectedRoute.jsx";
import NoAccess from "./SysAdminPages/NoAccess.jsx";
import ResetPassword from "./SysAdminPages/resetPassword.jsx";
import UserDetails from "./SysAdminPages/UserDetails.jsx";

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          {/* Default home page = login (local version) */}
          <Route path="/" element={<LoginEmail />} />

          {/* Old landing page */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Login routes */}
          <Route path="/login/password" element={<LoginPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Sign-up pages */}
          <Route path="/signup/email" element={<SignUpEmail />} />
          <Route path="/signup/username" element={<SignUpUsername />} />
          <Route path="/signup/password" element={<SignUpPassword />} />
          <Route path="/signup/confirmation" element={<SignUpConfirmation />} />

          {/* Report page */}
          <Route path="/report" element={<ReportPage />} />

          {/* The new Figma-based layout for uploading code */}
          <Route path="/detector" element={<FigmaLayout />} />

          {/* User dashboard */}
          <Route path="/user-dashboard" element={<UserDashboard />} />

          {/* SysAdmin pages (protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard/:userId"
            element={
              <AdminProtectedRoute allowedRoles={["admin"]}>
                <UserDetails />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <AdminProtectedRoute allowedRoles={["admin"]}>
                <AdminContacts />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/help"
            element={
              <AdminProtectedRoute allowedRoles={["admin"]}>
                <AdminHelp />
              </AdminProtectedRoute>
            }
          />

          {/* No Access & Reset Password */}
          <Route path="/noaccess" element={<NoAccess />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
