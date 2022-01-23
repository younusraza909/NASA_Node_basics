const { getAllLaunches, addNewLanuch, existLaunchWithId, abortLaunchWithId } = require('../../models/launches.model')

function HttpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches())
}

function HttpAddNewLaunch(req, res) {
    launch = req.body
    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({
            error: "Missing required launch property"
        })
    }
    launch.launchDate = new Date(launch.launchDate)

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch Date "
        })
    }

    addNewLanuch(launch)
    return res.status(201).json(launch)
}

const HttpAbortLaunch = (req, res) => {
    let launch_id = Number(req.params.id)

    if (!existLaunchWithId(launch_id)) {
        return res.status(404).json({
            error: "launch not found with this ID"
        })
    }

    const aborted = abortLaunchWithId(launch_id)
    return res.status(200).json(aborted)
}


module.exports = {
    HttpGetAllLaunches,
    HttpAddNewLaunch,
    HttpAbortLaunch
}