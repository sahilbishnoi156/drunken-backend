const mongoose = require('mongoose');
const {Schema} = mongoose;

const Trip = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
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
    endAt:{
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
    }
});

module.exports = mongoose.model('Trip', Trip);