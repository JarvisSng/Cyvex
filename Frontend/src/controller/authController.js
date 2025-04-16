import supabase from "../config/supabaseClient";

// Function to handle user sign-up
export const signUpUser = async (email, username, password) => {
	console.log("Starting sign-up process...");

	if (!email || !username || !password) {
		return { error: "All fields are required." };
	}

	if (password.length < 8) {
		return { error: "Password must be at least 8 characters." };
	}

	try {
		console.log("Attempting to create user...");
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { username }, // Pass username as part of user metadata
			},
		});

		if (error) return { error: error.message };
		if (!data?.user) return { error: "User creation failed." };

		console.log("User created successfully:", data.user);

		// No need to manually insert into the profiles table.
		// The trigger will automatically insert the row using the passed username.

		return {
			message:
				"Sign-up successful! Please check your email to verify your account.",
		};
	} catch (err) {
		console.error("Unexpected error during sign-up:", err);
		return { error: "An error occurred during sign-up." };
	}
};

//Login route both for admin and normal user, redirects accordingly
// Function to log in the user and fetch their username, role, status, etc.
export const loginUser = async (email, password) => {
	console.log("Attempting login...");

	// Step 1: Attempt to log in
	const { data: authData, error: authError } =
		await supabase.auth.signInWithPassword({
			email,
			password,
		});
	if (authError) return { error: authError.message };

	// Step 2: Check if the user's email is confirmed
	const user = authData.user;
	if (!user?.email_confirmed_at) {
		return { error: "Please verify your email before logging in." };
	}

	// Step 3: Fetch the username, role, status, and banned_until from the profiles table
	const { data: profileData, error: profileError } = await supabase
		.from("profiles")
		.select("username, role, status, banned_until")
		.eq("id", user.id)
		.single();
	if (profileError) return { error: profileError.message };

	// Check account status and return error if not allowed to login
	if (profileData.status === "Suspended") {
		if (profileData.banned_until != null) {
			const formattedDate = new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			}).format(new Date(profileData.banned_until));
			return { error: `The account is suspended until ${formattedDate}` };
		} else {
			return { error: `The account is suspended` };
		}
	}
	if (profileData.status === "Deleted") {
		return { error: "This account has been deleted." };
	}

	// Optionally, check allowed roles (if needed)
	const allowedRoles = ["user", "admin"];
	if (!allowedRoles.includes(profileData.role)) {
		return { error: "Access denied. Your role does not permit login." };
	}

	// Store user info in local storage
	localStorage.setItem("username", profileData.username);
	localStorage.setItem("role", profileData.role);

	// Return user details (do not redirect here)
	return {
		user,
		username: profileData.username,
		role: profileData.role,
		status: profileData.status,
		banned_until: profileData.banned_until,
	};
};

// Function to logout user
export const logoutUserAll = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error("Error logging out:", error);
		return { error: error.message };
	}
	// Clear local storage so that user data is removed from the client
	localStorage.clear();
	return { message: "Logout successful." };
};

// Function to resend vertification email
export const resendVerificationEmail = async (email) => {
	try {
		// Get the current user (optional, but useful for checking confirmation status)
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// Check if email is already confirmed
		if (user?.email_confirmed_at) {
			return { error: "Email is already verified." };
		}

		// Resend verification email
		const { error } = await supabase.auth.resend({
			type: "signup", // or 'signup' depending on your auth flow
			email,
		});

		if (error) {
			console.error("Supabase Error:", error); // Log detailed error
			return {
				error:
					error.message || "Error resending email. Try again later.",
			};
		}

		return { message: "Verification email sent. Check your inbox." };
	} catch (err) {
		console.error("Unhandled Error:", err);
		return { error: "An unexpected error occurred." };
	}
};

// Function to handle admin login
export const loginAdmin = async (email, password) => {
	console.log("Admin login attempt...");

	const { data: authData, error: authError } =
		await supabase.auth.signInWithPassword({
			email,
			password,
		});

	if (authError) return { error: authError.message };

	const user = authData.user;

	// Fetch role from profiles table
	const { data: profileData, error: profileError } = await supabase
		.from("profiles")
		.select("username, role")
		.eq("id", user.id)
		.single();

	if (profileError) return { error: profileError.message };

	// Check if the user is an admin
	if (profileData.role !== "admin") {
		return { error: "Access denied. Not an admin." };
	}

	// Store admin login info
	localStorage.setItem("username", profileData.username);
	localStorage.setItem("role", profileData.role);

	return { user, username: profileData.username, role: profileData.role };
};

// Function to handle user/admin logout
export const logoutUser = async () => {
	await supabase.auth.signOut();

	// Get the stored role before clearing local storage
	const role = localStorage.getItem("role");

	// Clear stored user info
	localStorage.clear();

	// Redirect user to the correct login page
	if (role === "admin") {
		window.location.href = "/admin-login"; // Redirect admins
	} else {
		window.location.href = "/login"; // Redirect normal users
	}
};

// Function to handle account reset
export const AccountResetEmail = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/resetAccount/password",
    });

	if (error) {
		console.error("Error updating password:", error.message);
	} else {
		console.log("Password updated successfully.");
	}
	console.log("Password reset email sent successfully.");
    return { success: true };  // ✅ Return success object
};

export const AccountResetPassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        console.error("Error updating password:", error.message);
        return { success: false, message: error.message };
    } else {
        console.log("Password updated successfully.");
        return { success: true, message: "Password updated successfully." };
    }
};