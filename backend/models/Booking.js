const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    childcareCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChildcareCenter",
      required: true,
    },

    childName: {
      type: String,
      required: true,
      trim: true,
    },

    childAge: {
      type: Number,
      required: true,
    },

    bookingType: {
      type: String,
      enum: ["hourly", "daily", "monthly"],
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    hours: {
      type: Number,
      default: 1,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);