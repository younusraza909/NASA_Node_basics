const express = require('express')
const planetRouter = express.Router()

const {
    HttpGetAllPlanets
} = require('./planets.controller')

planetRouter.get('/planets', HttpGetAllPlanets)

module.exports = planetRouter