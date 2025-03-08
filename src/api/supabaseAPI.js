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

// Fetch a single user profile with subscription details
export const fetchUserProfile = async (userId) => {
	const { data, error } = await supabase
		.from("profiles")
		.select("*, subscription(*)")
		.eq("id", userId)
		.single();

	if (error) {
		console.error("Error fetching user profile:", error);
		return { error: error.message };
	}
	return { data };
};

// Update subscription details
export const updateUserSubscription = async (userId, subscription) => {
	const { data, error } = await supabase
		.from("subscription")
		.update({
			start_date: subscription.start_date,
			end_date: subscription.end_date,
			subscribed: subscription.subscribed,
			payment_confirm: subscription.payment_confirm,
		})
		.eq("id", userId)
		.select();
	if (error) {
		console.error("Error updating subscription:", error);
		return { error: error.message };
	}
	return { message: "Subscription updated successfully." };
};
