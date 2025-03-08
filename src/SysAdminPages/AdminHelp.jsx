// src/pages/Help.jsx
import React from "react";
import AdminNav from "./AdminNav";

const AdminHelp = () => {
	return (
		<div className="w-screen h-screen flex flex-col bg-gray-50">
			<AdminNav />
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="w-full h-full bg-white shadow rounded p-8">
					<h1 className="text-3xl font-bold text-gray-700 mb-4">
						Help
					</h1>
					<p className="text-lg text-gray-600 mb-6">
						Here you can find answers to frequently asked questions
						and helpful guides.
					</p>
					<div className="space-y-4">
						<div>
							<h2 className="text-xl font-semibold text-gray-700 mb-1">
								How to Reset Your Password?
							</h2>
							<p className="text-gray-700">
								If you've forgotten your password, click the
								"Reset Password" link on the login page to get
								started.
							</p>
						</div>
						<div>
							<h2 className="text-xl font-semibold text-gray-700 mb-1">
								Contact Support
							</h2>
							<p className="text-gray-700">
								For further assistance, please reach out to our
								support team at support@example.com.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminHelp;
