const mongoose = require('mongoose');
const launchesSchema = new mongoose.Schema({
    flightID : { 
        type : Number,
        required : true
    },
    launchDate : { 
        type : Date,
        required : true
    },
    mission : { 
        type : String,
        required : true
    },
    rocket : { 
        type : String,
        required : true
    },
    destination : {
        type : String,
    },
    customer : [ String ],
    upcoming : {
        type : Boolean,
        required : true
    },
    success : {
        type : Boolean,
        required : true,
        default : true
    }
});

module.exports = mongoose.model('Launches',launchesSchema);