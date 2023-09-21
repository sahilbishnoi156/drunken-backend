const mongoose = require("mongoose"); //~ Initializing mongoose
require('dotenv').config();
const mongoURI = process.env.DATABASE //~ Can't use localhost (use 127.0.0.1) because node js supports ipv6 address


let isConnected = false; // track the connection

const connectToMongo= async()=>{
    mongoose.set('strictQuery', true);
    if(isConnected) {
        console.log('MongoDB is already connected');
        return;
      }
    try {
        await mongoose.connect(mongoURI, {
          dbName: "DrunkRoad",
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
    
        isConnected = true;
    
        console.log('MongoDB connected')
      } catch (error) {
        console.log(error);
      }
}
module.exports = connectToMongo;
