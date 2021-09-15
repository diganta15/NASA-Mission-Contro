const launches = new Map();

let latestFlightNumber = 100;	

const launch = {
	flightNumber: 100,
	mission: "Kepler Exploration Mission",
	rocket: "Explorer IS1",
	launchDate: new Date("December 27, 2030"),
	destination: "Kepler-442 b",
	customer: ["ZTM", "NASA"],
	upcoming: true,
	success: true,
};

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId){
	return launches.has(launchId);
}

function getAllLaunches(){
	// console.log(launches)
 return Array.from(launches.values());  
}

function addNewLaunch(launch){
	latestFlightNumber++;
	launches.set(latestFlightNumber, Object.assign(launch,{
		customers:['ZTM','NASA'],
		upcoming:true,
		success:true,
		flightNumber: latestFlightNumber,
	})
	)
}

function abortLaunchById(launchId){
	const aborted = launches.get(launchId);
	
	aborted.upcoming = false;
	aborted.success = false;
	return aborted;
}

module.exports = {
	existsLaunchWithId,
	getAllLaunches,
	addNewLaunch,
	abortLaunchById
}
