import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../controller/authController";

const LoginUI = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const navigate = useNavigate(); // Initialize navigate

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");
		const response = await loginUser(email, password);

		if (response.error) {
			setError(response.error);
			return;
		}

		setUsername(response.username);
		setMessage(`Logged in as ${response.username}`);

		//Jas - store user data in local storage
		localStorage.setItem("user", response.username);
		localStorage.setItem("role", response.role);
		localStorage.setItem("email", email);

		//Jas - redirect users based on role
		if (response.role === "admin") {
			navigate("/admin-dashboard");
		} else {
			navigate("/user-dashboard");
		}
	};

	// Function to handle redirection to the sign-up page
	const handleSignUpRedirect = () => {
		navigate("/signup/email"); // Redirect to the sign-up page
	};

	return (
		<div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
			<h4 className="text-stone-50 text-5xl font-bold">cyvex</h4>
			<div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
				<p className="text-black text-3xl font-regular">welcome</p>
				<p className="text-black text-lg font-regular">
					nice to have you Login
				</p>
				<form
					onSubmit={handleLogin}
					className="flex flex-col items-center justify-center gap-4 rounded-md w-100"
				>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						required
						className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						required
						className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{error && <p style={{ color: "red" }}>{error}</p>}
					{message && <p style={{ color: "green" }}>{message}</p>}
					<button
						type="submit"
						className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
					>
						Login
					</button>
				</form>

				<button
					onClick={handleSignUpRedirect}
					className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
					style={{ marginTop: "10px" }}
				>
					Sign Up
				</button>
				{username && <p>Welcome, {username}!</p>}
			</div>
		</div>
	);
};

export default LoginUI;
