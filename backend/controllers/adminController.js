
const User = require("../models/User");
const ChildcareCenter = require("../models/ChildcareCenter");
const Booking = require("../models/Booking");

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalParents,
      totalProviders,
      totalCenters,
      totalBookings,
      pendingVerification,
      pendingBookings,
      confirmedBookings,
      rejectedBookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "parent" }),
      User.countDocuments({ role: "provider" }),
      ChildcareCenter.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({
        role: "provider",
        isVerified: false,
      }),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "rejected" }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalParents,
        totalProviders,
        totalCenters,
        totalBookings,
        pendingVerification,
        pendingBookings,
        confirmedBookings,
        rejectedBookings,
      },
    });
  } catch (error) {
    console.error("Admin statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin statistics",
    });
  }
};

const getProviders = async (req, res) => {
  try {
    const User = require("../models/User");

    const providers = await User.find({ role: "provider" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      providers,
    });
  } catch (error) {
    console.error("Get providers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch providers",
    });
  }
};

const updateProviderVerification = async (req, res) => {
  try {
    const User = require("../models/User");
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVerified must be true or false",
      });
    }

    const provider = await User.findOneAndUpdate(
      {
        _id: req.params.providerId,
        role: "provider",
      },
      { isVerified },
      { new: true, runValidators: true }
    ).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    res.json({
      success: true,
      message: isVerified
        ? "Provider verified successfully"
        : "Provider verification revoked",
      provider,
    });
  } catch (error) {
    console.error("Update verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update provider verification",
    });
  }
};


module.exports = {
  getAdminStats,
  getProviders,
  updateProviderVerification,
};
