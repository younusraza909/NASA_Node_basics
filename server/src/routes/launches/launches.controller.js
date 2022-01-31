const { getAllLaunches, scheduleNewLaunch, existLaunchWithId, abortLaunchWithId } = require('../../models/launches.model')

async function HttpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches())
}

async function HttpAddNewLaunch(req, res) {
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

    await scheduleNewLaunch(launch)
    return res.status(201).json(launch)
}

const HttpAbortLaunch = async (req, res) => {
    let launch_id = Number(req.params.id)

    const existLaunch = await existLaunchWithId(launch_id)

    if (!existLaunch) {
        return res.status(404).json({
            error: "launch not found with this ID"
        })
    }

    console.log(existLaunch);

    const aborted = await abortLaunchWithId(launch_id)

    console.log(aborted);

    if (!aborted) {
        return res.status(400).json({
            error: "Launch not aborted"
        })
    } else {

        return res.status(200).json({
            ok: true
        })
    }
}


module.exports = {
    HttpGetAllLaunches,
    HttpAddNewLaunch,
    HttpAbortLaunch
}