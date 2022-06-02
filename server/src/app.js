const express = require('express');
const app = express();
const v1Router = require('./routes/v1');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined'));


app.use(express.static(path.join(__dirname,'..','public')));
app.use(express.json());

app.use('/v1',v1Router);

app.get('/*',(req,res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})

module.exports = app;