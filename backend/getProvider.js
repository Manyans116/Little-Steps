require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const getProvider = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const provider = await User.findOne({
      role: "provider",
    }).select("_id name email");

    if (!provider) {
      console.log("No provider account found.");
    } else {
      console.log("Provider found:");
      console.log("ID:", provider._id.toString());
      console.log("Name:", provider.name);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

getProvider();