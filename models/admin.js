const mongoose = require('mongoose');
const {Schema} = mongoose;

const adminSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        default:Date.now
    }
});

module.exports = mongoose.model('Admin', adminSchema);