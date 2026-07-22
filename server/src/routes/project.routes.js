const express = require("express");
const { verifyUser } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { createProject } = require("../controllers/project.controller");

const router = express.Router();

router.post("/", verifyUser, authorize("OWNER", "ADMIN"), createProject);

module.exports = router;
