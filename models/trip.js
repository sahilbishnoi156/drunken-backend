const mongoose = require('mongoose');
const {Schema} = mongoose;

const Trip = new Schema({
    title:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    aboutTour:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        default:Date.now
    },
    startsAt:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    images:{
        type:Array,
        default:[]
    },
    category:{
        type:String,
        required:true
    },
    inclusions:{
        type:String
    },
    itinerary:{
        type:String,
        default:null
    },
    exclusions:{
        type:String 
    },
    roadmap:{
        type:Array,
        default:[]
    }
});

module.exports = mongoose.model('Trip', Trip);