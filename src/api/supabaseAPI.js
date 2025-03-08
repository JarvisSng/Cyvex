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

// Suspend a user account
export const suspendUserAccount = async (userId) => {
	const { error } = await supabase
		.from("profiles")
		.update({ suspended: true })
		.eq("id", userId);
	if (error) {
		console.error("Error suspending user:", error);
		return { error: error.message };
	}
	return { message: "User suspended successfully." };
};

// Delete a user account
export const deleteUserAccount = async (userId, currentUserRole) => {
	// Check for admin rights in your business logic before calling this function
	if (currentUserRole !== "admin") {
		return { error: "Access denied. Only admins can delete users." };
	}

	// Step 1: Delete the user's profile record.
	const { error: profileError } = await supabase
		.from("profiles")
		.delete()
		.eq("id", userId);
	if (profileError) {
		return { error: profileError.message };
	}

	// Step 2: Delete the user from Supabase Auth.
	const { error: authError } = await supabase.auth.admin.deleteUser(userId);
	if (authError) {
		return { error: authError.message };
	}

	return { message: "User successfully deleted." };
};

// const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
// 	auth: {
// 		autoRefreshToken: false,
// 		persistSession: false,
// 		storageKey: "supabase.admin.auth.token", // custom storage key for admin instance
// 	},
// });

// Reset user password using userId instead of email
export const resetUserPassword = async (userId) => {
	// Retrieve user info from Supabase Auth using the admin API
	const { data: userData, error: getUserError } =
		await supabase.auth.admin.getUser(userId);

	if (getUserError) {
		console.error("Error fetching user data:", getUserError);
		return { error: getUserError.message };
	}

	// Extract the email from the retrieved user data
	const email = userData.user.email;

	// Send password reset email using the retrieved email
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: window.location.origin + "/reset-password",
	});

	if (error) {
		console.error("Error resetting password:", error);
		return { error: error.message };
	}

	return { message: "Password reset email sent successfully." };
};
