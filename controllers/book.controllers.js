const Travel = require('../models/travel.model.js');
const bookings=[];
const bookTravel = async function (request, response) {
  // response.status(200).send("Book travel data!");
  const {username, email,travelId } = request.body;
  if (!username || !email || !travelId) {
    return response.status(400).send("Please provide username,email and travelid!");
  }
  const travel = await Travel.findById(travelId);
  if (!travel) {
    return response.status(404).send("Travel not found!");
  } 
  const booking = {
    username,
    email,
    travelId:  {
      id: travel._id,
      title: travel.title,
      description: travel.description,
    },
    bookingDate: new Date(),
  }
  bookings.push(booking);
  response.status(201).send(booking);
  console.log("Booking data created successfully!");
}
const getBookTravel = async function (request, response) {
  response.status(200).send(bookings);
}

module.exports = {
  bookTravel,
  getBookTravel,
};