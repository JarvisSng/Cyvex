// Load environment variables from the .env file
require("dotenv").config();

// Import dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import route modules
const blockchainRoutes = require("./routes/blockchain");
const analyzeRoutes = require("./routes/analyze");
const adminRoutes = require("./routes/adminRoutes");
const userManagementRoutes = require("./routes/userMangementRoutes");
const rulesRoutes = require("./routes/rulesRoutes");
const rulesMangementRoutes = require("./routes/rulesManagementRoutes");
const getUserRoutes = require("./routes/getUserRoutes");
const evmOpcodesRouter = require("./routes/evmOpcodes");
const cryptoPatternsRouter = require("./routes/cryptoPatterns");
const opcodePatternsRouter = require("./routes/opcodePatterns");
const evmRoutes = require("./routes/evmRoutes");

// Initialize the Express application
const app = express();

// Logging middleware: Logs every incoming request with its method and URL
app.use((req, res, next) => {
	console.log(`Received ${req.method} request for: ${req.url}`);
	next();
});

// Configure CORS for API requests
app.use(
	cors({
		origin: "http://localhost:5173", // Allow requests from the specified frontend URL
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
		allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers for requests
		credentials: true // If using cookies/auth
	})
);

// Enable pre-flight across-the-board
app.options("/{*splat}", cors());

// Parse incoming JSON bodies from HTTP requests
app.use(express.json());

// Mount the API routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userManagementRoutes);
app.use("/api/rules", rulesRoutes);
app.use("/api/rules-management", rulesMangementRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/getUser", getUserRoutes);
app.use("/api/evm-opcodes", evmOpcodesRouter);
app.use("/api/crypto-patterns", cryptoPatternsRouter);
app.use("/api/opcode-patterns", opcodePatternsRouter);
app.use("/api/evm", evmRoutes);

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
	res.status(404).json({ error: "API endpoint not found" });
  });
  
// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Internal server error" });
});

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "..", "dist"))); // Adjust the path if needed

// Fallback route: Serve index.html for any request not matching an API route.
// This supports client-side routing (e.g., /reset-password)
app.get("/{*splat}", (req, res) => {
	res.sendFile(path.join(__dirname, "../../Frontend", "dist", "index.html"));
});

// Set port from environment variables or default to 3000, and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
