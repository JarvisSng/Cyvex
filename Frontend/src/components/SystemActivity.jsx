import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchAdminProfiles } from "../controller/userController";

const SystemActivity = () => {
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
			setCategories([
				"16-03-2025",
				"17-03-2025",
				"18-03-2025",
				"19-03-2025",
				"20-03-2025",
				"21-03-2025",
				"22-03-2025",
			]);

			setData([168, 385, 201, 298, 187, 195, 291]);
		};
		getProfiles();
	}, []);

	const changeBarChart = (e) => {
		var datevalue = e.target.value;
		if (datevalue == 1) {
			setCategories([
				"16-03-2025",
				"17-03-2025",
				"18-03-2025",
				"19-03-2025",
				"20-03-2025",
				"21-03-2025",
				"22-03-2025",
			]);

			setData([4, 385, 201, 6, 187, 195, 291]);
		} else if (datevalue == 2) {
			setCategories([
				"01-03-2025",
				"02-03-2025",
				"03-03-2025",
				"04-03-2025",
				"05-03-2025",
				"06-03-2025",
				"07-03-2025",
				"08-03-2025",
				"09-03-2025",
				"10-03-2025",
				"11-03-2025",
				"12-03-2025",
				"13-03-2025",
				"14-03-2025",
				"15-03-2025",
				"16-03-2025",
				"17-03-2025",
				"18-03-2025",
				"19-03-2025",
				"20-03-2025",
				"21-03-2025",
				"22-03-2025",
				// "23-03-2025",
				// "24-03-2025",
				// "25-03-2025",
				// "26-03-2025",
				// "27-03-2025",
				// "28-03-2025",
				// "29-03-2025",
				// "30-03-2025",
				// "31-03-2025",
			]);

			setData([
				168, 385, 201, 298, 7, 195, 9, 168, 385, 201, 298, 7, 195, 9,
				168, 385, 201, 298, 7, 195, 9, 168,
			]);
		} else if (datevalue == 3) {
			setCategories([
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			]);

			setData([168, 2, 201, 5, 187, 195, 291, 168, 2, 201, 5, 187]);
		}
	};

	const [state, setState] = useState({
		series: [
			{
				name: "series-1",
				data: data,
			},
		],
	});

	const options = {
		colors: ["#3C50E0"],
		chart: {
			fontFamily: "Satoshi, sans-serif",
			type: "bar",
			height: 350,
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "55%",
				// endingShape: "rounded",
				borderRadius: 2,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 4,
			colors: ["transparent"],
		},
		xaxis: {
			categories: categories,
			// labels: {
			//   formatter: function (val) {
			//     return val + "K"
			//   }
			// },
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		legend: {
			show: true,
			position: "top",
			horizontalAlign: "left",
			fontFamily: "inter",

			markers: {
				radius: 99,
			},
		},
		yaxis: {
			title: true,
		},
		grid: {
			yaxis: {
				lines: {
					show: false,
				},
			},
		},
		fill: {
			opacity: 1,
		},

		tooltip: {
			x: {
				show: false,
			},
			y: {
				formatter: function (val) {
					return val;
				},
			},
		},
	};

	return (
		<div className="overflow-hidden rounded-sm border-stroke bg-gray-2 shadow-default dark:border-strokedark dark:bg-boxdark">
			<div>
				<h3 className="text-xl font-semibold text-black dark:text-white">
					System Activity
				</h3>
				<div className="relative p-6 z-20 bg-white dark:bg-form-input">
					<select
						className="relative z-20 w-half appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
						onChange={changeBarChart}
					>
						<option value="1">This Week</option>
						<option value="2">This Month</option>
						<option value="3">This Year</option>
					</select>
				</div>
			</div>

			<div className="mb-2">
				<div id="chartFour" className="-ml-5">
					<ReactApexChart
						options={options}
						series={[
							{
								name: "System Activity",
								data: data,
							},
						]}
						type="bar"
						height={350}
					/>
				</div>
			</div>
		</div>
	);
};

export default SystemActivity;
