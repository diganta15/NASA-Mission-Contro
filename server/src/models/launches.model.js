const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const DEFAULT_FLIGHT_NO = 100;
const SPACE_X_API_URL = "https://api.spacexdata.com/v4/launches/query	 ";
// const launchData = {
// flightNumber: 101,  flight_number
// mission: "Kepler Exploration Mission", name
// rocket: "Explorer IS1",			rocket.name
// launchDate: new Date("December 27, 2030"),	date.local
// destination: "Kepler-442 b",		not applicable
// customers: ["ZTM", "NASA"],		payload.customers
// upcoming: true,		upcoming
// success: true,		success
// };

// saveLaunch(launchData);

async function existsLaunchWithId(launchId) {
	return await findLaunch({
		flightNumber: launchId,
	});
}

async function getLatestFlightNumber() {
	const latestLaunch = await launches.findOne().sort("-flightNumber");

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NO;
	}

	return latestLaunch.flightNumber + 1;
}

async function getAllLaunches(skip,limit) {
	return await launches.find({}, { _id: 0, __v: 0 }).sort({flightNumber:1}).skip(skip).limit(limit);
}

async function saveLaunch(launch) {
	await launches.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{ upsert: true }
	);
}

async function findLaunch(filter) {
	return await launches.findOne(filter);
}

async function populateLaunches() {
	const response = await axios.post(SPACE_X_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: "rocket",
					select: {
						name: 1,
					},
				},
				{
					path: "payloads",
					select: {
						customers: 1,
					},
				},
			],
		},
	});
	if(response.status !==200){
		console.log('Problem downloading launch data');
		throw new Error('Launch data download failed');
	}
	const launchDocs = response.data.docs;
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc["payloads"];
		const customers = payloads.flatMap((payload) => {
			return payload["customers"];
		});

		const launch = {
			flightNumber: launchDoc["flight_number"],
			mission: launchDoc["name"],
			rocket: launchDoc["rocket"]["name"],
			launchDate: launchDoc["date_local"],
			upcoming: launchDoc["upcoming"],
			success: launchDoc["success"],
			customers: customers,
		};
		console.log(launch.flightNumber, launch.mission);

		await saveLaunch(launch);
	}
}

async function loadLaunchesData() {
	console.log("");
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: "Falcon 1",
		mission: "FalconSat",
	});

	if (firstLaunch) {
		console.log("Launch data already loaded");
		return;
	} else {
		populateLaunches();
	}
	//TODO: Populate database
}

async function addNewLaunch(launch) {

	const planet = await planets.findOne({
		kepler_name: launch.destination,
	});

	if (!planet) {
		throw new Error("No matching planet was found");
	}

	const flightNumber = await getLatestFlightNumber();
	const launchobj = {
		flightNumber: flightNumber,
		...launch,
		customers: ["ZTM", "NASA"],
		upcoming: true,
		success: true,
	};


	await saveLaunch(launchobj);

	return launchobj;
}

// function scheduleNewLaunch(){}

async function abortLaunchById(launchId) {
	const aborted = await launches.updateOne(
		{
			flightNumber: launchId,
		},
		{
			upcoming: false,
			success: false,
		}
	);
	return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
	existsLaunchWithId,
	getAllLaunches,
	addNewLaunch,
	abortLaunchById,
	loadLaunchesData,
};
