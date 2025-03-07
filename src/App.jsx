import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css"; // Global styles
import AdminLogin from "./pages/adminLogin.jsx";
import Detector from "./pages/Detector.jsx";
import LandingPage from "./pages/landingPage.jsx";
import LoginEmail from "./pages/loginEmail.jsx";
import LoginPassword from "./pages/loginPassword.jsx";
import ReportPage from "./pages/ReportPage.jsx"; // Importing Report Page
import SignUpConfirmation from "./pages/signUpConfirmation.jsx";
import SignUpEmail from "./pages/signUpEmail.jsx";
import SignUpPassword from "./pages/signUpPassword.jsx";
import SignUpUsername from "./pages/signUpUsername.jsx";
import UserDashboard from "./pages/userDashboard.jsx";
import AdminDashboard from "./SysAdminPages/adminDashboard.jsx";
import ResetPassword from "./SysAdminPages/resetPassword.jsx";
import UserDetails from "./SysAdminPages/UserDetails.jsx";

function App() {
	return (
		<React.StrictMode>
			<Router>
				<Routes>
					<Route path="/" element={<LandingPage />} />{" "}
					<Route path="/login/email" element={<LoginEmail />} />
					{/* Route for login page */}
					<Route path="/login/password" element={<LoginPassword />} />
					<Route path="/signup/email" element={<SignUpEmail />} />
					<Route path="/report" element={<ReportPage />} />{" "}
					{/* New Report Page Route */}
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
					<Route path="/detector" element={<Detector />} />
					{/* Route for SysAdmin page */}
					<Route path="/admin-login" element={<AdminLogin />} />
					<Route path="/user-dashboard" element={<UserDashboard />} />
					<Route
						path="/admin/dashboard"
						element={<AdminDashboard />}
					/>
					<Route
						path="/admin/dashboard/:userId"
						element={<UserDetails />}
					/>
					<Route path="/reset-password" element={<ResetPassword />} />
				</Routes>
			</Router>
		</React.StrictMode>
	);
}

export default App;
