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
	})
);

// Enable pre-flight across-the-board
app.options("*", cors());

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

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "..", "dist"))); // Adjust the path if needed

// Fallback route: Serve index.html for any request not matching an API route.
// This supports client-side routing (e.g., /reset-password)
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

// Set port from environment variables or default to 3000, and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
