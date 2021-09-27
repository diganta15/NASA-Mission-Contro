const parse = require('csv-parse');
const fs = require('fs');
const { resolve, dirname } = require('path');
const path = require('path')

const planets = require('./planets.mongo');
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
            .on('data', async(data) => {
                if (isHabitablePlanet(data)) { //Checks if the planet is habitable
                  savePlanet(data) //Pushes data to results variable
                }
                

            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async() => {
                const planetsFound = (await getAllPlanets()).length;
                console.log(`${planetsFound} habitable planets found`);
                resolve();
            })
    })


    
}

async function getAllPlanets(){
  return await planets.find({},{
      '_id':0,'__v':0
  });
}

async function savePlanet(data){
   try{
       await planets.updateOne({
           kepler_name: data.kepler_name
       }, {
           kepler_name: data.kepler_name,
       }, {
           upsert: true
       });
   }
   catch(err){
       console.log(`Could not save planet${err}`)
   }
}

module.exports = {
    loadsPlanetsData,
    getAllPlanets,
};