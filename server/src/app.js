const express = require('express');
const planetRouter = require('./routes/planets/planets.routes')
const launchRouter = require('./routes/launches/launches.routes')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const app = express();


app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(morgan('combined'))


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')))


app.use('/planets', planetRouter)
app.use('/launches', launchRouter)

// Serving Apps with client side routing it should be in the end
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})



module.exports = app