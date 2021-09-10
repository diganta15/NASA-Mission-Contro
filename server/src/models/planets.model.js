const parse = require('csv-parse');
const fs = require('fs');

const planets = [];
const habitablePlanets = [];

function isHabitablePlanet(planet) {
    //Returns true if it is habitable and gets right amount of light and is of adequate size
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;

}

fs.createReadStream('../server/data/kepler_data.csv')//Source
    .pipe(parse({
        comment: '#',
        columns: true,
    })/*Destination*/) //Pipe - Connecting readable stream source data to writable destination data. Sends parsed data
    .on('data', (data) => {
        if (isHabitablePlanet(data)) { //Checks if the planet is habitable
            habitablePlanets.push(data); //Pushes data to results variable
        }
        planets.push(data);

    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name']
        }))
        console.log(`${habitablePlanets.length} habitable planets found`);
        console.log('Done');
    })


module.exports = planets;