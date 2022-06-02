const {getLaunches, addNewLaunch, checkLaunchID, abortLaunchID} = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetLaunches (req,res) {
    const { skip , limit } = getPagination(req.query);
    return res.status(200).json(await getLaunches(skip, limit));
};

async function httpAddLaunch (req,res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.destination || !launch.launchDate) {
        return res.status(400).json({error : 'Missing property'});
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({error : 'Invalid Date'});
    }

    await addNewLaunch(launch);
    return res.status(201).json(launch);
};


async function httpAbortLaunch (req,res) {
    const launchID = Number(req.params.id);
    const checkLaunchExists = await checkLaunchID(launchID);
    if (!checkLaunchExists) {
         return res.status(404).json({error : 'Launch Not Existing'});
    }

    else {
        const aborted = await abortLaunchID(launchID);
        return !aborted ? res.status(400).json({
            error : 'Launch not aborted'
        }) : res.status(200).json({ok : true});
    }
}

module.exports = {
    httpGetLaunches, httpAddLaunch, httpAbortLaunch
}