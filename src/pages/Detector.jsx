// detector.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetectionRules } from "../controller/rulesController";


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

	const login = () => {
		navigate("/login/email");
	};

	const detector = () => {
		navigate("/detector");
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

		// Navigate to Report Page with report data
		navigate("/report", { state: { report } });
	};

	return (
		<>
			{/* Header (Fixed at the Top) */}
			<header className="bg-blue-950 absolute top-0 left-0 w-full py-4 px-8 shadow-md z-50 h-20">
				<div className="flex items-center justify-between w-full h-full">
					<h2 className="text-stone-50 text-4xl font-bold flex items-center">
						cyvex
					</h2>

					{/* Navigation Links (Centered) */}
					<nav className="flex items-center gap-8">
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							solutions
						</h2>
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							customers
						</h2>
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							services
						</h2>
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							insights
						</h2>
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							company
						</h2>
					</nav>

					{/* Buttons (Right) */}
					<div className="flex items-center gap-4">
						<button
							onClick={login}
							className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
						>
							Login
						</button>
						<button
							onClick={detector}
							className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
						>
							Try It
						</button>
					</div>
				</div>
			</header>

			{/* Sidebar + Main Content Wrapper */}
			<div className="flex">
				{/* Sidebar */}
				<aside className="w-64 h-screen bg-gray-200 text-white p-6 fixed top-20 left-0">
					<nav className="flex flex-col gap-4">
						<a
							href="/detector"
							className="hover:bg-gray-300 p-2 rounded-md"
						>
							Upload Code
						</a>
						<div className="ml-4">
							<a
								href="/github-pull"
								className="hover:bg-gray-400 p-2 rounded-md text-blue-700"
							>
								● Git Pull
							</a>
						</div>
						<a
							href="/report"
							className="hover:bg-gray-300 p-2 rounded-md"
						>
							View Results
						</a>
					</nav>
				</aside>

				{/* Main Content */}
				<main className="ml-64 mt-20 p-6 w-full">
					<h1 className="text-2xl font-bold text-gray-800">
						Detector
					</h1>
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
						className="mt-4 px-6 py-2 bg-blue-900 text-black rounded-md hover:bg-blue-600 focus:outline-none transition duration-200"
					>
						Scan
					</button>
				</main>
			</div>
		</>
	);
}

export default Detector;
