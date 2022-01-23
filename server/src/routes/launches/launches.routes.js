const express = require('express')
const launchRouter = express.Router()

const {
    HttpGetAllLaunches
} = require('./launches.controller')

launchRouter.get('/launches', HttpGetAllLaunches)

module.exports = launchRouter