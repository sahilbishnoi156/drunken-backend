const connectToMongo = require("./db"); // initializing db file
const express = require('express')  // Initializing
require('dotenv').config();

connectToMongo(); //! Running db server

const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

// Available Routes
app.use('/api/auth',require("./routes/auth"));
app.use('/api/trips',require("./routes/trips"));

app.listen(port, () => {
  console.log(`Drunk'nRoad App now live on port ${port}`)
})
