const Launches = require('./launches.mongo')
const Planets = require('./planets.mongo')
const axios = require('axios')

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', "NASA"],
    upcoming: true,
    success: true
}


const saveLaunch = async (launch) => {
    let planet = await Planets.findOne({
        kepler_name: launch.target
    })

    if (!planet) {
        throw new Error('No matching planet found')
    }

    await Launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}


saveLaunch(launch)

const getLatestFlightNumber = async () => {
    let latestLaunch = await Launches.findOne().sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber;
}

const getAllLaunches = async () => {
    return await Launches.find({}, {
        "_id": 0, "__v": 0
    })
}

const scheduleNewLaunch = async (launch) => {
    let newLatestFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ["Zero To Mastery", "NASA"],
        flightNumber: newLatestFlightNumber
    })

    await saveLaunch(newLaunch)

}




const abortLaunchWithId = async (id) => {
    const aborted = await Launches.updateOne({
        flightNumber: id
    }, {
        success: false,
        upcoming: false
    })

    console.log(id);
    console.log(aborted);
    return aborted.acknowledged === true && aborted.modifiedCount === 1

}


async function findLaunch(filter) {
    return await Launches.findOne(filter)
}

const existLaunchWithId = async (id) => {
    return await findLaunch({
        flightNumber: id
    })
}

let SPACE_X_URL = 'https://api.spacexdata.com/v4/launches/query'


async function populateLaunches() {
    const response = await axios.post(SPACE_X_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        },

    })

    const launchDocs = response.data.docs

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        //flattening array into one array
        const customers = payloads.flatMap((payload) => {
            return payload['customers ']
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }

        console.log(`${launch.flightNumber} ${launch.mission}`);
    }
}

async function loadLaunchData() {
    const firstLaucnh = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat"
    })

    if (findLaunch) {
        console.log('Launch Data is already loaded!');
        return;
    } else {
        populateLaunches()
    }

}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchWithId
}