require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import route modules
const blockchainRoutes = require("./routes/blockchain");
const analyzeRoutes = require("./routes/analyze");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Logging middleware for all requests
app.use((req, res, next) => {
	console.log(`Received ${req.method} request for: ${req.url}`);
	next();
});

// Configure CORS for API requests
app.use(
	cors({
		origin: "http://localhost:5173", // Allow your frontend origin
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.options("*", cors());

// Parse incoming JSON bodies
app.use(express.json());

// Mount your API routes first
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/analyze", analyzeRoutes);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "..", "dist"))); // adjust the path if needed

// Fallback route: For any request not matching an API route, serve index.html so that
// client-side routing (e.g. /reset-password) works correctly.
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
