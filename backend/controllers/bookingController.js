
const Booking = require("../models/Booking");
const ChildcareCenter = require("../models/ChildcareCenter");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    // Only parents can create bookings
    if (req.user.role !== "parent") {
      return res.status(403).json({
        message: "Only parents can create bookings.",
      });
    }

    const {
      childcareCenter,
      childName,
      childAge,
      bookingType,
      bookingDate,
      hours,
    } = req.body;

    if (
      !childcareCenter ||
      !childName ||
      childAge === undefined ||
      childAge === null ||
      !bookingType ||
      !bookingDate
    ) {
      return res.status(400).json({
        message: "Please fill in all required booking details.",
      });
    }

    if (!["hourly", "daily", "monthly"].includes(bookingType)) {
      return res.status(400).json({
        message: "Invalid booking type.",
      });
    }

    const parsedHours = Number(hours ?? 1);

    if (
      !Number.isInteger(parsedHours) ||
      parsedHours < 1
    ) {
      return res.status(400).json({
        message: "Hours must be a positive whole number.",
      });
    }

    const center = await ChildcareCenter.findById(
      childcareCenter
    );

    if (!center) {
      return res.status(404).json({
        message: "Childcare center not found.",
      });
    }

    if (center.availableSlots <= 0) {
      return res.status(400).json({
        message: "No available slots at this center.",
      });
    }

    let totalAmount = 0;

    if (bookingType === "hourly") {
      totalAmount = center.pricePerHour * parsedHours;
    } else if (bookingType === "daily") {
      totalAmount = center.pricePerHour * 8;
    } else {
      totalAmount = center.pricePerHour * 8 * 26;
    }

    const booking = await Booking.create({
      // Always use the authenticated parent's ID
      parent: req.user._id,
      childcareCenter,
      childName,
      childAge,
      bookingType,
      bookingDate,
      hours: parsedHours,
      totalAmount,
      status: "pending",
    });

    // Slots are reduced only when the provider confirms.
    return res.status(201).json({
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error.message);

    return res.status(500).json({
      message: "Server error while creating booking.",
    });
  }
};


// Get bookings for the logged-in parent
const getParentBookings = async (req, res) => {
  try {
    if (
      req.user.role !== "parent" ||
      req.user._id.toString() !== req.params.parentId
    ) {
      return res.status(403).json({
        message: "You are not authorized to view these bookings.",
      });
    }

    const bookings = await Booking.find({
      parent: req.user._id,
    })
      .populate("childcareCenter")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching parent bookings:", error.message);

    return res.status(500).json({
      message: "Server error while fetching bookings.",
    });
  }
};


// Get bookings for the logged-in provider
const getProviderBookings = async (req, res) => {
  try {
    if (
      req.user.role !== "provider" ||
      req.user._id.toString() !== req.params.providerId
    ) {
      return res.status(403).json({
        message: "You are not authorized to view these bookings.",
      });
    }

    const centers = await ChildcareCenter.find({
      provider: req.user._id,
    }).select("_id");

    const centerIds = centers.map((center) => center._id);

    const bookings = await Booking.find({
      childcareCenter: { $in: centerIds },
    })
      .populate("childcareCenter")
      .populate("parent", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching provider bookings:", error.message);

    return res.status(500).json({
      message: "Server error while fetching provider bookings.",
    });
  }
};


// Confirm or reject a booking
const updateBookingStatus = async (req, res) => {
  try {
    // Only providers can manage booking status
    if (req.user.role !== "provider") {
      return res.status(403).json({
        message: "Only providers can update booking status.",
      });
    }

    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const center = await ChildcareCenter.findOne({
      _id: booking.childcareCenter,
      provider: req.user._id,
    });

    // A provider may manage bookings only for their own center
    if (!center) {
      return res.status(403).json({
        message: "You are not authorized to manage this booking.",
      });
    }

    if (booking.status === status) {
      return res.status(400).json({
        message: `Booking is already ${status}.`,
      });
    }

    if (status === "confirmed") {
      if (center.availableSlots <= 0) {
        return res.status(400).json({
          message: "No available slots. Cannot confirm booking.",
        });
      }

      center.availableSlots -= 1;
      await center.save();

      booking.status = "confirmed";
      await booking.save();

      return res.status(200).json({
        message: "Booking confirmed successfully.",
        booking,
        availableSlots: center.availableSlots,
      });
    }

    // Reject booking; restore a slot if it was confirmed
    if (booking.status === "confirmed") {
      center.availableSlots = Math.min(
        center.availableSlots + 1,
        center.capacity
      );

      await center.save();
    }

    booking.status = "rejected";
    await booking.save();

    return res.status(200).json({
      message: "Booking rejected successfully.",
      booking,
      availableSlots: center.availableSlots,
    });
  } catch (error) {
    console.error("Error updating booking status:", error.message);

    return res.status(500).json({
      message: "Server error while updating booking status.",
    });
  }
};


module.exports = {
  createBooking,
  getParentBookings,
  getProviderBookings,
  updateBookingStatus,
};
