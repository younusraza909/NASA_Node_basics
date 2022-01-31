const Launches = require('./launches.mongo')
const Planets = require('./planets.mongo')


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


const existLaunchWithId = async (id) => {
    return await Launches.findOne({
        flightNumber: id
    })
}

const abortLaunchWithId = async (id) => {
    const aborted = await Launches.updateOne({
        flightNumber: id
    }, {
        success: true,
        upcoming: true
    })

    return aborted.ok === 1 && aborted.nModified === 1

}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchWithId
}