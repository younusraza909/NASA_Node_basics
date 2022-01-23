const launches = new Map()

let latestFlightNumber = 100

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

launches.set(launch.flightNumber, launch);

const getAllLaunches = () => {
    return Array.from(launches.values())
}

const addNewLanuch = (launch) => {
    latestFlightNumber++
    launches.set(latestFlightNumber, Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customer: ["Zero To Mastery", "NASA"],
        upcoming: true,
        success: true
    }))
}

const existLaunchWithId = (id) => {
    return launches.has(id)
}

const abortLaunchWithId = (id) => {
    let aborted = launches.get(id)
    aborted.success = false
    aborted.upcoming = false
    return aborted
}

module.exports = {
    getAllLaunches,
    addNewLanuch,
    existLaunchWithId,
    abortLaunchWithId
}