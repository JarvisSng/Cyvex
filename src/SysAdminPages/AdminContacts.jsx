// src/pages/Contacts.jsx
import React from "react";
import AdminNav from "./AdminNav";

const AdminContacts = () => {
	return (
		<div className="w-screen h-screen flex flex-col bg-gray-50">
			<AdminNav />
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="w-full h-full bg-white shadow rounded p-8">
					<h1 className="text-3xl font-bold text-gray-700 mb-4">
						Contacts
					</h1>
					<p className="text-lg text-gray-600 mb-6">
						If you have any questions or need further assistance,
						please contact us using the details below:
					</p>
					<ul className="text-gray-700 space-y-2">
						<li>
							<strong>Email:</strong> support@example.com
						</li>
						<li>
							<strong>Phone:</strong> (123) 456-7890
						</li>
						<li>
							<strong>Address:</strong> 123 Example Road, City,
							Country
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default AdminContacts;
