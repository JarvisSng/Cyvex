// config/supabaseClient.js
require("dotenv").config(); // Ensure environment variables are loaded

const { createClient } = require("@supabase/supabase-js");

// Use backend environment variables (do not use VITE_ prefix on the backend)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	throw new Error(
		"Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables"
	);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

module.exports = supabase;
