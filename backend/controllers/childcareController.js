const ChildcareCenter = require("../models/ChildcareCenter");


// Get all childcare centers
const getChildcareCenters = async (req, res) => {
  try {
    const centers = await ChildcareCenter.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: centers.length,
      centers,
    });
  } catch (error) {
    console.error(
      "Error fetching childcare centers:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching childcare centers",
    });
  }
};


// Get one childcare center by ID
const getChildcareCenterById = async (req, res) => {
  try {
    const center = await ChildcareCenter.findById(
      req.params.id
    );

    if (!center) {
      return res.status(404).json({
        message: "Childcare center not found",
      });
    }

    res.status(200).json(center);
  } catch (error) {
    console.error(
      "Error fetching childcare center:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching childcare center",
    });
  }
};


// Get center assigned to a provider
const getProviderCenter = async (req, res) => {
  try {
    const { providerId } = req.params;

    const center = await ChildcareCenter.findOne({
      provider: providerId,
    });

    if (!center) {
      return res.status(404).json({
        message:
          "No childcare center is assigned to this provider",
      });
    }

    res.status(200).json(center);
  } catch (error) {
    console.error(
      "Error fetching provider center:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching provider center",
    });
  }
};


// Update provider's childcare center

const updateProviderCenter = async (req, res) => {
  try {
    // Only allow a logged-in provider to update their own center
    if (
      req.user.role !== "provider" ||
      req.user._id.toString() !== req.params.providerId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this center.",
      });
    }

    const center = await ChildcareCenter.findOne({
      provider: req.user._id,
    });

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "No childcare center is assigned to this provider.",
      });
    }

    const {
      name,
      location,
      description,
      ageGroup,
      timing,
      pricePerHour,
      capacity,
    } = req.body;

    if (name !== undefined) center.name = name;
    if (location !== undefined) center.location = location;
    if (description !== undefined) center.description = description;
    if (ageGroup !== undefined) center.ageGroup = ageGroup;
    if (timing !== undefined) center.timing = timing;

    if (pricePerHour !== undefined) {
      const price = Number(pricePerHour);

      if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid price.",
        });
      }

      center.pricePerHour = price;
    }

    if (capacity !== undefined) {
      const newCapacity = Number(capacity);

      if (!Number.isInteger(newCapacity) || newCapacity < 1) {
        return res.status(400).json({
          success: false,
          message: "Capacity must be a positive whole number.",
        });
      }

      center.capacity = newCapacity;

      if (center.availableSlots > newCapacity) {
        center.availableSlots = newCapacity;
      }
    }

    await center.save();

    return res.status(200).json({
      success: true,
      message: "Childcare center updated successfully.",
      center,
    });
  } catch (error) {
    console.error("Error updating provider center:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while updating childcare center.",
    });
  }
};





const createChildcareCenter = async (req, res) => {
  try {
    const {
      providerId,
      name,
      location,
      description,
      ageGroup,
      timing,
      pricePerHour,
      capacity,
    } = req.body;

    if (
      !providerId ||
      !name ||
      !location ||
      !ageGroup ||
      !timing ||
      pricePerHour === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const User = require("../models/User");

    const provider = await User.findOne({
      _id: providerId,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found.",
      });
    }

    const existingCenter = await ChildcareCenter.findOne({
      provider: providerId,
    });

    if (existingCenter) {
      return res.status(409).json({
        success: false,
        message: "This provider already has a childcare center.",
      });
    }

    const parsedPrice = Number(pricePerHour);
    const parsedCapacity = Number(capacity ?? 10);

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isInteger(parsedCapacity) ||
      parsedCapacity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid price and capacity.",
      });
    }

    const center = await ChildcareCenter.create({
      provider: providerId,
      name,
      location,
      description: description || "",
      ageGroup,
      timing,
      pricePerHour: parsedPrice,
      capacity: parsedCapacity,
      availableSlots: parsedCapacity,
    });

    return res.status(201).json({
      success: true,
      message: "Childcare center created and assigned successfully.",
      center,
    });
  } catch (error) {
    console.error("Create childcare center error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create childcare center.",
    });
  }
};


module.exports = {
  getChildcareCenters,
  getChildcareCenterById,
  getProviderCenter,
  updateProviderCenter,
  createChildcareCenter,
};
