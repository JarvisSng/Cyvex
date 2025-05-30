import { useEffect, useState } from "react";
import CodeUploader from "../components/CodeUploader";
import EvmDecompiler from "../components/EvmDecompiler";
import RepoPull from "../components/RepoPull";
import UserProfile from "../components/UserProfile";
import ViewReports from "../components/ViewReports";
import ViewResults from "../components/ViewResults";
import { checkCurrentUserSubscription } from "../controller/checkSub";
import UserNav from "./UserNav";

function UserDashboard() {
	const [activeSection, setActiveSection] = useState("dashboard");
	const [submittedCode, setSubmittedCode] = useState("");
	const [fileExt, setFileExt] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);
	// Fetch subscription status when component mounts
	useEffect(() => {
		const username = localStorage.getItem("username");
		// only run the subscription check if we have a username
		if (!username) return;

		const checkSubscription = async () => {
			try {
				const subscribed = await checkCurrentUserSubscription();
				if (subscribed) {
					setIsSubscribed(true);
				}
			} catch (err) {
				console.error("Error checking subscription:", err);
			}
		};

		checkSubscription();
	}, []);

	// Handle code submission from CodeUploader and GitHubPull
	const handleCodeSubmit = (code, fileExt) => {
		setSubmittedCode(code);
		setFileExt(fileExt || "txt");
		setActiveSection("View Results"); // Switch to results after submission
	};

	return (
		<div className="w-screen h-screen flex flex-col bg-gray-50">
			<UserNav setActiveSection={setActiveSection} />

			{/* Main content area */}
			<div className="flex flex-1 overflow-hidden pt-70">
				{/* Sidebar */}
				<aside className="w-64 bg-gray-200 border-r border-gray-300 p-4 overflow-y-auto flex flex-col">
					<h2 className="text-black font-bold mb-4">My Dashboard</h2>
					<div className="flex flex-col space-y-4">
						<button
							onClick={() => setActiveSection("dashboard")}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "dashboard"
									? "!bg-blue-950 text-white"
									: "hover:bg-gray-300"
							}`}
						>
							Code Upload
						</button>

						{isSubscribed && (
							<button
								onClick={() => setActiveSection("GitHub Pull")}
								className={`w-full p-3 rounded-md text-left pl-4 ${
									activeSection === "GitHub Pull"
										? "!bg-blue-950 text-white"
										: "hover:bg-gray-300"
								}`}
							>
								Repo Pull
							</button>
						)}

						{isSubscribed && (
							<button
								onClick={() =>
									setActiveSection("EVM Decompiler")
								}
								className={`w-full p-3 rounded-md text-left pl-4 ${
									activeSection === "EVM Decompiler"
										? "!bg-blue-950 text-white"
										: "hover:bg-gray-300"
								}`}
							>
								EVM Decompiler
							</button>
						)}

						<button
							onClick={() => setActiveSection("View Results")}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "View Results"
									? "!bg-blue-950 text-white"
									: "hover:bg-gray-300"
							}`}
						>
							View Results
						</button>
						<button
							onClick={() => setActiveSection("View Reports")}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "View Reports"
									? "!bg-blue-950 text-white"
									: "hover:bg-gray-300"
							}`}
						>
							View Reports
						</button>
					</div>
				</aside>

				{/* Main Panel */}
				<main className="flex-1 p-6 overflow-y-auto">
					{activeSection === "dashboard" ? (
						<CodeUploader onSubmit={handleCodeSubmit} />
					) : activeSection === "profile" ? (
						<UserProfile />
					) : activeSection === "EVM Decompiler" ? (
						<EvmDecompiler />
					) : activeSection === "View Reports" ? (
						<ViewReports code={submittedCode} fileExt={fileExt} />
					) : activeSection === "View Results" ? (
						<ViewResults code={submittedCode} fileExt={fileExt} />
					) : activeSection === "GitHub Pull" ? (
						<RepoPull onSubmit={handleCodeSubmit} />
					) : (
						<></>
					)}
				</main>
			</div>
		</div>
	);
}

export default UserDashboard;
