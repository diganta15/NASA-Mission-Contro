const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://diganta15:Diganta15@nasacluster-shard-00-00.uvbcr.mongodb.net:27017,nasacluster-shard-00-01.uvbcr.mongodb.net:27017,nasacluster-shard-00-02.uvbcr.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-97ab5m-shard-0&authSource=admin&retryWrites=true&w=majority';

async function mongoConnect(){
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        }).then(() => console.log('MongDB connected'));
    } catch (err) {
        console.error(err.message);
        process.exit(1)
    }
}

async function mongoDisconnect(){
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}