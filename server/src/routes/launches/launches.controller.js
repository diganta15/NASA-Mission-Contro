const {getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model');
const {getPagination} = require('../../services/query')

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const response = await getAllLaunches(skip, limit)
    return res.status(200).json(response);
}

async function httpAddNewLaunch(req,res){

    const launch = req.body;

    if(!launch.mission || !launch.launchDate || !launch.rocket ||!launch.destination){
        return res.status(400).json({
            error:"Invalid Data"
        })
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)){
        return res.status(400).json({
            error:"Invalid Launch date"
        })
    }
    const response = await addNewLaunch(launch);

    return res.status(201).json(response);
}

async function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId);
    if(!existsLaunch){
        return res.status(404).json({
            error:'Launch Not Found'
        })
    }

    const aborted = abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({error:"Launch not aborted"})
    }
    return res.status(200).json({
        ok:true
    })


}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}