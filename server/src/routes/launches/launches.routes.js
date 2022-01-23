const express = require('express')
const launchRouter = express.Router()

const {
    HttpGetAllLaunches,
    HttpAddNewLaunch,
    HttpAbortLaunch
} = require('./launches.controller')

launchRouter.get('/', HttpGetAllLaunches)
launchRouter.post('/', HttpAddNewLaunch)
launchRouter.delete('/:id', HttpAbortLaunch)

module.exports = launchRouter