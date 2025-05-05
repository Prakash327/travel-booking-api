require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Verify required environment variables are set
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const getTravel = require('./routes/travel.routes.js');
const bookTravel = require('./routes/book.routes.js');
const connectDB = require('./connection/connection.js');

// Middleware
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/travel', getTravel);
app.use('/booking', bookTravel);
 

//port
const PORT = 9000;
const start = async()=>{
  console.log('Starting application...');
  try {
      await connectDB("mongodb+srv://Prakash:12345@cluster0.n9u5id0.mongodb.net/travel-api\?retryWrites=true&w=majority&appName=Cluster0")
      app.listen(PORT,
       console.log(`The server is listening at ${PORT}....`))
  } catch (error) {
      console.log(error)
      process.exit(1); // Exit to make failure visible
  }
}
start();

