import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logoutUserAll } from "../controller/authController";

function UserNav({setActiveSection}) {
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const trigger = useRef(null);
	const dropdown = useRef(null);
	const [NotificationOpen, setNotificationOpen] = useState(false);
	
	const Notification = useRef(null); 
	const handleLogout = async () => {
		const result = await logoutUserAll();
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			// Redirect to login page after successful logout
			navigate("/");
		}
	};

	// close on click outside
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
			setNotificationOpen(false);
			};
			document.addEventListener('click', clickHandler);
			return () => document.removeEventListener('click', clickHandler);
		});
	
		// close if the esc key is pressed
		useEffect(() => {
			const keyHandler = ({ keyCode }) => {
			if (!dropdownOpen || keyCode !== 27) return;
			setDropdownOpen(false);
			};
			document.addEventListener('keydown', keyHandler);
			return () => document.removeEventListener('keydown', keyHandler);
		});

	const name = localStorage.getItem("username");

	return (
		<>
			{/* Top Navbar */}
			<nav className="bg-blue-950 fixed top-0 left-0 w-full py-4 px-8 shadow-md text-white px-4 flex justify-between items-center">
				<div className="flex items-center space-x-6 hori-nav">
					<span className="text-3xl font-bold">cyvex</span>
					<a
						href="#manage"
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Manage
					</a>
					<a
						href="#contacts"
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Contacts
					</a>
					<a
						href="#help"
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Help
					</a>
				</div>
				<div className="flex items-center space-x-2">
					<Link
						ref={trigger}
						onClick={() => setNotificationOpen(!NotificationOpen)}
						to="#"
						className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
					>
						<span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
						<span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
						</span>

						<svg
						className="fill-current fill-whitetheme duration-300 ease-in-out"
						width="18" 
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						>
						<path 
							d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
							fill=""
						/>
						</svg>
					</Link>
					<Link
						ref={trigger}
						onClick={() => setDropdownOpen(!dropdownOpen)}
						className="flex items-center gap-4"
						to="#"
					>
					<span className="text-white">{localStorage.getItem("username")}</span>
					<svg
					className={`hidden fill-current fill-whitetheme sm:block ${
						dropdownOpen ? 'rotate-180' : ''
					}`}
					width="12"
					height="8"
					viewBox="0 0 12 8"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
						fill=""
					/>
					</svg>
					</Link> 
					{/* <div className="w-8 h-8 bg-gray-300 rounded-full" /> */}
					
				</div>
			</nav>
			{/* <!-- Dropdown Start --> */}
			<div
				ref={Notification}
				onFocus={() => setNotificationOpen(true)}
				onBlur={() => setNotificationOpen(false)}
				className={`absolute dropdown-absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
				NotificationOpen === true ? 'block' : 'hidden'
				}`}
			>
				<div className="px-4.5 py-3">
				<h5 className="text-sm font-medium text-bodydark2">Notification</h5>
				</div>

				<ul className="flex h-auto flex-col overflow-y-auto">
				<li>
					<Link
					className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
					to="#"
					>
					<p className="text-sm">
						<span className="text-black dark:text-white">
						Edit your information in a swipe
						</span>{' '}
						Sint occaecat cupidatat non proident, sunt in culpa qui officia
						deserunt mollit anim.
					</p>

					<p className="text-xs">12 May, 2025</p>
					</Link>
				</li>
				<li>
					<Link
					className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
					to="#"
					>
					<p className="text-sm">
						<span className="text-black dark:text-white">
						It is a long established fact
						</span>{' '}
						that a reader will be distracted by the readable.
					</p>

					<p className="text-xs">24 Feb, 2025</p>
					</Link>
				</li>
				<li>
					<Link
					className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
					to="#"
					>
					<p className="text-sm">
						<span className="text-black dark:text-white">
						There are many variations
						</span>{' '}
						of passages of Lorem Ipsum available, but the majority have
						suffered
					</p>

					<p className="text-xs">04 Jan, 2025</p>
					</Link>
				</li>
				<li>
					<Link
					className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
					to="#"
					>
					<p className="text-sm">
						<span className="text-black dark:text-white">
						There are many variations
						</span>{' '}
						of passages of Lorem Ipsum available, but the majority have
						suffered
					</p>

					<p className="text-xs">01 Dec, 2024</p>
					</Link>
				</li>
				</ul>
			</div>
			<div
						ref={dropdown}
						onFocus={() => setDropdownOpen(true)}
						onBlur={() => setDropdownOpen(false)}
						className={`absolute dropdown-absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
						dropdownOpen === true ? 'block' : 'hidden'
						}`}
					>
						<ul className="flex flex-col border-b border-stroke dark:border-strokedark">
						<li className="hover:bg-gray-300  py-6x">
							<Link
							// to="/profile" 
							onClick={() => {
								setActiveSection("profile"); 
							}} 
							className="flex text-blue-800 items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
							>
							<svg
								className="fill-current"
								width="22"
								height="22"
								viewBox="0 0 22 22"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path 
								d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
								fill=""
								/>
								<path
								d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
								fill=""
								/>
							</svg>
							My Profile
							</Link>
						</li>
						<li className="hover:bg-gray-300 py-6x">
							<Link
							onClick={handleLogout}
							className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
							>
							<svg className="fill-current"
								width="22"
								height="22"
								viewBox="0 0 22 22"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
								d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
								fill=""
								/>
								<path
								d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
								fill=""
								/>
							</svg>
							Log Out 
							</Link> 
						</li>  
						</ul>
						
					</div>
		</>
	);
}

export default UserNav;