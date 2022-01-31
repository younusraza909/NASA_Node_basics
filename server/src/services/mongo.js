const mongoose = require('mongoose')


// Event For Mongoose Connection
mongoose.connection.once('open', () => {
    console.log("Connection Created Sucessfully!")
})

mongoose.connection.on('error', (err) => {
    console.log(err);
})

mongoose.connection.on('close', () => {
    console.log('Connection Disconnected Successfully!');
})


async function mongoConnect() {
    await mongoose.connect(process.env.MONGOOSE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = { mongoConnect, mongoDisconnect }