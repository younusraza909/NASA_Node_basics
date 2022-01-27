const http = require('http')
const app = require('./app')
require('dotenv').config()
const mongoose = require('mongoose')


const { loadPlanetData } = require('./models/planets.model')

const server = http.createServer(app)

const PORT = 8000;

// Event For Mongoose Connection
mongoose.connection.once('open', () => {
    console.log("Connection Created Sucessfully!")
})

mongoose.connection.on('error', (err) => {
    console.log(err);
})


async function startServer() {
    await mongoose.connect(process.env.MONGOOSE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    await loadPlanetData()
    server.listen(PORT, () => {
        console.log(`Server Listening at Port:${PORT}`);
    })
}

startServer()
