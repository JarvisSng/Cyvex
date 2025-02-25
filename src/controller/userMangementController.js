import supabase from "../config/supabaseClient";

export const deleteUser = async (targetUserId, currentUserRole) => {
	// Check if the current user is an admin.
	if (currentUserRole !== "admin") {
		return { error: "Access denied. Only admins can delete users." };
	}

	try {
		// Step 1: Delete the user's profile record.
		const { error: profileError } = await supabase
			.from("profiles")
			.delete()
			.eq("id", targetUserId);

		if (profileError) {
			return { error: profileError.message };
		}

		// Step 2: Delete the user from Supabase Auth.
		// Note: This requires that your supabase client is initialized with a service_role key.
		const { error: authError } = await supabase.auth.admin.deleteUser(
			targetUserId
		);

		if (authError) {
			return { error: authError.message };
		}

		return { message: "User successfully deleted." };
	} catch (err) {
		console.error("Unexpected error during user deletion:", err);
		return {
			error: "An error occurred while attempting to delete the user.",
		};
	}
};
