const Launches = require('./launches.mongo')
const Planets = require('./planets.mongo')
const axios = require('axios')

const DEFAULT_FLIGHT_NUMBER = 100




const saveLaunch = async (launch) => {
    await Launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}




const getLatestFlightNumber = async () => {
    let latestLaunch = await Launches.findOne().sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber;
}

const getAllLaunches = async (limit, skip) => {
    return await Launches
        .find({}, {
            "_id": 0, "__v": 0
        })
        .sort({ flightNumber: 1 })
        .limit(limit)
        .skip(skip)
}

const scheduleNewLaunch = async (launch) => {
    let planet = await Planets.findOne({
        kepler_name: launch.target
    })

    if (!planet) {
        throw new Error('No matching planet found')
    }
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

    if (response.status !== 200) {
        console.log("Problem Downloading Launch Data!")
        throw new Error("Data Download failed!")
    }

    const launchDocs = response.data.docs

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        //flattening array into one array
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
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

        saveLaunch(launch)
    }
}

async function loadLaunchData() {
    const firstLaucnh = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat"
    })

    if (firstLaucnh) {
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