import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css"; // Global styles
import LoginEmail from "./pages/loginEmail.jsx";
import LoginPassword from "./pages/loginPassword.jsx";
import Detector from "./pages/Detector.jsx";
import SignUpConfirmation from "./pages/signUpConfirmation.jsx";
import SignUpEmail from "./pages/signUpEmail.jsx";
import SignUpPassword from "./pages/signUpPassword.jsx";
import SignUpUsername from "./pages/signUpUsername.jsx";
import AdminDashboard from "./SysAdminPages/adminDashboard.jsx";

function App() {
	return (
		<React.StrictMode>
			<Router>
				<Routes>
					<Route path="/" element={<LoginEmail />} />{" "}
					{/* Route for login page */}
					<Route path="/login/password" element={<LoginPassword />} />
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
					<Route path="/detector" element={<Detector />} />
					{/* Route for SysAdmin page */}
					<Route
						path="/admin/dashboard"
						element={<AdminDashboard />}
					/>
				</Routes>
			</Router>
		</React.StrictMode>
	);
}

export default App;
