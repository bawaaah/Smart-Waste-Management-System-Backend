// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const wasteRoutes = require('./routes/waste');
const deviceRoutes = require('./routes/device');
const malfunctionReport = require('./routes/malfunctionReport');
const authRoutes = require("./routes/auth");
const reportRoutes = require('./routes/report');


const cors = require("cors");
const bodyParser = require("body-parser");


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/waste', wasteRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/malfunctionReport', malfunctionReport);
app.use("/api/auth", authRoutes);
app.use('/api/report', reportRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
