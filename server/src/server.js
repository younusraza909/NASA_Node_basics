
const http = require('http')
const app = require('./app')
require('dotenv').config()
const { mongoConnect } = require('./services/mongo')


const { loadPlanetData } = require('./models/planets.model')
const { loadLaunchData } = require('./models/launches.model')

const server = http.createServer(app)

//configuratipn for ssl & tls security 
// const server = https.createServer({
// cert:fs.readFileSync(cer.pem),
// key:fs.readFileSync(key.pem)
// },app)

const PORT = 8000;



async function startServer() {
    await mongoConnect()
    await loadPlanetData()
    await loadLaunchData()

    server.listen(PORT, () => {
        console.log(`Server Listening at Port:${PORT}`);
    })
}

startServer()


// Command to generate self signed certificate
// openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365

//4096 is amount of bit for stronger security
//-nodes so we can use this key without assignnig password as we are in development
//-keyout will put our key in a file called key.pem (common format for storing key)
//-out will give a certificate in cert.pem file
//-days 365 will give a expire date for certificate for a year default(30 days)
