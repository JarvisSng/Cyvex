// src/pages/NoAccess.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NoAccess = () => {
	const navigate = useNavigate();

	const handleReturn = () => {
		navigate("/login/email");
	};

	return (
		<div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-900">
			<h1 className="text-4xl font-bold text-red-400 mb-4">
				Access Denied
			</h1>
			<p className="text-xl mb-6 text-white">
				You do not have the admin access to view this page.
			</p>
			<button
				onClick={handleReturn}
				className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
			>
				Return to Login
			</button>
		</div>
	);
};

export default NoAccess;
