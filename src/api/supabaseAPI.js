import supabase from "../config/supabaseClient";

export const fetchUserProfilesWithSubscriptions = async () => {
	// Assuming your foreign key relationship is set up so that
	// profiles.id references subscription.id and the relationship name is "subscription".
	const { data, error } = await supabase
		.from("profiles")
		.select("*, subscription(*)")
		.eq("role", "user");

	if (error) {
		console.error("Error fetching profiles with subscriptions:", error);
		return { error: error.message };
	}
	return { data };
};
