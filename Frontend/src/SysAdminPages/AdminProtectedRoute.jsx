// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ allowedRoles, children }) => {
	// Retrieve the user's role from localStorage (or context)
	const role = localStorage.getItem("role");

	// If the user's role is not included in allowedRoles, redirect to login or an unauthorized page.
	if (role !== "admin") {
		return <Navigate to="/noaccess" replace />;
	}
	return children;
};

export default AdminProtectedRoute;
