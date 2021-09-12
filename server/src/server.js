const http = require('http');


const app = require('./app');
const {loadsPlanetsData} = require('./models/planets.model') 

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// const planetsMo

async function startServer(){
    await loadsPlanetsData();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    });
}

startServer();







