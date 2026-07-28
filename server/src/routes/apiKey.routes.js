const express = require("express");
const router=express.Router();
const { verifyUser } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
    createApiKey,
}= require("../controllers/apiKey.controller");

router.post("/", verifyUser, authorize("OWNER", "ADMIN"), createApiKey);

module.exports = router;