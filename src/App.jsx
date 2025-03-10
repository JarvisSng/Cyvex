import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css"; // Global styles
import LoginEmail from "./LoginPages/loginEmail.jsx";
import LoginPassword from "./LoginPages/loginPassword.jsx";
import AdminLogin from "./pages/adminLogin.jsx";
import Detector from "./pages/Detector.jsx";
import LandingPage from "./pages/landingPage.jsx";
import ReportPage from "./pages/ReportPage.jsx"; // Importing Report Page
import UserDashboard from "./pages/userDashboard.jsx";
import SignUpConfirmation from "./SignUpPages/signUpConfirmation.jsx";
import SignUpEmail from "./SignUpPages/signUpEmail.jsx";
import SignUpPassword from "./SignUpPages/signUpPassword.jsx";
import SignUpUsername from "./SignUpPages/signUpUsername.jsx";
import AdminContacts from "./SysAdminPages/AdminContacts.jsx";
import AdminDashboard from "./SysAdminPages/adminDashboard.jsx";
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
					{/* Starting Page */}
					<Route path="/" element={<LandingPage />} />
					{/* Routes for login page */}
					<Route path="/login/email" element={<LoginEmail />} />
					<Route path="/login/password" element={<LoginPassword />} />
					{/* Routes for signUp page */}
					<Route path="/signup/email" element={<SignUpEmail />} />
					<Route
						path="/signup/username"
						element={<SignUpUsername />}
					/>
					<Route
						path="/signup/password"
						element={<SignUpPassword />}
					/>
					<Route
						path="/signup/confirmation"
						element={<SignUpConfirmation />}
					/>
					{/* Route for Report page */}
					<Route path="/report" element={<ReportPage />} />
					{/* Route for detector page */}
					<Route path="/detector" element={<Detector />} />
					<Route path="/admin-login" element={<AdminLogin />} />
					<Route path="/user-dashboard" element={<UserDashboard />} />
					{/* Routes for SysAdmin pages */}

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
					<Route path="/noaccess" element={<NoAccess />} />
					{/*End of Routes for SysAdmin pages */}

					<Route path="/reset-password" element={<ResetPassword />} />
				</Routes>
			</Router>
		</React.StrictMode>
	);
}

export default App;
