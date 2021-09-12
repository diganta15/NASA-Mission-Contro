const parse = require('csv-parse');
const fs = require('fs');
const { resolve, dirname } = require('path');
const path = require('path')

const planets = [];
// const habitablePlanets = [];

function isHabitablePlanet(planet) {
    //Returns true if it is habitable and gets right amount of light and is of adequate size
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;

}

/*
const promise = new Promise((resolve,reject)=>{
    resolve();
});
promise.then(result =>{

})

Alternatively
const result = await promise();
*/

function loadsPlanetsData(){

    return new Promise((resolve,reject)=>{
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))//Source
            .pipe(parse({
                comment: '#',
                columns: true,
            })/*Destination*/) //Pipe - Connecting readable stream source data to writable destination data. Sends parsed data
            .on('data', (data) => {
                if (isHabitablePlanet(data)) { //Checks if the planet is habitable
                    planets.push(data); //Pushes data to results variable
                }
                

            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                console.log('Done');
                resolve();
            })
    })


    
}

function getAllPlanets(){
    return planets;
}

module.exports = {
    loadsPlanetsData,
    getAllPlanets,
};