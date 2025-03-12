import React, { useEffect, useState } from "react";
import { fetchAdminProfiles } from "../controller/userController";
import deleteimg from "../images/delete.png";
import save from "../images/save.jpg";
import search from "../images/search.jpg";

const ViewReports = () => {
	const [profiles, setProfiles] = useState([]);
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState([]);
	const [data, setData] = useState([]);

	// Fetch profiles with related subscription data on mount
	useEffect(() => {
		const getProfiles = async () => {
			var username = localStorage.getItem("username");
			const result = await fetchAdminProfiles(username);
			if (result.error) {
				setError(result.error);
			} else {
				setProfiles(result.data);
				console.log(" profiles == " + profiles);
			}
		};
		getProfiles();
	}, []);

	return (
		<div className="overflow-hidden rounded-sm border-stroke bg-gray-2 shadow-default dark:border-strokedark dark:bg-boxdark">
			<div className="rounded-sm bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<h3 className="text-xl font-semibold text-black dark:text-white mb-4">
					Reports
				</h3>
				<div className="relative mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
					<div className="flex mb-4">
						<div className="w-14 flex-none">
							<a href="#">
								<img src={search} alt="Search" />
							</a>
						</div>
						<div className="w-64 flex-2">
							<p>AID-20240204-239</p>
						</div>
						<div className="w-14 flex-none">
							<a href="#">
								<img
									src={save}
									alt="Save"
									className="float-end"
								/>
							</a>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div>Date: 02/04/2025</div>
						<div>Functions Detected: 3</div>
						<div>Time: 19:15</div>
						<div>Processing Time: 5.2s</div>
						<div>user: user 1</div>
						<div>Risk Level: Medium</div>
						<div>File: block_code.py</div>
						<div>
							<a href="#">
								<img
									src={deleteimg}
									alt="delete"
									className="float-end"
								/>
							</a>
						</div>
					</div>
				</div>

				<div className="relative mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
					<div className="flex mb-4">
						<div className="w-14 flex-none">
							<a href="#">
								<img src={search} alt="Search" />
							</a>
						</div>
						<div className="w-64 flex-2">
							<p>AID-20240204-239</p>
						</div>
						<div className="w-14 flex-none">
							<a href="#">
								<img
									src={save}
									alt="Save"
									className="float-end"
								/>
							</a>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div>Date: 02/04/2025</div>
						<div>Functions Detected: 3</div>
						<div>Time: 19:15</div>
						<div>Processing Time: 5.2s</div>
						<div>user: user 1</div>
						<div>Risk Level: Medium</div>
						<div>File: block_code.py</div>
						<div>
							<img
								src={deleteimg}
								alt="delete"
								className="float-end"
							/>
						</div>
					</div>
				</div>

				<div className="relative mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
					<div className="flex mb-4">
						<div className="w-14 flex-none">
							<a href="#">
								<img src={search} alt="Search" />
							</a>
						</div>
						<div className="w-64 flex-2">
							<p>AID-20240204-239</p>
						</div>
						<div className="w-14 flex-none">
							<a href="#">
								<img
									src={save}
									alt="Save"
									className="float-end"
								/>
							</a>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div>Date: 02/04/2025</div>
						<div>Functions Detected: 3</div>
						<div>Time: 19:15</div>
						<div>Processing Time: 5.2s</div>
						<div>user: user 1</div>
						<div>Risk Level: Medium</div>
						<div>File: block_code.py</div>
						<div>
							<img
								src={deleteimg}
								alt="delete"
								className="float-end"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewReports;
