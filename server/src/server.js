const http = require('http');
const mongoose = require('mongoose');
const {loadLaunchesData} = require('./models/launches.model');

const app = require('./app');
const {loadsPlanetsData} = require('./models/planets.model') 
const {mongoConnect} = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// const planetsMo


async function startServer(){
    await mongoConnect()
    
    await loadsPlanetsData();
    await loadLaunchesData();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    });
}

startServer();







