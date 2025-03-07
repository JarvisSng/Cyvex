import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient"; // Your centralized Supabase client

const ResetPassword = () => {
	const [accessToken, setAccessToken] = useState("");
	const [refreshToken, setRefreshToken] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	// On mount, parse tokens or error info from the URL hash.
	useEffect(() => {
		// Remove the leading '#' from the hash string
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);

		// Check if there's an error parameter in the URL
		const error = params.get("error");
		const errorCode = params.get("error_code");
		const errorDescription = params.get("error_description");

		if (error) {
			setMessage(
				`Error: ${error}. Code: ${errorCode}. ${errorDescription || ""}`
			);
			return;
		}

		// Otherwise, try to extract tokens.
		const access_token = params.get("access_token");
		const refresh_token = params.get("refresh_token");

		if (access_token && refresh_token) {
			setAccessToken(access_token);
			setRefreshToken(refresh_token);
		} else {
			setMessage(
				"Missing token information. Please use the password reset link provided in your email."
			);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");

		// Set the session using the tokens from the URL.
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken,
		});

		if (sessionError) {
			setMessage("Error setting session: " + sessionError.message);
			return;
		}

		// Now update the user's password.
		const { error: updateError } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (updateError) {
			setMessage("Error updating password: " + updateError.message);
			return;
		}

		setMessage("Password updated successfully! Redirecting...");
		// Optionally, redirect to a login page or dashboard after a short delay
		setTimeout(() => {
			navigate("/login/email");
		}, 3000);
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
			<h1 className="text-2xl font-bold mb-4">Reset Password</h1>
			{message && <p className="mb-4 text-red-500">{message}</p>}
			{/* Only show the form if there is no error message */}
			{!message.startsWith("Error:") && (
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="block text-gray-700 mb-2"
							htmlFor="newPassword"
						>
							New Password:
						</label>
						<input
							type="password"
							id="newPassword"
							className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
					>
						Update Password
					</button>
				</form>
			)}
		</div>
	);
};

export default ResetPassword;
