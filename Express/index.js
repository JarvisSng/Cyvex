// index.js

const express = require("express");
const cors = require("cors");

// Import route modules
const blockchainRoutes = require("./routes/blockchain");
const analyzeRoutes = require("./routes/analyze");

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());
// Parse incoming JSON bodies
app.use(express.json());

// Mount the routes:
// - GET requests to /api/blockchain/:name will be handled in routes/blockchain.js
// - POST requests to /api/analyze will be handled in routes/analyze.js
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/analyze", analyzeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
