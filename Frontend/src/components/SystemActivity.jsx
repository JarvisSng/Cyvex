import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import { fetchAdminProfiles } from "../controller/userController";
import { getAllActivity } from "../controller/activityController";

const SystemActivity = () => {
	const [profiles, setProfiles] = useState([]);
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState([]);
	const [data, setData] = useState([]);
	const [newData, setNewData] = useState([]);
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
			// setCategories([
			// 	"16-03-2025",
			// 	"17-03-2025",
			// 	"18-03-2025",
			// 	"19-03-2025",
			// 	"20-03-2025",
			// 	"21-03-2025",
			// 	"22-03-2025",
			// ]);

			// setData([168, 385, 201, 298, 187, 195, 291]);
		};
		getProfiles();
	}, []);

	const chartData = {
		options: {
			series: newData,
			chart: {
				type: 'bar',
				height: 300,
				stacked: true,
				toolbar: {
					show: false
				},
				zoom: {
					enabled: true
				}
			},
			colors: ['#3437eb', '#3437eb'],
			responsive: [{
				breakpoint: 480,
				options: {
					legend: {
						position: 'bottom',
						offsetX: -10,
						offsetY: 0
					}
				}
			}],
			xaxis: {
				categories: categories,
			},
			legend: {
				position: 'top', // top, bottom
				horizontalAlign: 'right', // left, right
			},
			dataLabels: {
				enabled: false,
			},
			fill: {
				opacity: 1
			}
		}
	}

	const getAllActivitys = async (val) => {

		try {
			const result = await getAllActivity({});
			console.log("datass", result);
			let activityData = result.map(item => item.logins);
			let activityCategory = result.map(item => item.date);
			let activitynewData = [];
			const limit = val === "today" ? 1 : val === "week" ? 7 : val === "month" ? 30 : result.length;

			if (val === "today") {
				activitynewData = [
					{ name: "Activity", data: result.map(item => item["currently active"]).slice(0, limit) },
					{ name: "In Active", data: result.map(item => item["currently inactive"]).slice(0, limit) }
				];
			} else {
				activitynewData = [{ name: "System Activity", data: activityData }];
			}
			console.log("activitynewData", activitynewData);
			setCategories(activityCategory.slice(0, limit));
			setData(activityData.slice(0, limit));
			setNewData(activitynewData);


		} catch (error) {
			console.error("error", error);
		}
	}
	useEffect(() => {
		getAllActivitys("week");
	}, [])

	const changeBarChart = (e) => {
		var datevalue = e.target.value;
		getAllActivitys(datevalue);
		// if (datevalue == 1) {
		// 	setCategories([
		// 		"16-03-2025",
		// 		"17-03-2025",
		// 		"18-03-2025",
		// 		"19-03-2025",
		// 		"20-03-2025",
		// 		"21-03-2025",
		// 		"22-03-2025",
		// 	]);

		// 	setData([4, 385, 201, 6, 187, 195, 291]);
		// } else if (datevalue == 2) {
		// 	setCategories([
		// 		"01-03-2025",
		// 		"02-03-2025",
		// 		"03-03-2025",
		// 		"04-03-2025",
		// 		"05-03-2025",
		// 		"06-03-2025",
		// 		"07-03-2025",
		// 		"08-03-2025",
		// 		"09-03-2025",
		// 		"10-03-2025",
		// 		"11-03-2025",
		// 		"12-03-2025",
		// 		"13-03-2025",
		// 		"14-03-2025",
		// 		"15-03-2025",
		// 		"16-03-2025",
		// 		"17-03-2025",
		// 		"18-03-2025",
		// 		"19-03-2025",
		// 		"20-03-2025",
		// 		"21-03-2025",
		// 		"22-03-2025",
		// 		// "23-03-2025",
		// 		// "24-03-2025",
		// 		// "25-03-2025",
		// 		// "26-03-2025",
		// 		// "27-03-2025",
		// 		// "28-03-2025",
		// 		// "29-03-2025",
		// 		// "30-03-2025",
		// 		// "31-03-2025",
		// 	]);

		// 	setData([
		// 		168, 385, 201, 298, 7, 195, 9, 168, 385, 201, 298, 7, 195, 9,
		// 		168, 385, 201, 298, 7, 195, 9, 168,
		// 	]);
		// } else if (datevalue == 3) {
		// 	setCategories([
		// 		"January",
		// 		"February",
		// 		"March",
		// 		"April",
		// 		"May",
		// 		"June",
		// 		"July",
		// 		"August",
		// 		"September",
		// 		"October",
		// 		"November",
		// 		"December",
		// 	]);

		// 	setData([168, 2, 201, 5, 187, 195, 291, 168, 2, 201, 5, 187]);
		// }
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
						<option value="today">Today</option>
						<option value="week">This Week</option>
						<option value="month">Last 30 Days</option>
						{/* <option value="3">This Year</option> */}
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
			<div className="mb-2">
				<div id="chartFive" ac-chart="'donut'" className="-ml-5">
					<Chart
						options={chartData?.options}
						series={chartData?.options?.series}
						type="bar"
						height={350}
					/>
				</div>
			</div>
		</div>
	);
};

export default SystemActivity;
