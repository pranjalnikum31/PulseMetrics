const express = require("express");
const { verifyUser } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { createProject,getAllProjects,getProjectById } = require("../controllers/project.controller");

const router = express.Router();

router.post("/", verifyUser, authorize("OWNER", "ADMIN"), createProject);
router.get("/",verifyUser, authorize("OWNER", "ADMIN"), getAllProjects);
router.get("/:id", verifyUser, authorize("OWNER", "ADMIN"), getProjectById);

module.exports = router;
