const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const defaultFlightID = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
}

async function checkFirstLaunch() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    return !firstLaunch ? false : true;
}

async function checkPlanet(destination) {
    const planet = await planets.findOne({
        keplerName: destination
    });

    return planet;
}

async function saveLaunch(launch) {

    await launchesDB.findOneAndUpdate({
        flightID: launch.flightID,
    }, launch, {
        upsert: true
    });
}

async function getLaunchesData() {
    console.log('Launches Downloading');
    if (await checkFirstLaunch()) {
        console.log('Launches downloaded already');
    }

    else {
        const response = await axios.post(SPACEX_API_URL, {
            "query": {},
            "options": {
                "pagination": false,
                "populate": [
                    {
                        "path": "rocket",
                        "select": {
                            "name": 1
                        }
                    },
                    {
                        "path": "payloads",
                        "select": {
                            "customers": 1
                        }
                    }
                ]
            }
        });

        if (response.status != 200) {
            console.log('Problem downloading launches');
            throw new Error('Launch data download failed');
        }

        const launchDocs = response.data.docs;
        for (const launchDoc of launchDocs) {
            const payloads = launchDoc.payloads;
            const customer = payloads.flatMap((payload) =>
                payload.customers
            );

            const launch = {
                flightID: launchDoc.flight_number,
                mission: launchDoc.name,
                rocket: launchDoc.rocket.name,
                launchDate: launchDoc.date_local,
                upcoming: launchDoc.upcoming,
                success: launchDoc.success,
                customer
            }

            console.log(`${launch.flightID} ${launch.mission} ${launch.customer}`);

            await saveLaunch(launch);
        }
    }
}

async function getLaunches(skip, limit) {
    console.log('Get Launch Route Commencing...');
    return await launchesDB
        .find({}, '-_id -__v')
        .sort('flightID')
        .skip(skip)
        .limit(limit);
}

async function getLatestFlightID() {
    const latestFlightID = await launchesDB.findOne()
        .sort('-flightID');

    if (!latestFlightID) {
        return defaultFlightID;
    }

    return latestFlightID.flightID;
}

async function addNewLaunch(launch) {
    const newFlightID = await getLatestFlightID() + 1;
    const newLaunch = Object.assign(launch, {
        flightID: newFlightID,
        success: true,
        upcoming: true,
        customer: ['Axie', 'Pegaxy']
    });
    const destinationPlanet = await checkPlanet(launch.destination);
    // const destinationName = destinationPlanet.keplerName;
    console.log(destinationPlanet);
    console.log('Post Launch Route Commencing...')
    if (!destinationPlanet) {
        throw new Error('No matching planet found');
    }
    else {
        await saveLaunch(newLaunch);
    }
}

async function checkLaunchID(launchID) {
    return await findLaunch({
        flightID: launchID
    });
}


async function abortLaunchID(launchID) {
    const aborted = await launchesDB.updateOne({
        flightID: launchID
    }, {
        upcoming: false,
        success: false
    });

    return aborted.modifiedCount === 1;
}

module.exports = { getLaunches, addNewLaunch, checkLaunchID, abortLaunchID, getLaunchesData };