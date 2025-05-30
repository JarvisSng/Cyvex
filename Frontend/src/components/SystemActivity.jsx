import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
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
			plotOptions: {
				bar: {
					distribute: true,
					borderRadius: 8
				},
			},
			colors: ["#78f58d", "#041947"],
			backgroundColor: categories.length === 2 ? ["#78f58d", "#041947"] : ["#78f58d"],
			borderRadius: 8,
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
			let activityData = result.map(item => item.logins);
			let activityCategory = result.map(item => item.date);
			let activitynewData = [];
			const limit = val === "today" ? 1 : val === "week" ? 7 : val === "month" ? 30 : result.length;

			if (val === "today") {
				activityCategory = ["Currently Active", "Inactive"];
				activitynewData = [{ name: "System Activity", data: [result[result.length - limit]["currently active"], result[result.length - limit]["currently inactive"]] }];
				setCategories(activityCategory);
			} else {
				activitynewData = [{ name: "System Activity", data: result.map(item => item["logins"]).slice(result.length - limit, result.length) }];
				setCategories(activityCategory.slice(result.length - limit, result.length));
			}
			setData(activityData.slice(result.length - limit, result.length));
			setNewData(activitynewData);

		} catch (error) {
			console.error("error", error);
		}
	}
	useEffect(() => {
		getAllActivitys("today");
	}, [])

	const changeBarChart = (e) => {
		var datevalue = e.target.value;
		getAllActivitys(datevalue);
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
		<div className="overflow-hidden p-3 rounded-sm border-stroke bg-gray-2 shadow-default dark:border-strokedark dark:bg-boxdark">
			<div>
				<h3 className="text-xl font-semibold text-black dark:text-white">
					System Activity
				</h3>
				<div className="relative p-6 z-20 bg-white dark:bg-form-input">
					<span className="system-active-filter"><b>Filter By</b></span>
					<select
						className="system-active-select relative z-20 w-half appearance-none rounded border border-stroke rounded-md  bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
						onChange={changeBarChart}
					>
						<option value="today">Today</option>
						<option value="week">Last 7 Days</option>
						<option value="month">Last 30 Days</option>
					</select>
				</div>
			</div>
			<div className="mb-2">
				<div id="chartFive" ac-chart="'donut'" className="ml-1">
					<Chart
						options={chartData?.options}
						series={chartData?.options?.series}
						type="bar"
						height={350}
					/>
				</div>
			</div>
			<div>
			</div>

		</div>
	);
};

export default SystemActivity;
