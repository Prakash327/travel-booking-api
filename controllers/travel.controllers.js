const mongoose = require("mongoose");
const fs = require("fs");
const Travel = require("../models/travel.model.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

const getTravel = async function (request, response) {
  try {
    const { id } = request.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ error: "Invalid travel ID" });
    }
    const travel = await Travel.findById(id);

    // Check if the travel document exists
    if (!travel) {
      return response.status(404).json({ error: "Travel not found" });
    }

    // Send the travel data as a response
    response.status(200).json(travel);
    console.log("Travel data retrieved successfully!");
  } catch (error) {
    console.log(error);
    response.status(500).send("Error retrieving travel data!");
  }
};
const getAllTravel = async function (request, response) {
  try {
    const travel = await Travel.find({});
    if (!travel) {
      return response.status(404).send("No travel data found!");
    }
    response.status(200).send(travel);
    console.log("Travel data retrieved successfully!");
  } catch (error) {
    console.log(error);
    response.status(500).send("Error retrieving travel data!");
  }
};


const updateTravel = async function (request, response) {
  try {
    const { id } = request.params;
    const updateData = request.body;

    // Validate the ID (optional, but recommended)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find and update the document
    const updatedTravel = await Travel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Check if the document was found
    if (!updatedTravel) {
      return response
        .status(404)
        .json({ message: "Travel resource not found" });
    }

    // Return the updated document
    response.status(200).json({
      message: "Travel updated successfully",
      data: updatedTravel,
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error updating travel", error: error.message });
  }
};

const deleteTravel = async function (request, response) {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ error: "Invalid travel ID" });
    }

    const travel = await Travel.findByIdAndDelete(request.params.id);

    if (!travel) {
      return response.status(404).json({ error: "Travel not found" });
    }

    // Send success message
    response.status(200).json({ message: "Travel data  deleted successfully" });
  } catch (error) {
    console.error("Error deleting travel:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};
const createTravel = async function(request, response) {
  try {
    const { title, description, attractions } = request.body;
    
    // Check if file was uploaded
    if (!request.file) {
      return response.status(400).json({ 
        success: false,
        error: 'Please provide an image file' 
      });
    }

    // Get the file information
    const file = request.file;
    const filePath = file.path.replace(/\\/g, '/'); // Convert Windows paths to forward slashes
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const imageUrl = `${baseUrl}/${filePath}`;
    
    console.log('File stored at:', filePath);
    
    // Parse attractions if it's a string
    let attractionsArray = [];
    if (attractions) {
      try {
        attractionsArray = typeof attractions === 'string' 
          ? JSON.parse(attractions) 
          : attractions;
      } catch (parseError) {
        console.error('Error parsing attractions:', parseError);
        attractionsArray = [];
      }
    }
    
    // Create travel entry in database
    const travel = await Travel.create({
      title,
      description,
      image: imageUrl, // Store the URL to access the image
      attractions: attractionsArray,
    });
    
    console.log('Travel created successfully:', travel._id);
    
    response.status(201).json({
      success: true,
      data: travel
    });
    
  } catch (error) {
    console.error('Error in createTravel:', error);
    
    // Clean up file in case of error
    if (request.file?.path) {
      try {
        fs.unlinkSync(request.file.path);
        console.log('Cleaned up file after error:', request.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file after error:', unlinkError);
      }
    }
    
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    
    response.status(statusCode).json({
      success: false,
      error: error.message || 'Error creating travel data',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

module.exports = {
  getTravel,
  getAllTravel,
  createTravel,
  updateTravel,
  deleteTravel,
};
