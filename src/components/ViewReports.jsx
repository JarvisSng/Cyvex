import React, { useEffect, useState } from "react";
import { fetchAdminProfiles } from "../controller/userController";
import deleteimg from "../images/delete.png";
import save from "../images/save.jpg";
import search from "../images/search.jpg";

const ViewReports = ({code, fileExt}) => {
	const [profiles, setProfiles] = useState([]);
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState([]);
	const [data, setData] = useState([]);

	// Default report
	const defaultReport = {
	language: "",
	codeLength: 0,
	detectedCryptographicFunctions: [],
	securityWarnings: [],
	snippets: [],
	};

	const [report, setReport] = useState(defaultReport);

	// Detect the programming language based on file extension or string content
	const detectLanguage = (fileExt) => {
		if (typeof fileExt === 'string') {
		  if (fileExt.includes("py")) {
			return "Python";
		  }
		  if (fileExt.includes("js")) {
			return "JavaScript";
		  sx}
		  if (fileExt.includes("cpp") || fileExt.includes("c++")) {
			return "C++";
		  }
		}
		return "Unknown";
	};

	const handleScan = () => {
	if (!code) return;

	const language = detectLanguage(fileExt);
	const rulesForLanguage = {};

	const lines = code.split("\n");
	const detectedCryptographicFunctions = [];
	const securityWarnings = [];
	const snippets = [];

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
		securityWarnings.push("Weak RSA key detected. Use 2048 bits or more.");
	}
	if (detectedCryptographicFunctions.includes("Hardcoded Key")) {
		securityWarnings.push("Avoid storing keys in source code.");
	}

	// Create report object
	const Report = {
		language,
		codeLength: code.length,
		detectedCryptographicFunctions,
		securityWarnings,
		snippets,
	};

	console.log(Report);
	setReport(Report);
	};

	useEffect(() => {
		if (code) {
		handleScan(); 
		}
	}, [code]); // Ensure scan runs only after detectionRules is set
	// Fetch profiles with related subscription data on mount
	useEffect(() => {
		const getProfiles = async () => {
			var username = localStorage.getItem("username");
			const result = await fetchAdminProfiles(username);
			if (result.error) {
				setError(result.error);
			} else {
				setProfiles(result.data);
				console.log(" profiles == " + profiles);
			}
		};
		getProfiles();
	}, []);

	return (
		<div className="overflow-hidden rounded-sm border-stroke bg-gray-2 shadow-default dark:border-strokedark dark:bg-boxdark">
			<div className="rounded-sm bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<h3 className="text-xl font-semibold text-black dark:text-white mb-4">
					Reports
				</h3>
				<div className="relative mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
					<div class="flex flex-row mb-1">
						<div className="w-14 flex-none">
							<a href="#">
								<img src={search} alt="Search" />
							</a>
						</div>
						<div className="w-64 flex-2 text-blue-900 text-xl">
							<p>Analysis_Report</p>
						</div>
					</div> 
					<div class="flex flex-row mb-8"> 
						<div className="w-64 flex-2 text-grey-500">
						<p>Date & Time: {new Date().toLocaleString()}, <time datetime={new Date().toISOString()}>{new Date().toLocaleString()}</time></p>
						</div> 
					</div>  
					<div class="flex flex-row"> 
						<div class="basis-sm"><b>File:</b> blockchain_test.py</div>
						<div class="basis-sm"><b>Language Detected:</b> {report.language}</div>
						<div class="basis-sm"><b>Functions Detected: </b>
						{report.detectedCryptographicFunctions.length > 0 ? (
							<ul>
							{report.detectedCryptographicFunctions.map((func, index) => (
								<li
								key={index}
								style={{
									color: insecureRules.includes(func) ? "red" : "green",
								}}
								>
								{func}
								</li>
							))}
							</ul> 
						) : (
							<p>1</p>
						)}

						</div>
						<div class="basis-sm"><b>Security Warning:</b> 
						{report.securityWarnings.length > 0 ? (
							<ul>
							{report.securityWarnings.map((warning, index) => (
								<li key={index} style={{ color: "red" }}>
								{warning}
								</li>
							))}
							</ul>
						) : (
							<p>No security warnings.</p>
						)}

						</div> 
						<div class="basis-sm relative">  
							 <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-4">
								<button className="p-2 !pl-8 !pr-8 text-left !bg-blue-950 text-white mb-4"> View </button>
								<button className="p-2 !pl-8 !pr-8 text-left !bg-blue-950 text-white mb-4"> Delete </button>
							</div>
							
						</div>
					</div>
					{/* <div class="absolute bottom-4 right-2 p-4">
						<button className="p-2 rounded-md text-left !bg-blue-950 text-white mb-4"> View </button> <br/> 
						<button className="p-2 rounded-md text-left !bg-blue-950 text-white"> Delete </button>
					</div> */}
				</div> 
 
			</div>
		</div>
	);
};

export default ViewReports;
