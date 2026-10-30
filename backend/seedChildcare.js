const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ChildcareCenter = require("./models/ChildcareCenter");

dotenv.config();

const childcareCenters = [
  {
    name: "Little Stars Daycare",
    location: "Vijayanagar",
    description: "Trusted childcare with flexible 24×7 care.",
    rating: 4.8,
    reviews: 124,
    ageGroup: "6 months - 8 years",
    timing: "24×7",
    pricePerHour: 250,
    verified: true,
    capacity: 20,
    availableSlots: 8,
  },
  {
    name: "Happy Kids Care",
    location: "JP Nagar",
    description: "Safe and comfortable childcare for growing children.",
    rating: 4.6,
    reviews: 89,
    ageGroup: "1 - 10 years",
    timing: "7 AM - 10 PM",
    pricePerHour: 200,
    verified: true,
    capacity: 25,
    availableSlots: 12,
  },
  {
    name: "Tiny Tots Childcare",
    location: "Hebbal",
    description: "24×7 childcare with trained caregivers.",
    rating: 4.7,
    reviews: 96,
    ageGroup: "6 months - 6 years",
    timing: "24×7",
    pricePerHour: 300,
    verified: true,
    capacity: 18,
    availableSlots: 6,
  },
  {
    name: "Bright Beginnings",
    location: "Indiranagar",
    description: "A welcoming childcare center for young children.",
    rating: 4.5,
    reviews: 71,
    ageGroup: "2 - 12 years",
    timing: "6 AM - 9 PM",
    pricePerHour: 180,
    verified: true,
    capacity: 30,
    availableSlots: 15,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    await ChildcareCenter.deleteMany({});

    await ChildcareCenter.insertMany(childcareCenters);

    console.log("Childcare centers added successfully");

    await mongoose.disconnect();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();