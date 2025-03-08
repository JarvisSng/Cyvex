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

export const fetchAdminProfiles = async (username) => {
	// Assuming your foreign key relationship is set up so that
	// profiles.id references subscription.id and the relationship name is "subscription".
	const { data: userdata, error: uerror } = await supabase
		.from("profiles")
		.select(`*`)
		.eq("username", username)
		.eq("role", "admin");  

	// let adminID = data[0]?.id;
	const { data, error } = await supabase.auth.getUser();
	Object.assign(data, userdata);
	console.log("data ===", data);
	if (error) {
		console.error("Error fetching admin profiles:", error);
		return { error: error.message }; 
	}
	return { data };
}; 

export const updateData = async (id, username, status) => {  
	// Assuming your foreign key relationship is set up so that
	// profiles.id references subscription.id and the relationship name is "subscription".
	// const { data, error } = await supabase.from('profiles')  
	// 				.upsert([{id: id, status: status}] , { onConflict: 'id', defaultToNull: false});
					// .update({ status: status })   
					// .eq('username', username) 
					// .select();   
					const { data, error } = await supabase
					.from('profiles')
					.update({ status: status })
					.eq('id', id) 
					// .like('username', '%jarvissng%')
					.select()
	// const { data, error } = await supabase.auth.updateUser({ status: status });  
   
	if (error) { 
		console.error("Error updating admin profiles:", error);
		return { error: error.message }; 
	} 
	return { data };
}; 