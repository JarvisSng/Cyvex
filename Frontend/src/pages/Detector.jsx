// detector.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetectionRules } from "../controller/rulesController";
import { getUserProfilesWithSubscriptions } from "../controller/userController";

// 1) Skip lines that start with // or #
function isCommentLine(line) {
	const trimmed = line.trim();
	return trimmed.startsWith("//") || trimmed.startsWith("#");
}

// 2) Strip inline comments (everything after //)
function stripInlineComment(line) {
	const index = line.indexOf("//");
	return index !== -1 ? line.substring(0, index) : line;
}

// 3) Detection rules for each language, using word boundaries (\b)
const Rules = {
	JavaScript: {
		AES: /\bcrypto\.(?:createCipheriv|createCipher)\s*\(\s*['"]aes-\d+-cbc['"]/i,
		"RSA (Weak Key)":
			/\bcrypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*\{\s*[^}]*modulusLength\s*:\s*(512|1024)/i,
		RSA: /\bcrypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*\{\s*[^}]*modulusLength\s*:\s*(?!.*(512|1024))\d+/i,
		"SHA-1": /\bcrypto\.createHash\s*\(\s*['"]sha1['"]\s*\)/i,
		"SHA-256": /\bcrypto\.createHash\s*\(\s*['"]sha256['"]\s*\)/i,
		MD5: /\bcrypto\.createHash\s*\(\s*['"]md5['"]\s*\)/i,
		HMAC: /\bcrypto\.createHmac\s*\(\s*['"]sha\d+['"]\s*,/i,
		DES: /\bcrypto\.createCipher\s*\(\s*['"]des(?:-\d+)?-cbc['"]\s*,/i,
		"Hardcoded Key":
			/\b(?:const|let|var)\s+\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i,
	},

	Python: {
		"RSA (Weak Key)": /\bRSA\.generate\s*\(\s*(512|1024)(?:[^)]*)\)/i,
		RSA: /\bRSA\.generate\s*\(\s*(?!512|1024)\d+(?:[^)]*)\)/i,
		AES: /\bAES\.new\(/i,
		"SHA-1": /\bhashlib\.sha1\(|\bhashlib\.new\(['"]sha1['"]\)/i,
		"SHA-256": /\bhashlib\.sha256\(|\bhashlib\.new\(['"]sha256['"]\)/i,
		MD5: /\bhashlib\.md5\(|\bhashlib\.new\(['"]md5['"]\)/i,
		HMAC: /\bhmac\.new\(\s*.*,\s*hashlib\.sha\d+/i,
		DES: /\bDES\.new\(/i,
		"Hardcoded Key":
			/\b\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i,
	},
};

// Detector Component
function Detector() {
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState("/detector"); // Set default active tab
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Retrieve pulled code (if available)
	const pulledCode = location.state?.pulledCode || "";
	const fileName = location.state?.fileName || "No file chosen";

	// Set initial state of code editor with pulled code
	const [code, setCode] = useState(pulledCode);

	const [detectionRules, setDetectionRules] = useState({});
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchRules = async () => {
			const result = await getDetectionRules();
			if (result.error) {
				setError(result.error);
			} else {
				setDetectionRules(result);
			}
		};

		fetchRules();
	}, []);

	// Fetch subscription status when component mounts
	useEffect(() => {
		const username = localStorage.getItem("username");
		// only run the subscription check if we have a username
		if (!username) return;

		const checkSubscription = async () => {
			try {
				const subscribed = await getUserProfilesWithSubscriptions();
				if (subscribed) {
					setIsSubscribed(true);
				}
			} catch (err) {
				console.error("Error checking subscription:", err);
			}
		};

		checkSubscription();
	}, []);

	useEffect(() => {
		if (Notification.permission !== "granted") {
			Notification.requestPermission();
		}
	}, []);

	const sendNotification = () => {
		// Check if notifications are permitted
		if (Notification.permission === "granted") {
			console.log("notification sent");
			new Notification("Cyvex: The Crypto Graphic Detection tool", {
				body: "Your code has been successfully scanned, and your report is ready",
			});
		} else {
			alert("Please allow notifications to use this feature.");
		}
	};

	const login = () => {
		navigate("/login/email");
	};

	const detector = () => {
		navigate("/detector");
	};

	// Highlights which tab is active
	const handleTabClick = (path) => {
		setActiveTab(path);
		navigate(path);
	};

	// Placeholder function to detect language
	const detectLanguage = () => "Python";

	const handleScan = () => {
		const language = detectLanguage();
		const rulesForLanguage = detectionRules[language] || {};

		const lines = code.split("\n");
		const detectedCryptographicFunctions = [];
		const securityWarnings = [];
		const snippets = [];

		lines.forEach((lineContent, index) => {
			if (isCommentLine(lineContent)) return;

			const processedLine = stripInlineComment(lineContent);
			if (!processedLine.includes("(")) return;

			Object.entries(rulesForLanguage).forEach(([ruleName, regex]) => {
				if (regex.test(processedLine)) {
					if (!detectedCryptographicFunctions.includes(ruleName)) {
						detectedCryptographicFunctions.push(ruleName);
					}
					snippets.push({
						line: index + 1,
						code: lineContent,
						rule: ruleName,
					});
				}
			});
		});

		// Security Warnings
		if (detectedCryptographicFunctions.includes("SHA-1")) {
			securityWarnings.push("SHA-1 is weak.");
		}
		if (detectedCryptographicFunctions.includes("MD5")) {
			securityWarnings.push("MD5 is vulnerable to hash collisions.");
		}
		if (detectedCryptographicFunctions.includes("RSA (Weak Key)")) {
			securityWarnings.push(
				"Weak RSA key detected. Use 2048 bits or more."
			);
		}
		if (detectedCryptographicFunctions.includes("Hardcoded Key")) {
			securityWarnings.push("Avoid storing keys in source code.");
		}

		// Create report object
		const report = {
			language,
			codeLength: code.length,
			detectedCryptographicFunctions,
			securityWarnings,
			snippets,
		};

		// Send notification
		sendNotification();
		// Navigate to Report Page with report data
		navigate("/report", { state: { report } });
	};

	return (
		<>
			{/* Header (Fixed at the Top) */}
			<header className="bg-blue-950 fixed top-0 left-0 w-full py-4 px-8 shadow-md z-40">
				<div className="flex items-center justify-between w-full h-12">
					<h2 className="text-stone-50 text-3xl font-bold whitespace-nowrap">
						cyvex
					</h2>

					{/* Navigation Links (Centered) */}
					<nav className="hidden xl:flex items-center gap-4 lg:gap-8">
						<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
							solutions
						</h2>
						<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
							customers
						</h2>
						<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
							services
						</h2>
						<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
							insights
						</h2>
						<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
							company
						</h2>
					</nav>

					{/* Buttons (Right) */}
					<div className="hidden xl:flex items-center gap-4 lg:gap-8">
						<button
							onClick={login}
							className="w-24 lg:w-32 bg-stone-50 text-black px-4 lg:px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
						>
							Login
						</button>
						<button
							onClick={detector}
							className="w-24 lg:w-32 bg-stone-50 text-black px-4 lg:px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
						>
							Try It
						</button>
					</div>
					{/* Mobile Menu Button (Visible only on small screens) */}
					<button
						className="xl:hidden text-black text-2xl"
						onClick={toggleMenu}
					>
						☰
					</button>
				</div>
				{/* Mobile Menu (Conditionally rendered) */}
				{isMenuOpen && (
					<div className="xl:hidden bg-blue-900 w-full py-4 px-8 absolute left-0 top-20 shadow-lg z-50">
						<nav className="flex flex-col items-center gap-4">
							<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
								solutions
							</h2>
							<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
								customers
							</h2>
							<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
								services
							</h2>
							<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
								insights
							</h2>
							<h2 className="text-stone-50 text-xl font-bold cursor-pointer">
								company
							</h2>

							<div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
								<button
									onClick={login}
									className="w-full sm:w-auto bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
								>
									Login
								</button>
								<button
									onClick={detector}
									className="w-full sm:w-auto bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
								>
									Try It
								</button>
							</div>
						</nav>
					</div>
				)}
			</header>

			{/* Sidebar + Main Content Wrapper */}
			<div className="flex">
				{/* Sidebar */}
				<aside className="w-64 h-screen bg-gray-200 border-r border-gray-300 p-6 fixed top-20 left-0 z-30">
					<nav className="flex flex-col gap-4">
						<button
							onClick={() => handleTabClick("/detector")}
							className={`p-2 rounded-md text-left ${
								activeTab === "/detector"
									? "!bg-blue-950 text-white"
									: "hover:bg-gray-300"
							}`}
						>
							Upload Code
						</button>
						{/* Show or Hide "Git Pull" Based on Subscription */}
						{isSubscribed && (
							<button
								onClick={() => navigate("/github-pull")}
								className={`p-2 rounded-md text-left ${
									window.location.pathname === "/github-pull"
										? "!bg-blue-950 text-white"
										: "hover:bg-gray-300"
								}`}
							>
								Git Pull
							</button>
						)}
						<button
							onClick={() => handleTabClick("/report")}
							className={`p-2 rounded-md text-left ${
								activeTab === "/report"
									? "!bg-blue-950 text-white"
									: "hover:bg-gray-300"
							}`}
						>
							View Results
						</button>
					</nav>
				</aside>

				{/* Main Content */}
				<main className="ml-64 mt-20 p-6 w-full z-10">
					<p className="text-lg">
						{fileName !== "No file chosen"
							? `Analyzing file: ${fileName}`
							: "Paste or type your code below, then click 'Scan'."}
					</p>
					<textarea
						value={code}
						onChange={(e) => setCode(e.target.value)}
						rows={10}
						cols={60}
						className="w-full border border-gray-300 rounded-md p-2 mt-2"
					/>
					<button
						onClick={handleScan}
						className="mt-4 px-6 py-2 !bg-blue-950 text-white rounded-md hover:bg-blue-600 focus:outline-none transition duration-200"
					>
						Scan
					</button>
				</main>
			</div>
		</>
	);
}

export default Detector;
