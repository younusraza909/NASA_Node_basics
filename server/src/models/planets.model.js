const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path')

const Planets = require('./planets.mongo')



function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "..", "data", 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    savePlanet(data)
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err)
            })
            .on('end', async () => {
                let planets = await getAllPlanets()
                console.log(planets.map((planet) => {
                    return planet['kepler_name'];
                }));
                resolve()
            });

    })
}


const getAllPlanets = async () => {
    return await Planets.find({}, {
        "_id": 0, "__v": 0
    })
}

async function savePlanet(planet) {
    try {
        // Upsert(Update + Insert) Operation so to prevent copying data
        await Planets.updateOne({
            kepler_name: planet.kepler_name
        }, {
            kepler_name: planet.kepler_name
        }, {
            upsert: true
        })
    } catch (error) {
        console.error(`Could not save planet ${error}`)
    }

}

module.exports = {
    loadPlanetData,
    getAllPlanets
}