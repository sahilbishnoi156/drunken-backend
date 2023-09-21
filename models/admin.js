const mongoose = require('mongoose');
const {Schema} = mongoose;

const adminSchema = new Schema({
    username:{
        type:String,
        unique:true,
    },
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
    },
    editedAt:{
        type: String
    }
});

module.exports = mongoose.model('Admin', adminSchema);