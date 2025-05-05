const express = require('express');
const app = express();

const getTravel = require('./routes/travel.routes.js');
const bookTravel = require('./routes/book.routes.js');
const connectDB = require('./connection/connection.js');

app.use(express.json());

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

