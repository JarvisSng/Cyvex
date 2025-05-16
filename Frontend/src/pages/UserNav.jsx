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

	// 1) on mount, check subscription
	useEffect(() => {
		checkCurrentUserSubscription()
			.then((sub) => setIsSubscribed(sub))
			.catch((err) => {
				console.error("Subscription check failed:", err);
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

	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (
				!dropdownOpen ||
				!dropdown.current ||
				dropdown.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setDropdownOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	}, [dropdownOpen]);

	// close on esc
	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if (dropdownOpen && keyCode === 27) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	}, [dropdownOpen]);

	const name = localStorage.getItem("username");

	return (
		<>
			{/* Top Navbar */}
			<nav className="user-nav bg-blue-950 fixed top-0 left-0 w-full py-4 px-8 shadow-md text-white flex justify-between items-center">
				<div className="flex items-center space-x-12 hori-nav">
					<img
						onClick={() => navigate("/user-dashboard")}
						src={logoImage}
						alt="Cyvex Logo"
						className="h-10 w-auto"
					/>

					<a
						onClick={() => navigate("/user/contacts")}
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Contacts
					</a>
					<a
						onClick={() => navigate("/user/help")}
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Help
					</a>

					{/* ← only this block changed: */}
					{isSubscribed === false && (
						<a
							onClick={() => navigate("/user/subscribe")}
							className="hover:bg-blue-700 px-3 py-2 rounded"
						>
							Subscribe Now!
						</a>
					)}
					{isSubscribed === true && (
						<span className="px-3 py-2 rounded bg-green-600 text-white">
							Subscribed
						</span>
					)}
					{/* if isSubscribed is null (loading), nothing shows here */}
				</div>

				<div className="flex items-center space-x-2">
					<Link
						ref={trigger}
						onClick={() => setDropdownOpen(!dropdownOpen)}
						className="flex items-center gap-4"
						to="#"
					>
						<span className="text-white">{name}</span>
						<svg
							className={`hidden fill-current sm:block ${
								dropdownOpen ? "rotate-180" : ""
							}`}
							width="12"
							height="8"
							viewBox="0 0 12 8"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
								fill="currentColor"
							/>
						</svg>
					</Link>
				</div>
			</nav>

			{/* Dropdown */}
			<div
				ref={dropdown}
				onFocus={() => setDropdownOpen(true)}
				onBlur={() => setDropdownOpen(false)}
				className={`absolute dropdown-absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
					dropdownOpen ? "block" : "hidden"
				}`}
			>
				<ul className="flex flex-col border-b border-stroke dark:border-strokedark">
					<li className="hover:bg-gray-300 py-6x">
						<Link
							onClick={() => setActiveSection("profile")}
							className="flex text-blue-800 items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base px-4 py-2"
						>
							My Profile
						</Link>
					</li>
					<li className="hover:bg-gray-300 py-6x">
						<Link
							onClick={handleLogout}
							className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base px-4 py-2"
						>
							Log Out
						</Link>
					</li>
				</ul>
			</div>
		</>
	);
}

export default UserNav;
