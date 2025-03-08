import { useNavigate } from "react-router-dom";
import { logoutUserAll } from "../controller/authController";

function AdminNav() {
	const navigate = useNavigate();
	const handleLogout = async () => {
		const result = await logoutUserAll();
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			// Redirect to login page after successful logout
			navigate("/");
		}
	};

	const name = localStorage.getItem("username");

	return (
		<>
			{/* Top Navbar */}
			<nav className="bg-blue-900 text-white px-4 py-2 flex justify-between items-center">
				<div className="flex items-center space-x-6">
					<span className="text-xl font-bold">cyvex</span>
					<a
						className="hover:bg-blue-700 px-3 py-2 rounded"
						onClick={() => navigate(`/admin/dashboard`)}
					>
						Manage
					</a>
					<a
						href="#contacts"
						className="hover:bg-blue-700 px-3 py-2 rounded"
						onClick={() => navigate(`/admin/contacts`)}
					>
						Contacts
					</a>
					<a
						href="#help"
						className="hover:bg-blue-700 px-3 py-2 rounded"
						onClick={() => navigate(`/admin/help`)}
					>
						Help
					</a>
				</div>
				<div className="flex items-center space-x-2">
					<span>{name}</span>
					<div className="w-8 h-8 bg-gray-300 rounded-full" />
					<button
						onClick={handleLogout}
						className="!bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
					>
						Logout
					</button>
				</div>
			</nav>
		</>
	);
}

export default AdminNav;
