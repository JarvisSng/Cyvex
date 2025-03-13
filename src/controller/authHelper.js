import supabase from "../config/supabaseClient";

// Get the access token using the new getSession method.
export const getAuthToken = async () => {
	const { data, error } = await supabase.auth.getSession();
	if (error) {
		console.error("Error getting session:", error);
		return null;
	}
	// data.session contains the session if available.
	return data.session?.access_token || null;
};

// A helper function that wraps fetch and adds the Authorization header
export const fetchWithAuth = async (url, options = {}) => {
	const token = await getAuthToken();
	const headers = {
		"Content-Type": "application/json",
		...options.headers,
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	return fetch(url, { ...options, headers });
};
