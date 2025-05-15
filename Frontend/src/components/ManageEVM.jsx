// src/components/ManageEVM.jsx
import React, { useEffect, useState } from "react";
import {
	createCryptoPattern,
	deleteCryptoPattern,
	getCryptoPatterns,
	updateCryptoPattern,
} from "../controller/cryptoPatternsManagementController";
import {
	createEvmOpcode,
	deleteEvmOpcode,
	getEvmOpcodes,
	updateEvmOpcode,
} from "../controller/evmOpcodesManagementController";
import {
	createOpcodePattern,
	deleteOpcodePattern,
	getOpcodePatterns,
	updateOpcodePattern,
} from "../controller/opcodePatternsManagementController";

const ManageEVM = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [evmOpcodes, setEvmOpcodes] = useState([]);
	const [cryptoPatterns, setCryptoPatterns] = useState([]);
	const [opcodePatterns, setOpcodePatterns] = useState([]);

	const [newOpcode, setNewOpcode] = useState("");
	const [newMnemonic, setNewMnemonic] = useState("");

	const [newCryptoName, setNewCryptoName] = useState("");
	const [newCryptoSig, setNewCryptoSig] = useState("");

	const [newOpName, setNewOpName] = useState("");
	const [newOpRegex, setNewOpRegex] = useState("");

	const fetchAll = async () => {
		setLoading(true);
		setError("");
		try {
			const evmRes = await getEvmOpcodes();
			if (evmRes.error) throw new Error(evmRes.error);
			setEvmOpcodes(evmRes.data);

			const cryptoRes = await getCryptoPatterns();
			if (cryptoRes.error) throw new Error(cryptoRes.error);
			setCryptoPatterns(cryptoRes.data);

			const opRes = await getOpcodePatterns();
			if (opRes.error) throw new Error(opRes.error);
			setOpcodePatterns(opRes.data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAll();
	}, []);

	// Handlers for EVM opcodes
	const handleAddEvm = async () => {
		if (!newOpcode || !newMnemonic) return alert("Fill code & mnemonic.");
		const res = await createEvmOpcode({
			opcode: newOpcode,
			mnemonic: newMnemonic,
		});
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			setNewOpcode("");
			setNewMnemonic("");
			fetchAll();
		}
	};

	const handleUpdateEvm = async (code) => {
		const entry = evmOpcodes.find((e) => e.opcode === code);
		const res = await updateEvmOpcode(code, { mnemonic: entry.mnemonic });
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			fetchAll();
		}
	};

	const handleDeleteEvm = async (code) => {
		if (!window.confirm("Delete opcode?")) return;
		const res = await deleteEvmOpcode(code);
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			fetchAll();
		}
	};

	// Handlers for Crypto patterns
	const handleAddCrypto = async () => {
		if (!newCryptoName || !newCryptoSig)
			return alert("Fill name & signature.");
		const res = await createCryptoPattern({
			pattern_name: newCryptoName,
			signature: newCryptoSig,
		});
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			setNewCryptoName("");
			setNewCryptoSig("");
			fetchAll();
		}
	};

	const handleUpdateCrypto = async (id) => {
		const entry = cryptoPatterns.find((c) => c.id === id);
		const res = await updateCryptoPattern(id, {
			pattern_name: entry.pattern_name,
			signature: entry.signature,
		});
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			fetchAll();
		}
	};

	const handleDeleteCrypto = async (id) => {
		if (!window.confirm("Delete crypto pattern?")) return;
		const res = await deleteCryptoPattern(id);
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			fetchAll();
		}
	};

	// Handlers for Opcode regex patterns
	const handleAddOp = async () => {
		if (!newOpName || !newOpRegex) return alert("Fill name & regex.");
		const res = await createOpcodePattern({
			pattern_name: newOpName,
			regex_pattern: newOpRegex,
		});
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			setNewOpName("");
			setNewOpRegex("");
			fetchAll();
		}
	};

	const handleUpdateOp = async (id) => {
		const entry = opcodePatterns.find((o) => o.id === id);
		const res = await updateOpcodePattern(id, {
			pattern_name: entry.pattern_name,
			regex_pattern: entry.regex_pattern,
		});
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			fetchAll();
		}
	};

	const handleDeleteOp = async (id) => {
		if (!window.confirm("Delete opcode pattern?")) return;
		const res = await deleteOpcodePattern(id);
		if (res.error) alert(res.error);
		else {
			alert(res.message);
			fetchAll();
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error)
		return <div className="text-red-600 font-semibold">Error: {error}</div>;

	const inputCls =
		"border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
	const addBtnCls =
		"!bg-blue-950 hover:bg-blue-700 text-white px-4 py-2 rounded-md";
	const updateBtnCls =
		"!bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md";
	const deleteBtnCls =
		"!bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md";

	return (
		<div className="space-y-12">
			{/* EVM Opcodes */}
			<section className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Manage EVM Opcodes
				</h2>
				<div className="flex space-x-2 mb-4">
					<input
						className={`${inputCls} w-32`}
						placeholder="Opcode (hex)"
						value={newOpcode}
						onChange={(e) => setNewOpcode(e.target.value)}
					/>
					<input
						className={`${inputCls} flex-1`}
						placeholder="Mnemonic"
						value={newMnemonic}
						onChange={(e) => setNewMnemonic(e.target.value)}
					/>
					<button onClick={handleAddEvm} className={addBtnCls}>
						Add Opcode
					</button>
				</div>
				{evmOpcodes.map(({ opcode, mnemonic }) => (
					<div
						key={opcode}
						className="flex items-center space-x-2 mb-2"
					>
						<span className="font-mono w-16 text-gray-700">
							{opcode}
						</span>
						<input
							className={`${inputCls} flex-1`}
							value={mnemonic}
							onChange={(e) =>
								setEvmOpcodes((prev) =>
									prev.map((o) =>
										o.opcode === opcode
											? { ...o, mnemonic: e.target.value }
											: o
									)
								)
							}
						/>
						<button
							onClick={() => handleUpdateEvm(opcode)}
							className={updateBtnCls}
						>
							Update
						</button>
						<button
							onClick={() => handleDeleteEvm(opcode)}
							className={deleteBtnCls}
						>
							Delete
						</button>
					</div>
				))}
			</section>

			{/* Crypto Patterns */}
			<section className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Manage Crypto Patterns
				</h2>
				<div className="flex space-x-2 mb-4">
					<input
						className={`${inputCls} flex-1`}
						placeholder="Pattern Name"
						value={newCryptoName}
						onChange={(e) => setNewCryptoName(e.target.value)}
					/>
					<input
						className={`${inputCls} w-64`}
						placeholder="Signature"
						value={newCryptoSig}
						onChange={(e) => setNewCryptoSig(e.target.value)}
					/>
					<button onClick={handleAddCrypto} className={addBtnCls}>
						Add Pattern
					</button>
				</div>
				{cryptoPatterns.map(({ id, pattern_name, signature }) => (
					<div key={id} className="flex items-center space-x-2 mb-2">
						<input
							className={`${inputCls} flex-1`}
							value={pattern_name}
							onChange={(e) =>
								setCryptoPatterns((prev) =>
									prev.map((c) =>
										c.id === id
											? {
													...c,
													pattern_name:
														e.target.value,
											  }
											: c
									)
								)
							}
						/>
						<input
							className={`${inputCls} w-64`}
							value={signature}
							onChange={(e) =>
								setCryptoPatterns((prev) =>
									prev.map((c) =>
										c.id === id
											? {
													...c,
													signature: e.target.value,
											  }
											: c
									)
								)
							}
						/>
						<button
							onClick={() => handleUpdateCrypto(id)}
							className={updateBtnCls}
						>
							Update
						</button>
						<button
							onClick={() => handleDeleteCrypto(id)}
							className={deleteBtnCls}
						>
							Delete
						</button>
					</div>
				))}
			</section>

			{/* Opcode Regex Patterns */}
			<section className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Manage Opcode Regex Patterns
				</h2>
				<div className="flex space-x-2 mb-4">
					<input
						className={`${inputCls} flex-1`}
						placeholder="Pattern Name"
						value={newOpName}
						onChange={(e) => setNewOpName(e.target.value)}
					/>
					<input
						className={`${inputCls} w-64`}
						placeholder="Regex Pattern"
						value={newOpRegex}
						onChange={(e) => setNewOpRegex(e.target.value)}
					/>
					<button onClick={handleAddOp} className={addBtnCls}>
						Add Regex
					</button>
				</div>
				{opcodePatterns.map(({ id, pattern_name, regex_pattern }) => (
					<div key={id} className="flex items-center space-x-2 mb-2">
						<input
							className={`${inputCls} flex-1`}
							value={pattern_name}
							onChange={(e) =>
								setOpcodePatterns((prev) =>
									prev.map((o) =>
										o.id === id
											? {
													...o,
													pattern_name:
														e.target.value,
											  }
											: o
									)
								)
							}
						/>
						<input
							className={`${inputCls} w-64`}
							value={regex_pattern}
							onChange={(e) =>
								setOpcodePatterns((prev) =>
									prev.map((o) =>
										o.id === id
											? {
													...o,
													regex_pattern:
														e.target.value,
											  }
											: o
									)
								)
							}
						/>
						<button
							onClick={() => handleUpdateOp(id)}
							className={updateBtnCls}
						>
							Update
						</button>
						<button
							onClick={() => handleDeleteOp(id)}
							className={deleteBtnCls}
						>
							Delete
						</button>
					</div>
				))}
			</section>
		</div>
	);
};

export default ManageEVM;
