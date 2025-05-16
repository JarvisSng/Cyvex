// src/pages/UserNav.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/cyvex-logo.png";
import { logoutUserAll } from "../controller/authController";
import { checkCurrentUserSubscription } from "../controller/checkSub"; // ← import your check fn

function UserNav({ setActiveSection }) {
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(null); // null = loading
	const trigger = useRef(null);
	const dropdown = useRef(null);

	// 1) Get subscription status on mount
	useEffect(() => {
		checkCurrentUserSubscription()
			.then((sub) => setIsSubscribed(sub))
			.catch((err) => {
				console.error("Error checking subscription:", err);
				setIsSubscribed(false);
			});
	}, []);

	const handleLogout = async () => {
		const result = await logoutUserAll();
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			navigate("/");
		}
	};

	// close dropdown on outside click
	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!dropdown.current) return;
			if (
				!dropdownOpen ||
				dropdown.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setDropdownOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	}, [dropdownOpen]);

	// close dropdown on ESC
	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if (dropdownOpen && keyCode === 27) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	}, [dropdownOpen]);

	const username = localStorage.getItem("username") || "";

	return (
		<>
			{/* Top Navbar */}
			<nav className="bg-blue-950 fixed top-0 left-0 w-full py-4 px-8 shadow-md text-white flex justify-between items-center z-50">
				<div className="flex items-center space-x-12">
					<img
						onClick={() => navigate("/user-dashboard")}
						src={logoImage}
						alt="Cyvex Logo"
						className="h-10 w-auto cursor-pointer"
					/>

					<button
						onClick={() => navigate("/user/contacts")}
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Contacts
					</button>
					<button
						onClick={() => navigate("/user/help")}
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Help
					</button>

					{/* Only show subscribe link if we know they're not subscribed */}
					{isSubscribed === false && (
						<button
							onClick={() => navigate("/user/subscribe")}
							className="hover:bg-blue-700 px-3 py-2 rounded"
						>
							Subscribe Now!
						</button>
					)}
					{isSubscribed === true && (
						<span className="px-3 py-2 rounded bg-green-600 text-white">
							Subscribed
						</span>
					)}
					{/* if isSubscribed===null, we're still loading—show nothing */}
				</div>

				{/* User dropdown trigger */}
				<div className="flex items-center">
					<Link
						ref={trigger}
						onClick={() => setDropdownOpen(!dropdownOpen)}
						to="#"
						className="flex items-center gap-2 cursor-pointer"
					>
						<span>{username}</span>
						<svg
							className={`w-3 h-3 transform transition-transform ${
								dropdownOpen ? "rotate-180" : ""
							}`}
							viewBox="0 0 12 8"
						>
							<path
								d="M0.41 0.91C0.736 0.585 1.264 0.585 1.589 0.91L6 5.321 10.411 0.91C10.736 0.585 11.264 0.585 11.589 0.91C11.915 1.236 11.915 1.764 11.589 2.089L6.589 7.089C6.264 7.415 5.736 7.415 5.411 7.089L0.411 2.089C0.085 1.764 0.085 1.236 0.411 0.91Z"
								fill="currentColor"
							/>
						</svg>
					</Link>
				</div>
			</nav>

			{/* Dropdown */}
			<div
				ref={dropdown}
				className={`absolute right-8 mt-16 w-48 bg-white text-blue-800 rounded shadow-lg transition-opacity ${
					dropdownOpen
						? "opacity-100 block"
						: "opacity-0 pointer-events-none"
				}`}
			>
				<ul className="divide-y">
					<li>
						<button
							onClick={() => setActiveSection("profile")}
							className="w-full text-left px-4 py-2 hover:bg-gray-100"
						>
							My Profile
						</button>
					</li>
					<li>
						<button
							onClick={handleLogout}
							className="w-full text-left px-4 py-2 hover:bg-gray-100"
						>
							Log Out
						</button>
					</li>
				</ul>
			</div>
		</>
	);
}

export default UserNav;
