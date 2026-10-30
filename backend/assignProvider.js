require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const ChildcareCenter = require("./models/ChildcareCenter");

const assignProvider = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const provider = await User.findOne({
      role: "provider",
    });

    if (!provider) {
      console.log("No provider account found.");
      return;
    }

    const center = await ChildcareCenter.findOne({
      name: "Happy Kids Care",
    });

    if (!center) {
      console.log("Little Stars Daycare not found.");
      return;
    }

    center.provider = provider._id;
    await center.save();

    console.log("Provider assigned successfully.");
    console.log("Center:", center.name);
    console.log("Provider:", provider.name);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

assignProvider();