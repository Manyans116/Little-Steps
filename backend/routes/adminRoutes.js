
const express = require("express");

const {
  getAdminStats,
  getProviders,
  updateProviderVerification,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// All admin routes require login and admin role
router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/providers", getProviders);

router.patch(
  "/providers/:providerId/verification",
  updateProviderVerification
);

module.exports = router;
