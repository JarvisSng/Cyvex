// src/components/ManageRules.jsx
import React, { useEffect, useState } from "react";
import {
	createDetectionRule,
	deleteDetectionRule,
	getDetectionRules,
	updateDetectionRule,
} from "../controller/rulesManagementController";

const ManageRules = () => {
	const [rules, setRules] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Form state for adding a new rule
	const [newLanguage, setNewLanguage] = useState("");
	const [newRuleName, setNewRuleName] = useState("");
	const [newRegex, setNewRegex] = useState("");

	const fetchRules = async () => {
		setLoading(true);
		const result = await getDetectionRules();
		if (result.error) {
			setError(result.error);
		} else {
			// result.data is expected to be grouped by language
			setRules(result.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchRules();
	}, []);

	const handleAddRule = async () => {
		if (!newLanguage || !newRuleName || !newRegex) {
			alert("Please fill in all fields.");
			return;
		}
		const rule = {
			language: newLanguage,
			rule_name: newRuleName,
			regex_pattern: newRegex,
		};
		const result = await createDetectionRule(rule);
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			alert(result.message);
			// Clear the form fields
			setNewLanguage("");
			setNewRuleName("");
			setNewRegex("");
			fetchRules();
		}
	};

	// Helper function to update a rule in state
	const handleRuleChange = (language, ruleId, field, value) => {
		setRules((prevRules) => {
			const updatedRulesForLanguage = prevRules[language].map((rule) => {
				if (rule.id === ruleId) {
					return { ...rule, [field]: value };
				}
				return rule;
			});
			return { ...prevRules, [language]: updatedRulesForLanguage };
		});
	};

	const handleUpdateRule = async (ruleId, language) => {
		const ruleToUpdate = rules[language].find((rule) => rule.id === ruleId);
		if (!ruleToUpdate) return;
		const updatedRule = {
			language,
			rule_name: ruleToUpdate.rule_name,
			regex_pattern: ruleToUpdate.regex_pattern,
		};
		const result = await updateDetectionRule(ruleId, updatedRule);
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			alert(result.message);
			fetchRules();
		}
	};

	const handleDeleteRule = async (ruleId) => {
		if (!window.confirm("Are you sure you want to delete this rule?"))
			return;
		const result = await deleteDetectionRule(ruleId);
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			alert(result.message);
			fetchRules();
		}
	};

	if (loading) return <div>Loading detection rules...</div>;
	if (error) return <div className="text-red-500">Error: {error}</div>;

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4 text-gray-600">
				Manage Rules
			</h2>

			{/* New Rule Form */}
			<div className="mb-8 p-4 border rounded shadow text-gray-600">
				<h3 className="text-xl font-semibold mb-2">Add New Rule</h3>
				<div className="mb-2">
					<input
						type="text"
						placeholder="Language (e.g., JavaScript)"
						value={newLanguage}
						onChange={(e) => setNewLanguage(e.target.value)}
						className="border p-2 mr-2"
					/>
					<input
						type="text"
						placeholder="Rule Name (e.g., AES)"
						value={newRuleName}
						onChange={(e) => setNewRuleName(e.target.value)}
						className="border p-2 mr-2"
					/>
					<input
						type="text"
						placeholder="Regex Pattern"
						value={newRegex}
						onChange={(e) => setNewRegex(e.target.value)}
						className="border p-2 mr-2 w-96"
					/>
				</div>
				<button
					onClick={handleAddRule}
					className="!bg-gray-800 hover:!bg-blue-600 text-white px-4 py-2 rounded"
				>
					Add Rule
				</button>
			</div>

			{/* Display Rules Grouped by Language */}
			{Object.keys(rules).map((language) => (
				<div key={language} className="mb-6 text-gray-600">
					<h3 className="text-2xl font-bold text-gray-800 mb-2  ">
						{language}
					</h3>
					{rules[language].map((rule) => (
						<div key={rule.id} className="flex items-center mb-2">
							<div className="flex-grow">
								<div>
									<strong>Rule Name:</strong>{" "}
									<input
										type="text"
										value={rule.rule_name}
										onChange={(e) =>
											handleRuleChange(
												language,
												rule.id,
												"rule_name",
												e.target.value
											)
										}
										className="border p-1"
									/>
								</div>
								<div>
									<strong>Regex Pattern:</strong>{" "}
									<input
										type="text"
										value={rule.regex_pattern}
										onChange={(e) =>
											handleRuleChange(
												language,
												rule.id,
												"regex_pattern",
												e.target.value
											)
										}
										className="border p-1 w-full"
									/>
								</div>
							</div>
							<button
								onClick={() =>
									handleUpdateRule(rule.id, language)
								}
								className="!bg-gray-800 hover:!bg-green-600 text-white px-3 py-1 rounded ml-4"
							>
								Update
							</button>
							<button
								onClick={() => handleDeleteRule(rule.id)}
								className="!bg-gray-800 hover:!bg-red-600 text-white px-3 py-1 rounded ml-4"
							>
								Delete
							</button>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default ManageRules;
