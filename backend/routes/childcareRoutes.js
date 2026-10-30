
const express = require("express");

const {
  getChildcareCenters,
  getChildcareCenterById,
  getProviderCenter,
  updateProviderCenter,
  createChildcareCenter,
} = require("../controllers/childcareController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createChildcareCenter);
// Get all childcare centers
router.get("/", getChildcareCenters);

// Get center assigned to a provider
router.get("/provider/:providerId", getProviderCenter);

// Update center assigned to a provider
router.put("/provider/:providerId", updateProviderCenter);

// Get one childcare center
router.get("/:id", getChildcareCenterById);

module.exports = router;
