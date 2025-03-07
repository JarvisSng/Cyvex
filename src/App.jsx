import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css"; // Global styles
import AdminLogin from "./pages/adminLogin.jsx";
import Detector from "./pages/Detector.jsx";
import LandingPage from "./pages/landingPage.jsx";
import LoginEmail from "./LoginPages/loginEmail.jsx";
import LoginPassword from "./LoginPages/loginPassword.jsx";
import ReportPage from "./pages/ReportPage.jsx"; // Importing Report Page
import SignUpConfirmation from "./SignUpPages/signUpConfirmation.jsx";
import SignUpEmail from "./SignUpPages/signUpEmail.jsx";
import SignUpPassword from "./SignUpPages/signUpPassword.jsx";
import SignUpUsername from "./SignUpPages/signUpUsername.jsx";
import UserDashboard from "./pages/userDashboard.jsx";
import AdminDashboard from "./SysAdminPages/adminDashboard.jsx";
import ResetPassword from "./SysAdminPages/resetPassword.jsx";
import UserDetails from "./SysAdminPages/UserDetails.jsx";

function App() {
	return (
		<React.StrictMode>
			<Router>
				<Routes>
					{/* Starting Page */}
					<Route 
						path="/" 
						element={<LandingPage />} 
					/>
					{/* Routes for login page */}
					<Route 
						path="/login/email" 
						element={<LoginEmail />} 
					/>
					<Route 
						path="/login/password" 
						element={<LoginPassword />} 
					/>
					{/* Routes for signUp page */}
					<Route 
						path="/signup/email" 
						element={<SignUpEmail />} 
					/>
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
					<Route 
						path="/report" 
						element={<ReportPage />} 
					/>
					{/* Route for detector page */}
					<Route 
						path="/detector" 
						element={<Detector />} 
					/>
					{/* Routes for SysAdmin pages */}
					<Route 
						path="/admin-login" 
						element={<AdminLogin />} 
					/>
					<Route 
						path="/user-dashboard" 
						element={<UserDashboard />} 
					/>
					<Route
						path="/admin/dashboard"
						element={<AdminDashboard />}
					/>
					<Route
						path="/admin/dashboard/:userId"
						element={<UserDetails />}
					/>
					<Route 
						path="/reset-password" 
						element={<ResetPassword />} 
					/>
				</Routes>
			</Router>
		</React.StrictMode>
	);
}

export default App;
