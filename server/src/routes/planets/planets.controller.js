const {getAllPlanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
	
	await res.status(200).json(await getAllPlanets());
}

module.exports = {
	httpGetAllPlanets,
};
