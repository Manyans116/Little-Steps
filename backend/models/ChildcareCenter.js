const mongoose = require("mongoose");

const childcareCenterSchema = new mongoose.Schema(
  {
    provider: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    ageGroup: {
      type: String,
      required: true,
    },

    timing: {
      type: String,
      required: true,
    },

    pricePerHour: {
      type: Number,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    capacity: {
      type: Number,
      default: 10,
    },

    availableSlots: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ChildcareCenter",
  childcareCenterSchema
);