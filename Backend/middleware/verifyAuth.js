// verifyAuth.js
// This middleware function verifies if a request is authenticated and if the user has admin privileges.

const supabase = require("../config/supabaseAdminClient");

const verifyAuth = async (req, res, next) => {
	// Retrieve the Authorization header from the request, expecting the format "Bearer ACCESS_TOKEN"
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		// If the Authorization header is missing, return a 401 Unauthorized response
		return res.status(401).json({ error: "Missing Authorization header" });
	}

	// Extract token from header by splitting on space: "Bearer ACCESS_TOKEN"
	const token = authHeader.split(" ")[1];
	if (!token) {
		// If the token is missing after "Bearer", return a 401 Unauthorized response
		return res.status(401).json({ error: "Missing token" });
	}

	// Use Supabase's legacy API method to get the user data from the token
	const {
		data: { user },
	} = await supabase.auth.getUser(token);
	if (!user) {
		// Log error if user data retrieval fails and respond with 401 Unauthorized if token is invalid
		console.error("Error fetching user data:");
		return res.status(401).json({ error: "Invalid token" });
	}

	// Query the 'profiles' table to check the user's role for authorization
	const { data: profileData, error: profileError } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profileError) {
		// If an error occurs while fetching profile data, log and return a 400 Bad Request response
		console.error("Error fetching profile data:", profileError);
		return res.status(400).json({ error: profileError.message });
	}

	// Check if the user has an admin role
	if (profileData.role !== "admin") {
		// If the user is not an admin, return a 403 Forbidden response
		return res.status(403).json({ error: "Access denied. Admins only." });
	}

	// Attach the retrieved user data to the request object for further use in other middlewares or routes
	req.user = user;
	// Proceed to the next middleware or route handler
	next();
};

module.exports = verifyAuth;
