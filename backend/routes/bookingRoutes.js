
const express = require("express");

const {
  createBooking,
  getParentBookings,
  getProviderBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All booking routes require a logged-in user
router.use(protect);

router.post("/", createBooking);

router.get("/parent/:parentId", getParentBookings);

router.get("/provider/:providerId", getProviderBookings);

router.put("/:bookingId/status", updateBookingStatus);

module.exports = router;
