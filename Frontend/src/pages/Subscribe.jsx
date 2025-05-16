// src/pages/Subscribe.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { checkCurrentUserSubscription } from "../controller/checkSub";
import { activateSubscription } from "../controller/subscriptionController";
import UserNav from "./UserNav";

export default function Subscribe() {
	const [userId, setUserId] = useState(null);
	const [isSubscribed, setIsSubscribed] = useState(null);
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState("");
	const navigate = useNavigate();

	// 1) get logged-in user ID
	useEffect(() => {
		supabase.auth.getUser().then(({ data: { user }, error }) => {
			if (error || !user) {
				navigate("/login/email");
			} else {
				setUserId(user.id);
			}
		});
	}, [navigate]);

	// 2) check subscription status
	useEffect(() => {
		if (!userId) return;
		checkCurrentUserSubscription()
			.then((sub) => setIsSubscribed(sub))
			.catch((err) => {
				console.error("Subscription check failed:", err);
				setIsSubscribed(false);
			});
	}, [userId]);

	const handleSubscribe = async () => {
		if (!userId) return;
		setLoading(true);
		setFeedback("");
		const { success, error } = await activateSubscription(userId);
		setLoading(false);

		if (error) {
			setFeedback(error);
		} else if (success) {
			// redirect on success
			navigate("/user-dashboard");
		}
	};

	// While we haven’t yet determined subscription status
	if (isSubscribed === null) {
		return (
			<div className="h-screen w-screen overflow-y-auto bg-gray-50 flex flex-col">
				<UserNav />
				<div className="h-screen w-screen flex items-center justify-center">
					<p>Loading…</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen w-screen overflow-y-auto bg-gray-50 flex flex-col">
			<UserNav />

			<div className="pt-20 px-4 sm:px-6 md:px-8 lg:px-12 py-10 flex-1">
				<div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
					<h1 className="text-2xl font-bold text-gray-800 mb-4">
						Manage Subscription
					</h1>

					{isSubscribed ? (
						<p className="text-green-600 mb-6">
							You already have an active subscription.
						</p>
					) : (
						<>
							<p className="text-gray-600 mb-6">
								Click below to activate or renew your one-month
								subscription.
							</p>

							{feedback && (
								<div className="mb-4 text-red-600 font-medium">
									{feedback}
								</div>
							)}

							<button
								onClick={handleSubscribe}
								disabled={loading}
								className={`w-full py-3 text-white rounded-lg font-medium ${
									loading
										? "bg-gray-400 cursor-not-allowed"
										: "bg-blue-600 hover:bg-blue-700"
								}`}
							>
								{loading
									? "Processing..."
									: "Activate / Renew Subscription"}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
