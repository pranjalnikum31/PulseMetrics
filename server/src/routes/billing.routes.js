const express = require("express");
const {
  createSubscriptionController,
} = require("../controllers/billing.controller");
const {
  handleRazorpayWebhook,
} = require("../controllers/webhook.controller");
const { verifyUser } = require("../middleware/auth.middleware");
const authorize  = require("../middleware/role.middleware");

const router = express.Router();

router.post("/subscription", verifyUser, authorize("OWNER","ADMIN"), createSubscriptionController);
router.post("/webhook", handleRazorpayWebhook);

module.exports = router;
