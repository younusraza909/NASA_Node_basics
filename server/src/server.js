const http = require('http')
const app = require('./app')

const { loadPlanetData } = require('./models/planets.model')

const server = http.createServer(app)

const PORT = 8000;

async function startServer() {
    await loadPlanetData()
    server.listen(PORT, () => {
        console.log(`Server Listening at Port:${PORT}`);
    })
}

startServer()
