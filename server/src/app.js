const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { planetsRouter} = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.routes');

const app = express();


app.get('/',(req,res)=>{
    res.send('Working')
})

app.use(cors({
    origin:'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use(express.json());
app.use('/planets',planetsRouter);
app.use('/launches',launchesRouter)

module.exports = app;   
   
