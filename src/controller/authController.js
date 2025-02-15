import supabase from '../config/supabaseClient';

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
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return { error: error.message };
    if (!data?.user) return { error: "User creation failed." };

    console.log("User created successfully:", data.user);

    // Insert into profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id, username }]);

    if (profileError) return { error: profileError.message };

    return {
      message: "Sign-up successful! Please check your email to verify your account.",
    };
  } catch (err) {
    console.error("Unexpected error during sign-up:", err);
    return { error: "An error occurred during sign-up." };
  }
};

// Function to log in the user and fetch their username
export const loginUser = async (email, password) => {
  console.log("Attempting login...");

  // Step 1: Attempt to log in
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) return { error: authError.message };

  // Step 2: Check if the user's email is confirmed
  const user = authData.user;
  if (!user?.email_confirmed_at) {
    return { error: "Please verify your email before logging in." };
  }

  // Step 3: Fetch the username from the profiles table
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profileError) return { error: profileError.message };

  // Step 4: Return user details including username
  return { user, username: profileData.username };
};

// Function to resend vertification email
export const resendVerificationEmail = async (email) => {
  try {
    // Get the current user (optional, but useful for checking confirmation status)
    const { data: { user } } = await supabase.auth.getUser();

    // Check if email is already confirmed
    if (user?.email_confirmed_at) {
      return { error: "Email is already verified." };
    }

    // Resend verification email
    const { error } = await supabase.auth.resend({
      type: 'signup', // or 'signup' depending on your auth flow
      email
    });

    if (error) {
      console.error("Supabase Error:", error); // Log detailed error
      return { error: error.message || "Error resending email. Try again later." };
    }

    return { message: "Verification email sent. Check your inbox." };
  } catch (err) {
    console.error("Unhandled Error:", err);
    return { error: "An unexpected error occurred." };
  }
};