const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");

const { planetsRouter} = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.routes');
const api = require('./routes/api');

const app = express();


// app.get('/',(req,res)=>{
//     res.send('Working')
// })

app.use(cors({
    origin:'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use(express.json());
app.use('/v1',api)

// if (process.env.NODE_ENV === "production") {
    //Set static folder
    app.use(express.static("../client/build"));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname,"..","..", "client", "build", "index.html"));
    });

// }


module.exports = app;   
   
