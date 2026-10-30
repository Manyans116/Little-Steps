require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const ChildcareCenter = require("./models/ChildcareCenter");
const Booking = require("./models/Booking");

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const providers = await User.find({
      role: "provider",
    }).select("_id name");

    console.log("\nPROVIDERS:");
    providers.forEach((provider) => {
      console.log(
        provider._id.toString(),
        "-",
        provider.name
      );
    });

    const centers = await ChildcareCenter.find()
      .populate("provider", "name");

    console.log("\nCENTERS:");
    centers.forEach((center) => {
      console.log(
        center.name,
        "| Provider:",
        center.provider
          ? center.provider.name
          : "NOT ASSIGNED"
      );
    });

    const bookings = await Booking.find()
      .populate("childcareCenter", "name")
      .populate("parent", "name");

    console.log("\nBOOKINGS:");
    bookings.forEach((booking) => {
      console.log(
        booking.childName,
        "| Center:",
        booking.childcareCenter
          ? booking.childcareCenter.name
          : "NO CENTER"
      );
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

checkData();