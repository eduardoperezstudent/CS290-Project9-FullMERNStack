const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const { router } = require('./exercises_controller.mjs'); // still okay since mjs


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/exercises', router);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING);
    console.log('✅ Connected to MongoDB');
    app.listen(port, () => {
      console.log(`✅ REST API listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

startServer();
