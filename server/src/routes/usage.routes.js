const express = require("express");
const { getUsage } = require("../controllers/usage.controller");
const { verifyUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyUser, getUsage);

module.exports = router;