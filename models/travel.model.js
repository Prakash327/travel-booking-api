const mongoose = require("mongoose");

const travelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
     
    },
    imagePublicId: {
      type: String,
     
    },
    attractions: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Travel = mongoose.model("Travel", travelSchema);
module.exports = Travel;
