const express = require('express')
const launchRouter = express.Router()

const {
    HttpGetAllLaunches,
    HttpAddNewLaunch
} = require('./launches.controller')

launchRouter.get('/', HttpGetAllLaunches)
launchRouter.post('/', HttpAddNewLaunch)

module.exports = launchRouter