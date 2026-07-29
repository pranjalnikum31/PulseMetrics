const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const { createApiKey,getAllApiKeys,updateApiKey } = require("../controllers/apiKey.controller");

router.post("/", verifyUser, authorize("OWNER", "ADMIN"), createApiKey);
router.get("/", verifyUser, authorize("OWNER", "ADMIN"), getAllApiKeys);
router.patch("/:id", verifyUser, authorize("OWNER", "ADMIN"), updateApiKey);

module.exports = router;
