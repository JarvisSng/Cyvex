// verifyAuth.js
const supabase = require("../../src/config/supabaseAdminClient");

const verifyAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ error: "Missing Authorization header" });
	}

	// Extract token from header: "Bearer ACCESS_TOKEN"
	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "Missing token" });
	}

	// Get user data using the legacy API method
	const {
		data: { user },
	} = await supabase.auth.getUser(token);
	if (!user) {
		console.error("Error fetching user data:", userError);
		return res.status(401).json({ error: "Invalid token" });
	}

	// Look up the user in the profiles table to verify role
	const { data: profileData, error: profileError } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profileError) {
		console.error("Error fetching profile data:", profileError);
		return res.status(400).json({ error: profileError.message });
	}

	if (profileData.role !== "admin") {
		return res.status(403).json({ error: "Access denied. Admins only." });
	}

	req.user = user; // Attach user data to the request object
	next();
};

module.exports = verifyAuth;
